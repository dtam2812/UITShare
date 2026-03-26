const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UITShare Marketplace Hardened Suite", function () {
  let admin, seller, buyer, feeRecipient, author;
  let nft, marketplace;

  const feeRate = 250; // 2.5%
  const price = ethers.parseEther("1.0");
  const donationAmount = ethers.parseEther("0.5");

  beforeEach(async () => {
    [admin, seller, buyer, feeRecipient, author] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("UITShareDocs");
    nft = await NFT.deploy();

    const Marketplace = await ethers.getContractFactory("UITShareMarketplace");
    marketplace = await Marketplace.deploy(
      await nft.getAddress(),
      feeRate,
      feeRecipient.address,
    );
  });

  /**
   * @dev Hàm Mint tự thích ứng với signature của UITShareDocs
   */
  async function mintAndGetId(signer, amount, uri) {
    // Tìm tất cả các hàm có tên là 'mint' trong contract
    const mintFn = nft.interface.fragments.find((f) => f.name === "mint");
    let tx;

    if (mintFn.inputs.length === 4) {
      // Trường hợp: mint(address to, uint256 amount, string uri, bytes data)
      tx = await nft.connect(signer).mint(signer.address, amount, uri, "0x");
    } else if (mintFn.inputs.length === 3) {
      // Trường hợp: mint(uint256 amount, string uri, bytes data) -> thường mặc định cho msg.sender
      tx = await nft.connect(signer).mint(amount, uri, "0x");
    } else {
      // Nếu vẫn lỗi, hãy kiểm tra lại file UITShareDocs.sol xem bạn đặt tên hàm là gì
      throw new Error(
        `Signature hàm mint không khớp. Số lượng tham số tìm thấy: ${mintFn.inputs.length}`,
      );
    }

    const receipt = await tx.wait();

    // Lấy ID từ event TransferSingle (Topic hash an toàn cho Ethers v6)
    const transferSingleTopic =
      nft.interface.getEvent("TransferSingle").topicHash;
    const log = receipt.logs.find((l) => l.topics[0] === transferSingleTopic);
    const decodedLog = nft.interface.parseLog(log);

    return decodedLog.args.id;
  }

  describe("Admin & Configuration", function () {
    it("Should emit FeeRateUpdated when fee is changed", async function () {
      await expect(marketplace.connect(admin).setFeeRate(500))
        .to.emit(marketplace, "FeeRateUpdated")
        .withArgs(500);
    });

    it("Should prevent setting fee above 20%", async function () {
      await expect(
        marketplace.connect(admin).setFeeRate(2001),
      ).to.be.revertedWith("Fee too high");
    });
  });

  describe("Donation System", function () {
    it("Should allow direct donation to contract (receive)", async function () {
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

    it("Should allow Owner to withdraw accumulated funds", async function () {
      await buyer.sendTransaction({
        to: await marketplace.getAddress(),
        value: donationAmount,
      });
      await expect(
        marketplace.connect(admin).withdrawFunds(),
      ).to.changeEtherBalance(admin, donationAmount);
    });
  });

  describe("Market Logic & Regressions", function () {
    it("Should execute order and distribute fees correctly", async function () {
      const tokenId = await mintAndGetId(seller, 1, "ipfs://test");

      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      const mktFee = (price * BigInt(feeRate)) / 10000n;
      const sellerNet = price - mktFee;

      await expect(
        marketplace.connect(buyer).executeOrder(1, { value: price }),
      ).to.changeEtherBalances([feeRecipient, seller], [mktFee, sellerNet]);
    });

    it("Should revert if buyer sends insufficient ETH", async function () {
      const tokenId = await mintAndGetId(seller, 1, "ipfs://test");
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

    it("Should delete order from storage after execution", async function () {
      const tokenId = await mintAndGetId(seller, 1, "ipfs://test");
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      await marketplace.connect(buyer).executeOrder(1, { value: price });

      const order = await marketplace.orders(1);
      expect(order.active).to.be.false;
      expect(order.seller).to.equal(ethers.ZeroAddress);
    });
  });
});
