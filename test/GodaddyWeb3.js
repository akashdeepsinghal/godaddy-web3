const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("GodaddyWeb3", () => {
  let godaddyWeb3;
  let deployer, owner1;
  const CONTRACT_NAME = "GodaddyWeb3";
  const CONTRACT_SYMBOL = "GW3";
  const DOMAIN_NAME = "akash.eth";
  const DOMAIN_COST = tokens(10);
  beforeEach(async () => {
    // Setup accounts
    [deployer, owner1] = await ethers.getSigners();

    // Deploy contract
    const GodaddyWeb3 = await ethers.getContractFactory("GodaddyWeb3");
    godaddyWeb3 = await GodaddyWeb3.deploy(CONTRACT_NAME, CONTRACT_SYMBOL);

    // List domain
    let transaction = await godaddyWeb3
      .connect(deployer)
      .list(DOMAIN_NAME, tokens(10));
    await transaction.wait();
  });

  describe("Deployment", async () => {
    it("has a name", async () => {
      const result = await godaddyWeb3.name();
      expect(result).to.be.equal(CONTRACT_NAME);
    });
    it("has a symbol", async () => {
      const result = await godaddyWeb3.symbol();
      expect(result).to.be.equal(CONTRACT_SYMBOL);
    });
    it("sets the owner", async () => {
      const result = await godaddyWeb3.owner();
      expect(result).to.be.equal(deployer.address);
    });
    it("Returns the maxSupply", async () => {
      const result = await godaddyWeb3.maxSupply();
      expect(result).to.be.equal(1);
    });
    it("Returns the totalSupply", async () => {
      const result = await godaddyWeb3.totalSupply();
      expect(result).to.be.equal(0);
    });
  });

  describe("Domain", async () => {
    it("Returns domain attributes", async () => {
      const result = await godaddyWeb3.domains(1);
      expect(result.name).to.be.equal(DOMAIN_NAME);
      expect(result.cost).to.be.equal(DOMAIN_COST);
      expect(result.isOwned).to.be.equal(false);
    });
  });

  describe("Minting", async () => {
    const ID = 1;
    const AMOUNT = tokens(10);
    beforeEach(async () => {
      // Mint domain
      let transaction = await godaddyWeb3
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();
    });
    it("Updates the owner", async () => {
      const result = await godaddyWeb3.ownerOf(ID);
      expect(result).to.be.equal(owner1.address);
    });
    it("Updates the ownership status", async () => {
      const result = await godaddyWeb3.getDomain(ID);
      expect(result.isOwned).to.be.equal(true);
    });
    it("Updates the balance", async () => {
      const result = await godaddyWeb3.getBalance();
      expect(result).to.be.equal(AMOUNT);
    });
    it("Updates the totalSupply", async () => {
      const result = await godaddyWeb3.totalSupply();
      expect(result).to.be.equal(1);
    });
  });

  describe("Withdrawal", async () => {
    const ID = 1;
    const AMOUNT = tokens(10);
    let balanceBefore;
    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      // Mint domain
      let transaction = await godaddyWeb3
        .connect(owner1)
        .mint(ID, { value: AMOUNT });
      await transaction.wait();

      // Withdraw amount
      transaction = await godaddyWeb3.connect(deployer).withdrawBalance();
      await transaction.wait();
    });
    it("Updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
    it("Updates the contract balance", async () => {
      const result = await godaddyWeb3.getBalance();
      expect(result).to.be.equal(0);
    });
  });
});
