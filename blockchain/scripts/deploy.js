const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // Deploy NFT
  const NFT = await hre.ethers.getContractFactory("DocumentNFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();

  // Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace1155");
  const marketplace = await Marketplace.deploy(
    nft.target,
    250,
    2,
    deployer.address,
  );
  await marketplace.waitForDeployment();

  console.log("NFT:", nft.target);
  console.log("Marketplace:", marketplace.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
