const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UITShareSystem", (m) => {
  // 1. Deploy the NFT Contract first
  // This is the core "Vault" for your educational documents
  const nft = m.contract("UITShareDocs");

  // 2. Deploy the SimpleNFT (Optional: only if you need it for testing)
  const simpleNft = m.contract("SimpleNFT");

  // 3. Set Marketplace parameters
  const feeRate = 250; // 2.5%
  const deployer = m.getAccount(0); // Your wallet address

  // 4. Deploy the Marketplace
  // The 'nft' variable here automatically resolves to the address of UITShareDocs
  const marketplace = m.contract("UITShareMarketplace", [
    nft, // nftAddress_
    feeRate, // feeRate_
    deployer, // feeRecipient_
  ]);

  // Return all instances so you can interact with them later
  return { nft, simpleNft, marketplace };
});
