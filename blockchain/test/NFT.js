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

  describe("mint()", function () {
    it("Should mint correctly and set creator to msg.sender", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://test", 1000, "0x");

      expect(await uitShare.balanceOf(studentA.address, 1)).to.equal(10);
      expect(await uitShare.creators(1)).to.equal(studentA.address);
      expect(await uitShare.totalSupply(1)).to.equal(10);
      expect(await uitShare.uri(1)).to.equal("ipfs://test");
    });

    it("Should set royalty correctly on mint", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://royalty", 1000, "0x"); 

      const [receiver, amount] = await uitShare.royaltyInfo(1, ethers.parseEther("1"));
      expect(receiver).to.equal(studentA.address);
      expect(amount).to.equal(ethers.parseEther("0.1")); 
    });

    it("Should emit DocumentMinted event", async function () {
      await expect(uitShare.connect(studentA).mint(5, "ipfs://event", 1000, "0x"))
        .to.emit(uitShare, "DocumentMinted")
        .withArgs(1, studentA.address, 5, "ipfs://event");
    });

    it("Should increment tokenId correctly", async function () {
      await uitShare.connect(studentA).mint(1, "ipfs://first", 1000, "0x");
      await uitShare.connect(studentB).mint(1, "ipfs://second", 500, "0x");

      expect(await uitShare.getCurrentTokenId()).to.equal(2);
      expect(await uitShare.creators(1)).to.equal(studentA.address);
      expect(await uitShare.creators(2)).to.equal(studentB.address);
    });

    it("Should revert if royaltyBps is 0", async function () {
      await expect(
        uitShare.connect(studentA).mint(1, "ipfs://noroyalty", 0, "0x"),
      ).to.be.revertedWith("Royalty required");
    });

    it("Should revert if royaltyBps exceeds 50%", async function () {
      await expect(
        uitShare.connect(studentA).mint(1, "ipfs://toohigh", 5001, "0x"),
      ).to.be.revertedWith("Royalty too high");
    });
  });

  describe("mintTo()", function () {
    it("Should allow owner to mintTo a user with royalty", async function () {
      await uitShare.connect(admin).mintTo(studentA.address, 10, "ipfs://mintto", 1000, "0x");

      expect(await uitShare.balanceOf(studentA.address, 1)).to.equal(10);
      expect(await uitShare.creators(1)).to.equal(studentA.address);

      const [receiver, amount] = await uitShare.royaltyInfo(1, ethers.parseEther("1"));
      expect(receiver).to.equal(studentA.address);
      expect(amount).to.equal(ethers.parseEther("0.1"));
    });

    it("Should revert if non-owner calls mintTo", async function () {
      await expect(
        uitShare.connect(studentA).mintTo(studentB.address, 10, "ipfs://hack", 1000, "0x"),
      ).to.be.revertedWithCustomError(uitShare, "OwnableUnauthorizedAccount");
    });

    it("Should emit DocumentMinted with creator = to_ not admin", async function () {
      await expect(
        uitShare.connect(admin).mintTo(studentA.address, 5, "ipfs://creator", 500, "0x"),
      )
        .to.emit(uitShare, "DocumentMinted")
        .withArgs(1, studentA.address, 5, "ipfs://creator");
    });

    it("Should revert if royaltyBps is 0", async function () {
      await expect(
        uitShare.connect(admin).mintTo(studentA.address, 1, "ipfs://noroyalty", 0, "0x"),
      ).to.be.revertedWith("Royalty required");
    });
  });

  describe("setRoyalty()", function () {
    it("Should allow creator to update royalty", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://royalty", 1000, "0x");
      await uitShare.connect(studentA).setRoyalty(1, studentA.address, 2000); // update lên 20%

      const [receiver, amount] = await uitShare.royaltyInfo(1, ethers.parseEther("1"));
      expect(receiver).to.equal(studentA.address);
      expect(amount).to.equal(ethers.parseEther("0.2"));
    });

    it("Should revert if non-creator tries to set royalty", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://royalty2", 1000, "0x");

      await expect(
        uitShare.connect(studentB).setRoyalty(1, studentB.address, 1000),
      ).to.be.revertedWith("Not creator");
    });

    it("Should revert if royalty exceeds 50%", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://royalty3", 1000, "0x");

      await expect(
        uitShare.connect(studentA).setRoyalty(1, studentA.address, 5001),
      ).to.be.revertedWith("Royalty too high");
    });

    it("Should revert if token does not exist", async function () {
      await expect(
        uitShare.connect(studentA).setRoyalty(999, studentA.address, 1000),
      ).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Edge Case: Burn to Zero", function () {
    it("Should allow burning the total supply to 0 and maintain state consistency", async function () {
      await uitShare.connect(studentA).mint(100, "ipfs://zero-test", 1000, "0x");
      await uitShare.connect(studentA).burn(studentA.address, 1, 100);

      expect(await uitShare.totalSupply(1)).to.equal(0);
      expect(await uitShare.balanceOf(studentA.address, 1)).to.equal(0);
      expect(await uitShare.creators(1)).to.equal(studentA.address);
      expect(await uitShare.uri(1)).to.equal("ipfs://zero-test");
    });

    it("Should revert if burning more than balance (Underflow check)", async function () {
      await uitShare.connect(studentA).mint(10, "ipfs://underflow", 1000, "0x");

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
      expect(await uitShare.supportsInterface(INTERFACE_IDS.ERC1155)).to.be.true;
      expect(await uitShare.supportsInterface(INTERFACE_IDS.ERC2981)).to.be.true;
    });
  });

  describe("Validation Logic", function () {
    it("Should fail if minting with an empty URI", async function () {
      await expect(
        uitShare.connect(studentA).mint(1, "", 1000, "0x"),
      ).to.be.revertedWith("URI cannot be empty");
    });

    it("Should fail when querying URI for a token that was never minted", async function () {
      await expect(uitShare.uri(999)).to.be.revertedWith(
        "URI query for nonexistent token",
      );
    });

    it("Should fail if amount is 0", async function () {
      await expect(
        uitShare.connect(studentA).mint(0, "ipfs://zero", 1000, "0x"),
      ).to.be.revertedWith("Invalid amount");
    });

    it("Should fail if amount exceeds MAX_SUPPLY_LIMIT", async function () {
      await expect(
        uitShare.connect(studentA).mint(1001, "ipfs://overlimit", 1000, "0x"),
      ).to.be.revertedWith("Invalid amount");
    });
  });

  describe("Approval Edge Case", function () {
    it("Should allow an approved operator to burn exactly the full balance", async function () {
      await uitShare.connect(studentA).mint(50, "ipfs://approval", 1000, "0x");
      await uitShare.connect(studentA).setApprovalForAll(studentB.address, true);

      await expect(uitShare.connect(studentB).burn(studentA.address, 1, 50))
        .to.emit(uitShare, "DocumentBurned")
        .withArgs(1, studentA.address, 50);

      expect(await uitShare.totalSupply(1)).to.equal(0);
    });

    it("Should revert if unapproved operator tries to burn", async function () {
      await uitShare.connect(studentA).mint(50, "ipfs://unapproved", 1000, "0x");

      await expect(
        uitShare.connect(studentB).burn(studentA.address, 1, 10),
      ).to.be.revertedWith("Not owner nor approved");
    });
  });
});