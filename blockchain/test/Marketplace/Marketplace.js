const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace1155", function () {
  let admin, seller, buyer, feeRecipient;
  let nft, marketplace;

  const feeRate = 250; // 2.5%
  const feeDecimal = 2;

  beforeEach(async () => {
    [admin, seller, buyer, feeRecipient] = await ethers.getSigners();

    // Deploy NFT
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("Marketplace1155");
    marketplace = await Marketplace.deploy(
      nft.address,
      feeRate,
      feeDecimal,
      feeRecipient.address,
    );
    await marketplace.deployed();

    // Mint NFT (ERC1155)
    await nft.mint(seller.address, 1, 10);
  });

  // ================= COMMON =================
  describe("common", function () {
    it("feeRate correct", async () => {
      expect(await marketplace.feeRate()).to.equal(feeRate);
    });

    it("feeRecipient correct", async () => {
      expect(await marketplace.feeRecipient()).to.equal(feeRecipient.address);
    });
  });

  // ================= ADD ORDER =================
  describe("addOrder", function () {
    beforeEach(async () => {
      await nft.connect(seller).setApprovalForAll(marketplace.address, true);
    });

    it("should revert if price = 0", async () => {
      await expect(
        marketplace.connect(seller).addOrder(1, 0, 5),
      ).to.be.revertedWith("Price must be > 0");
    });

    it("should add order correctly", async () => {
      const tx = await marketplace
        .connect(seller)
        .addOrder(1, ethers.utils.parseEther("1"), 5);

      await expect(tx).to.emit(marketplace, "OrderAdded");

      const order = await marketplace.orders(1);
      expect(order.amount).to.equal(5);
    });
  });

  // ================= CANCEL =================
  describe("cancelOrder", function () {
    beforeEach(async () => {
      await nft.connect(seller).setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(seller)
        .addOrder(1, ethers.utils.parseEther("1"), 5);
    });

    it("should revert if not seller", async () => {
      await expect(
        marketplace.connect(buyer).cancelOrder(1),
      ).to.be.revertedWith("Not seller");
    });

    it("should cancel correctly", async () => {
      const tx = await marketplace.connect(seller).cancelOrder(1);

      await expect(tx).to.emit(marketplace, "OrderCancelled").withArgs(1);
    });
  });

  // ================= EXECUTE =================
  describe("executeOrder", function () {
    beforeEach(async () => {
      await nft.connect(seller).setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(seller)
        .addOrder(1, ethers.utils.parseEther("1"), 5);
    });

    it("should revert if not enough ETH", async () => {
      await expect(
        marketplace.connect(buyer).executeOrder(1, 1, { value: 0 }),
      ).to.be.revertedWith("Wrong ETH");
    });

    it("should buy correctly", async () => {
      const price = ethers.utils.parseEther("1");

      const tx = await marketplace
        .connect(buyer)
        .executeOrder(1, 2, { value: price.mul(2) });

      await expect(tx).to.emit(marketplace, "OrderExecuted");

      const order = await marketplace.orders(1);
      expect(order.amount).to.equal(3);
    });
  });

  // ================= DONATE =================
  describe("donate", function () {
    it("should donate correctly", async () => {
      const amount = ethers.utils.parseEther("1");

      const tx = await marketplace
        .connect(buyer)
        .donateToAuthor(1, { value: amount });

      await expect(tx).to.emit(marketplace, "Donated");
    });
  });
});
