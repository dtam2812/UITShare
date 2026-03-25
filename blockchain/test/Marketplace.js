const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UITShare Marketplace Hardened Suite", function () {
  let admin, seller, buyer, feeRecipient, author;
  let nft, marketplace;

  const feeRate = 250; // 2.5%
  const price = ethers.parseEther("1.0");

  beforeEach(async () => {
    [admin, seller, buyer, feeRecipient, author] = await ethers.getSigners();

    // Deploy Standard NFT Contract (Supports ERC2981)
    const NFT = await ethers.getContractFactory("UITShareDocs");
    nft = await NFT.deploy();

    // Deploy Marketplace Contract
    const Marketplace = await ethers.getContractFactory("UITShareMarketplace");
    marketplace = await Marketplace.deploy(
      await nft.getAddress(),
      feeRate,
      feeRecipient.address,
    );
  });

  // Helper function to mint NFT and retrieve its unique Token ID from events

  async function mintAndGetId(signer, amount, uri) {
    const tx = await nft.connect(signer).mint(amount, uri, "0x");
    const receipt = await tx.wait();
    const event = receipt.logs.find(
      (log) => log.fragment && log.fragment.name === "TransferSingle",
    );
    return event.args.id;
  }

  describe("Real Logic: ERC2981 Support", function () {
    it("Should handle NFT WITHOUT ERC2981 support (NO AUTHOR CASE)", async function () {
      // 1. Deploy a "Blind" NFT contract that does not implement Royalty logic
      const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
      const simpleNft = await SimpleNFT.deploy();

      const marketNoRoyalty = await (
        await ethers.getContractFactory("UITShareMarketplace")
      ).deploy(await simpleNft.getAddress(), feeRate, feeRecipient.address);

      // 2. Mint NFT for Seller (Token ID 100)
      await simpleNft.mint(seller.address, 100, 1);
      await simpleNft
        .connect(seller)
        .setApprovalForAll(await marketNoRoyalty.getAddress(), true);
      await marketNoRoyalty.connect(seller).addOrder(100, 1, price);

      // 3. Calculation: Only Seller and FeeRecipient should receive funds
      const feeAmt = (price * 250n) / 10000n;
      const sellerProceeds = price - feeAmt;

      // Verifying only the accounts that actually participate in the fund distribution
      await expect(
        marketNoRoyalty.connect(buyer).executeOrder(1, { value: price }),
      ).to.changeEtherBalances(
        [seller, feeRecipient],
        [sellerProceeds, feeAmt],
      );

      // 4. Verify Ownership Transfer
      expect(await simpleNft.balanceOf(buyer.address, 100)).to.equal(1);
    });

    it("Should handle NFT WITH ERC2981 but Royalty is set to 0", async function () {
      const tokenId = await mintAndGetId(author, 1, "ipfs://free-royalty");

      // Scenario: Author transfers NFT to Seller for secondary sale
      await nft
        .connect(author)
        .safeTransferFrom(author.address, seller.address, tokenId, 1, "0x");

      // Explicitly set Royalty Fee to 0%
      await nft.connect(author).setTokenRoyaltyFee(tokenId, 0);

      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(tokenId, 1, price);

      const feeAmt = (price * 250n) / 10000n;
      const sellerAmt = price - feeAmt;

      // Verification: Check that Author receives 0 ETH as expected
      await expect(
        marketplace.connect(buyer).executeOrder(1, { value: price }),
      ).to.changeEtherBalances(
        [seller, feeRecipient, author],
        [sellerAmt, feeAmt, 0],
      );
    });
  });

  describe("Multi-Order & State Verification", function () {
    it("Should isolate different orders and verify ownership", async function () {
      const id1 = await mintAndGetId(seller, 1, "ipfs://1");
      const id2 = await mintAndGetId(seller, 1, "ipfs://2");

      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);

      await marketplace.connect(seller).addOrder(id1, 1, price); // Creates Order Index 1
      await marketplace.connect(seller).addOrder(id2, 1, price); // Creates Order Index 2

      // Execute purchase for Order 1
      await marketplace.connect(buyer).executeOrder(1, { value: price });

      // Verify State after transaction
      expect(await nft.balanceOf(buyer.address, id1)).to.equal(1);

      // Order 2 must remain in Marketplace escrow
      expect(await nft.balanceOf(await marketplace.getAddress(), id2)).to.equal(
        1,
      );

      // Verify that Order 1 is correctly deactivated in contract state
      const order1 = await marketplace.orders(1);
      expect(order1.active).to.be.false;
    });
  });

  describe("Hardened Reverts", function () {
    it("Should revert with exact error messages", async function () {
      // 1. Test case for nonexistent or invalid Order ID
      await expect(
        marketplace.connect(buyer).executeOrder(999, { value: price }),
      ).to.be.revertedWith("Order not found or inactive");

      // 2. Test case for insufficient ETH sent by the buyer
      const id = await mintAndGetId(seller, 1, "ipfs://low");
      await nft
        .connect(seller)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace.connect(seller).addOrder(id, 1, price);

      await expect(
        marketplace
          .connect(buyer)
          .executeOrder(1, { value: ethers.parseEther("0.1") }),
      ).to.be.revertedWith("Insufficient ETH");
    });
  });
});
