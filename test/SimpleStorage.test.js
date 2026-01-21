const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage 合约测试", function () {
  let simpleStorage;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy(42);
    await simpleStorage.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确设置初始值", async function () {
      expect(await simpleStorage.get()).to.equal(42);
    });

    it("应该正确设置所有者", async function () {
      expect(await simpleStorage.owner()).to.equal(owner.address);
    });
  });

  describe("存储数据", function () {
    it("应该能够设置新值", async function () {
      await simpleStorage.set(100);
      expect(await simpleStorage.get()).to.equal(100);
    });

    it("设置新值应该触发事件", async function () {
      await expect(simpleStorage.set(100))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(42, 100, owner.address);
    });

    it("任何账户都应该能够设置值", async function () {
      await simpleStorage.connect(addr1).set(200);
      expect(await simpleStorage.get()).to.equal(200);
    });
  });

  describe("增加数据", function () {
    it("应该能够增加值", async function () {
      await simpleStorage.increment(10);
      expect(await simpleStorage.get()).to.equal(52);
    });

    it("增加值应该触发事件", async function () {
      await expect(simpleStorage.increment(10))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(42, 52, owner.address);
    });
  });
});

