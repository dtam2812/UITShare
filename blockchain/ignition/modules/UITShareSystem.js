const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UITShareSystem", (m) => {
  const nft = m.contract("UITShareNFT");

  const feeRate = 250;
  const deployer = m.getAccount(0);

  const marketplace = m.contract("UITShareMarketplace", [
    nft,
    feeRate,
    deployer,
  ]);

  return { nft, marketplace };
});
