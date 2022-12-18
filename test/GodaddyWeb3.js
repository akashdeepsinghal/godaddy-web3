const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("GodaddyWeb3", () => {
  let godaddyWeb3;
  let deployer, owner1;
  const NAME = "Akash Singhal";
  const SYMBL = "ADS";
  beforeEach(async () => {
    [deployer, owner1] = await ethers.getSigners();
    const GodaddyWeb3 = await ethers.getContractFactory("GodaddyWeb3");
    godaddyWeb3 = await GodaddyWeb3.deploy(NAME, SYMBL);
  });

  describe("Deployment", async () => {
    it("has a name", async () => {
      const result = await godaddyWeb3.name();
      expect(result).to.be.equal(NAME);
    });
    it("has a symbol", async () => {
      const result = await godaddyWeb3.symbol();
      expect(result).to.be.equal(SYMBL);
    });
    it("sets the owner", async () => {
      const result = await godaddyWeb3.owner();
      expect(result).to.be.equal(deployer.address);
    });
  });
});
