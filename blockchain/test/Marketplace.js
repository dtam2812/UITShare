const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UITShare Marketplace Hardened Suite", function () {
  let admin, seller, buyer, feeRecipient, other;
  let nft, marketplace;

  const feeRate = 250; // 2.5%
  const royaltyBps = 1000; // 10%
  const price = ethers.parseEther("1.0");
  const donationAmount = ethers.parseEther("0.5");

  beforeEach(async () => {
    [admin, seller, buyer, feeRecipient, other] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("UITShareNFT");
    nft = await NFT.deploy();

    const Marketplace = await ethers.getContractFactory("UITShareMarketplace");
    marketplace = await Marketplace.deploy(
      await nft.getAddress(),
      feeRate,
      feeRecipient.address,
    );
  });

  async function mintToken(signer, amount, royalty = royaltyBps) {
    const tx = await nft
      .connect(signer)
      .mint(amount, "ipfs://test", royalty, "0x");
    const receipt = await tx.wait();

    const transferSingleTopic =
      nft.interface.getEvent("TransferSingle").topicHash;
    const log = receipt.logs.find((l) => l.topics[0] === transferSingleTopic);
    const decoded = nft.interface.parseLog(log);
    return decoded.args.id;
  }

  // Helper: tính phí
  function calcFees(totalPrice, feeRateBps, royaltyBps) {
    const mktFee = (totalPrice * BigInt(feeRateBps)) / 10000n;
    const royalty = (totalPrice * BigInt(royaltyBps)) / 10000n;
    const sellerNet = totalPrice - mktFee - royalty;
    return { mktFee, royalty, sellerNet };
  }

  describe("Admin & Configuration", function () {
    it("Should set correct initial values", async function () {
      expect(await marketplace.feeRate()).to.equal(feeRate);
      expect(await marketplace.feeRecipient()).to.equal(feeRecipient.address);
    });

    it("Should emit FeeRateUpdated when fee is changed", async function () {
      await expect(marketplace.connect(admin).setFeeRate(500))
        .to.emit(marketplace, "FeeRateUpdated")
        .withArgs(500);
      expect(await marketplace.feeRate()).to.equal(500);
    });

    it("Should prevent setting fee above 20%", async function () {
      await expect(
        marketplace.connect(admin).setFeeRate(2001),
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow setting fee to exactly 20%", async function () {
      await expect(marketplace.connect(admin).setFeeRate(2000)).to.not.be
        .reverted;
    });

    it("Should revert setFeeRate if not owner", async function () {
      await expect(marketplace.connect(buyer).setFeeRate(100)).to.be.reverted;
    });

    it("Should emit FeeRecipientUpdated when recipient is changed", async function () {
      await expect(marketplace.connect(admin).setFeeRecipient(other.address))
        .to.emit(marketplace, "FeeRecipientUpdated")
        .withArgs(other.address);
    });

    it("Should revert setFeeRecipient with zero address", async function () {
      await expect(
        marketplace.connect(admin).setFeeRecipient(ethers.ZeroAddress),
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("Donation System", function () {
    it("Should emit Donated when ETH sent directly to contract", async function () {
      await expect(
        buyer.sendTransaction({
          to: await marketplace.getAddress(),
          value: donationAmount,
        }),
      ).to.emit(marketplace, "Donated");
    });

    it("Should allow donation to a specific seller", async function () {
      await expect(() =>
        marketplace
          .connect(buyer)
          .donateToSeller(seller.address, { value: donationAmount }),
      ).to.changeEtherBalance(seller, donationAmount);
    });

    it("Should revert donateToSeller with zero address", async function () {
      await expect(
        marketplace
          .connect(buyer)
          .donateToSeller(ethers.ZeroAddress, { value: donationAmount }),
      ).to.be.revertedWith("Invalid seller address");
    });

    it("Should allow donation to author via tokenId", async function () {
      const tokenId = await mintToken(seller, 10);
      await expect(() =>
        marketplace
          .connect(buyer)
          .donateToAuthor(tokenId, { value: donationAmount }),
      ).to.changeEtherBalance(seller, donationAmount);
    });

    it("Should allow owner to withdraw accumulated funds", async function () {
      await buyer.sendTransaction({
        to: await marketplace.getAddress(),
        value: donationAmount,
      });
      await expect(
        marketplace.connect(admin).withdrawFunds(),
      ).to.changeEtherBalance(admin, donationAmount);
    });

    it("Should revert withdrawFunds if no balance", async function () {
      await expect(
        marketplace.connect(admin).withdrawFunds(),
      ).to.be.revertedWith("No funds");
    });

    it("Should revert withdrawFunds if not owner", async function () {
      await buyer.sendTransaction({
        to: await marketplace.getAddress(),
        value: donationAmount,
      });
      await expect(marketplace.connect(buyer).withdrawFunds()).to.be.reverted;
    });
  });

  describe("addOrder", function () {
    it("Should emit OrderAdded and lock NFT in contract", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      await expect(marketplace.connect(seller).addOrder(tokenId, 3, price))
        .to.emit(marketplace, "OrderAdded")
        .withArgs(1, seller.address, tokenId, 3, price);

      expect(
        await nft.balanceOf(await marketplace.getAddress(), tokenId),
      ).to.equal(3);
    });

    it("Should revert if not approved", async function () {
      const tokenId = await mintToken(seller, 10);
      await expect(
        marketplace.connect(seller).addOrder(tokenId, 1, price),
      ).to.be.revertedWith("Not approved");
    });

    it("Should revert if insufficient balance", async function () {
      const tokenId = await mintToken(seller, 1);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await expect(
        marketplace.connect(seller).addOrder(tokenId, 5, price),
      ).to.be.revertedWith("Insufficient balance");
    });

    it("Should revert if amount = 0", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await expect(
        marketplace.connect(seller).addOrder(tokenId, 0, price),
      ).to.be.revertedWith("Amount > 0");
    });
  });

  describe("cancelOrder", function () {
    it("Should return NFT to seller and emit OrderCancelled", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 3, price);

      const balanceBefore = await nft.balanceOf(seller.address, tokenId);

      await expect(marketplace.connect(seller).cancelOrder(1))
        .to.emit(marketplace, "OrderCancelled")
        .withArgs(1);

      expect(await nft.balanceOf(seller.address, tokenId)).to.equal(
        balanceBefore + 3n,
      );
    });

    it("Should revert if not the seller", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      await expect(
        marketplace.connect(buyer).cancelOrder(1),
      ).to.be.revertedWith("Unauthorized or inactive");
    });

    it("Should revert if order already cancelled", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);
      await marketplace.connect(seller).cancelOrder(1);

      await expect(
        marketplace.connect(seller).cancelOrder(1),
      ).to.be.revertedWith("Unauthorized or inactive");
    });
  });

  describe("executeOrder", function () {
    it("Should distribute fees correctly to feeRecipient, author, seller", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      const { mktFee, royalty, sellerNet } = calcFees(
        price,
        feeRate,
        royaltyBps,
      );

      await expect(
        marketplace.connect(buyer).executeOrder(1, { value: price }),
      ).to.changeEtherBalances(
        [feeRecipient, seller, buyer],
        [mktFee, sellerNet + royalty, -price],
      );
    });

    it("Should pay royalty to original author when reseller is different from author", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 2, price);
      await marketplace.connect(buyer).executeOrder(1, { value: price });

      await nft
        .connect(buyer)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(buyer).addOrder(tokenId, 1, price);

      const { mktFee, royalty, sellerNet } = calcFees(
        price,
        feeRate,
        royaltyBps,
      );

      await expect(
        marketplace.connect(other).executeOrder(2, { value: price }),
      ).to.changeEtherBalances(
        [feeRecipient, seller, buyer],
        [mktFee, royalty, sellerNet],
      );
    });

    it("Should transfer NFT to buyer", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      await marketplace.connect(buyer).executeOrder(1, { value: price });

      expect(await nft.balanceOf(buyer.address, tokenId)).to.equal(1);
    });

    it("Should delete order from storage after execution", async function () {
      const tokenId = await mintToken(seller, 1, royaltyBps);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);
      await marketplace.connect(buyer).executeOrder(1, { value: price });

      const order = await marketplace.orders(1);
      expect(order.active).to.be.false;
      expect(order.seller).to.equal(ethers.ZeroAddress);
    });

    it("Should refund excess ETH to buyer", async function () {
      const tokenId = await mintToken(seller, 1);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      const overpay = ethers.parseEther("1.5");
      const balanceBefore = await ethers.provider.getBalance(buyer.address);
      const tx = await marketplace
        .connect(buyer)
        .executeOrder(1, { value: overpay });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(buyer.address);

      expect(balanceBefore - balanceAfter - gasUsed).to.equal(price);
    });

    it("Should revert if buyer sends insufficient ETH", async function () {
      const tokenId = await mintToken(seller, 1);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      await expect(
        marketplace
          .connect(buyer)
          .executeOrder(1, { value: ethers.parseEther("0.1") }),
      ).to.be.revertedWith("Insufficient ETH");
    });

    it("Should revert if seller tries to buy own order", async function () {
      const tokenId = await mintToken(seller, 1);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      await expect(
        marketplace.connect(seller).executeOrder(1, { value: price }),
      ).to.be.revertedWith("Seller cannot buy");
    });

    it("Should revert if order is inactive", async function () {
      const tokenId = await mintToken(seller, 1);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);
      await marketplace.connect(seller).cancelOrder(1);

      await expect(
        marketplace.connect(buyer).executeOrder(1, { value: price }),
      ).to.be.revertedWith("Order inactive");
    });
  });

  describe("transferWithRoyalty", function () {
    it("Should transfer NFT and pay royalty to author", async function () {
      const tokenId = await mintToken(other, 10);

      await nft
        .connect(other)
        .safeTransferFrom(other.address, seller.address, tokenId, 10, "0x");

      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      const transferValue = ethers.parseEther("1.0");
      const royaltyAmount = (transferValue * BigInt(royaltyBps)) / 10000n;

      await expect(
        marketplace
          .connect(seller)
          .transferWithRoyalty(buyer.address, tokenId, 1, transferValue, {
            value: royaltyAmount,
          }),
      ).to.changeEtherBalances(
        [seller, other],
        [-royaltyAmount, royaltyAmount],
      );

      expect(await nft.balanceOf(buyer.address, tokenId)).to.equal(1);
    });

    it("Should pay royalty to original author when transferrer is reseller", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);
      await marketplace.connect(buyer).executeOrder(1, { value: price });

      await nft
        .connect(buyer)
        .setApprovalForAll(await marketplace.getAddress(), true);
      const transferValue = ethers.parseEther("1.0");
      const royaltyAmount = (transferValue * BigInt(royaltyBps)) / 10000n;

      await expect(
        marketplace
          .connect(buyer)
          .transferWithRoyalty(other.address, tokenId, 1, transferValue, {
            value: royaltyAmount,
          }),
      ).to.changeEtherBalances(
        [seller, buyer, other],
        [royaltyAmount, -royaltyAmount, 0n],
      );

      expect(await nft.balanceOf(other.address, tokenId)).to.equal(1);
    });

    it("Should emit TransferWithRoyalty event", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      const transferValue = ethers.parseEther("1.0");
      const royaltyAmount = (transferValue * BigInt(royaltyBps)) / 10000n;

      await expect(
        marketplace
          .connect(seller)
          .transferWithRoyalty(buyer.address, tokenId, 1, transferValue, {
            value: royaltyAmount,
          }),
      )
        .to.emit(marketplace, "TransferWithRoyalty")
        .withArgs(seller.address, buyer.address, tokenId, 1, royaltyAmount);
    });

    it("Should refund excess ETH", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      const transferValue = ethers.parseEther("1.0");
      const royaltyAmount = (transferValue * BigInt(royaltyBps)) / 10000n;
      const overpay = royaltyAmount + ethers.parseEther("0.5");

      const balanceBefore = await ethers.provider.getBalance(seller.address);
      const tx = await marketplace
        .connect(seller)
        .transferWithRoyalty(buyer.address, tokenId, 1, transferValue, {
          value: overpay,
        });
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(seller.address);

      expect(balanceBefore - balanceAfter).to.be.closeTo(
        gasUsed,
        ethers.parseEther("0.001"),
      );
    });

    it("Should revert if insufficient ETH for royalty", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      const transferValue = ethers.parseEther("1.0");

      await expect(
        marketplace
          .connect(seller)
          .transferWithRoyalty(buyer.address, tokenId, 1, transferValue, {
            value: 0,
          }),
      ).to.be.revertedWith("Insufficient ETH for royalty");
    });

    it("Should revert if transfer to self", async function () {
      const tokenId = await mintToken(seller, 10);
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      await expect(
        marketplace
          .connect(seller)
          .transferWithRoyalty(seller.address, tokenId, 1, price, {
            value: price,
          }),
      ).to.be.revertedWith("Cannot transfer to self");
    });

    it("Should revert if not approved", async function () {
      const tokenId = await mintToken(seller, 10);

      await expect(
        marketplace
          .connect(seller)
          .transferWithRoyalty(buyer.address, tokenId, 1, price, {
            value: price,
          }),
      ).to.be.revertedWith("Not approved");
    });
  });

  describe("getRoyaltyInfo", function () {
    it("Should return correct author and royalty amount", async function () {
      const tokenId = await mintToken(seller, 10);
      const transferValue = ethers.parseEther("1.0");
      const expectedRoyalty = (transferValue * BigInt(royaltyBps)) / 10000n;

      const [author, royaltyAmount] = await marketplace.getRoyaltyInfo(
        tokenId,
        transferValue,
      );

      expect(author).to.equal(seller.address);
      expect(royaltyAmount).to.equal(expectedRoyalty);
    });
  });
});
