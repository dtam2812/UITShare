const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // 1. Deploy NFT
  const NFT = await hre.ethers.getContractFactory("UITShareNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  console.log("UITShareNFT deployed to:", nft.target);

  // 2. Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory(
    "UITShareMarketplace",
  );

  const marketplace = await Marketplace.deploy(
    nft.target,
    250,
    deployer.address,
  );

  await marketplace.waitForDeployment();
  console.log("UITShareMarketplace deployed to:", marketplace.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
