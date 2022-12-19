// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  // Setup accounts and variables
  const [deployer] = await ethers.getSigners();

  const CONTRACT_NAME = "GodaddyWeb3";
  const CONTRACT_SYMBOL = "GW3";

  // Deploy contract
  const GodaddyWeb3 = await ethers.getContractFactory("GodaddyWeb3");
  const godaddyWeb3 = await GodaddyWeb3.deploy(CONTRACT_NAME, CONTRACT_SYMBOL);
  await godaddyWeb3.deployed();
  console.log(
    `Deployed domain contract ${CONTRACT_NAME} at: ${godaddyWeb3.address}`
  );

  // Creating a list of domains and price
  const domains = [
    { name: "google.eth", price: tokens(25) },
    { name: "apple.eth", price: tokens(30) },
    { name: "facebook.eth", price: tokens(10) },
    { name: "microsoft.eth", price: tokens(20) },
    { name: "netflix.eth", price: tokens(5) },
    { name: "amazon.eth", price: tokens(15) },
  ];

  // List domains
  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    let transaction = await godaddyWeb3
      .connect(deployer)
      .list(domain.name, domain.price);
    await transaction.wait();
    console.log(`Listed domain${i + 1}: ${domain.name}`);
  }
}

// This pattern is recommended to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
