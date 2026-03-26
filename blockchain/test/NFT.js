const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UIT Share NFT (Edge Cases & Standards Audit)", function () {
  let admin, studentA, studentB;
  let uitShare;

  const INTERFACE_IDS = {
    ERC165: "0x01ffc9a7",
    ERC1155: "0xd9b67a26",
    ERC2981: "0x2a55205a",
  };

  beforeEach(async function () {
    [admin, studentA, studentB] = await ethers.getSigners();
    const UITShareNFT = await ethers.getContractFactory("UITShareNFT");
    uitShare = await UITShareNFT.deploy();
    await uitShare.waitForDeployment();
  });

  describe("Edge Case: Burn to Zero", function () {
    it("Should allow burning the total supply to 0 and maintain state consistency", async function () {
      const amount = 100;
      await uitShare.connect(studentA).mint(amount, "ipfs://zero-test", "0x");

      await uitShare.connect(studentA).burn(studentA.address, 1, amount);

      expect(await uitShare.totalSupply(1)).to.equal(0);
      expect(await uitShare.balanceOf(studentA.address, 1)).to.equal(0);

      expect(await uitShare.creators(1)).to.equal(studentA.address);
      expect(await uitShare.uri(1)).to.equal("ipfs://zero-test");
    });

    it("Should revert if burning more than balance (Underflow check)", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://underflow", "0x");

      await expect(
        uitShare.connect(studentA).burn(studentA.address, 1, 11),
      ).to.be.revertedWith("Burn amount exceeds balance");
    });
  });

  describe("Standards Compliance (EIP-165)", function () {
    it("Should support ERC165 interface ID correctly", async function () {
      expect(await uitShare.supportsInterface(INTERFACE_IDS.ERC165)).to.be.true;
    });

    it("Should support ERC1155 and ERC2981", async function () {
      expect(await uitShare.supportsInterface(INTERFACE_IDS.ERC1155)).to.be
        .true;
      expect(await uitShare.supportsInterface(INTERFACE_IDS.ERC2981)).to.be
        .true;
    });
  });

  describe("Validation Logic", function () {
    it("Should fail if minting with an empty URI (Zero-length check)", async function () {
      await expect(
        uitShare.connect(studentA).mint(1, "", "0x"),
      ).to.be.revertedWith("URI cannot be empty");
    });

    it("Should fail when querying URI for a token that was never minted", async function () {
      await expect(uitShare.uri(999)).to.be.revertedWith(
        "URI query for nonexistent token",
      );
    });
  });

  describe("Approval Edge Case", function () {
    it("Should allow an approved operator to burn exactly the full balance", async function () {
      await uitShare.connect(studentA).mint(50, "ipfs://approval", "0x");
      await uitShare
        .connect(studentA)
        .setApprovalForAll(studentB.address, true);

      await expect(uitShare.connect(studentB).burn(studentA.address, 1, 50))
        .to.emit(uitShare, "DocumentBurned")
        .withArgs(1, studentA.address, 50);

      expect(await uitShare.totalSupply(1)).to.equal(0);
    });
  });
});
