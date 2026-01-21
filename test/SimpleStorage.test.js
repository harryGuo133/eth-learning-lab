const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage 合约测试", function () {
  let simpleStorage;
  let owner;
  let addr1;
  let addr2;

  // 在每个测试前部署新的合约实例
  beforeEach(async function () {
    // 获取测试账户
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // 部署合约
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy(42); // 初始值 42
    await simpleStorage.deployed();
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

    it("应该正确记录多次设置的值", async function () {
      await simpleStorage.set(100);
      await simpleStorage.set(200);
      await simpleStorage.set(300);
      expect(await simpleStorage.get()).to.equal(300);
    });
  });

  describe("增加数据", function () {
    it("应该能够增加值", async function () {
      await simpleStorage.increment(10);
      expect(await simpleStorage.get()).to.equal(52); // 42 + 10
    });

    it("增加值应该触发事件", async function () {
      await expect(simpleStorage.increment(10))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(42, 52, owner.address);
    });

    it("应该能够多次增加值", async function () {
      await simpleStorage.increment(10);
      await simpleStorage.increment(20);
      await simpleStorage.increment(30);
      expect(await simpleStorage.get()).to.equal(102); // 42 + 10 + 20 + 30
    });

    it("增加0应该也能正常工作", async function () {
      await simpleStorage.increment(0);
      expect(await simpleStorage.get()).to.equal(42);
    });
  });

  describe("事件测试", function () {
    it("set 应该触发正确的事件参数", async function () {
      const tx = await simpleStorage.set(999);
      const receipt = await tx.wait();
      
      // 检查事件
      const event = receipt.logs.find(log => {
        try {
          return simpleStorage.interface.parseLog(log).name === "DataStored";
        } catch {
          return false;
        }
      });
      
      expect(event).to.not.be.undefined;
    });

    it("increment 应该触发正确的事件参数", async function () {
      const tx = await simpleStorage.increment(100);
      await expect(tx)
        .to.emit(simpleStorage, "DataStored")
        .withArgs(42, 142, owner.address);
    });
  });

  describe("权限测试", function () {
    it("owner 变量应该是公开可读的", async function () {
      const contractOwner = await simpleStorage.owner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("不同账户设置值应该在事件中正确显示", async function () {
      await expect(simpleStorage.connect(addr1).set(123))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(42, 123, addr1.address);
      
      await expect(simpleStorage.connect(addr2).set(456))
        .to.emit(simpleStorage, "DataStored")
        .withArgs(123, 456, addr2.address);
    });
  });

  describe("边界测试", function () {
    it("应该能够设置为0", async function () {
      await simpleStorage.set(0);
      expect(await simpleStorage.get()).to.equal(0);
    });

    it("应该能够设置大数值", async function () {
      const bigNumber = ethers.utils.parseUnits("1000000", 18);
      await simpleStorage.set(bigNumber);
      expect(await simpleStorage.get()).to.equal(bigNumber);
    });

    it("从0开始增加应该正常工作", async function () {
      await simpleStorage.set(0);
      await simpleStorage.increment(1);
      expect(await simpleStorage.get()).to.equal(1);
    });
  });
});
