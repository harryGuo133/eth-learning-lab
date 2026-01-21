const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("💬 开始与智能合约交互...\n");
  
  // 读取部署信息
  if (!fs.existsSync("deployment.json")) {
    console.error("❌ 未找到 deployment.json 文件");
    console.error("请先运行: npx hardhat run scripts/deploy-hardhat.js --network localhost");
    process.exit(1);
  }
  
  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contractAddress = deploymentInfo.contractAddress;
  
  console.log("合约地址:", contractAddress);
  console.log("网络:", hre.network.name, "\n");
  
  // 获取合约实例
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = SimpleStorage.attach(contractAddress);
  
  // 获取账户
  const [signer] = await hre.ethers.getSigners();
  console.log("使用账户:", signer.address);
  
  // 1. 读取当前值
  console.log("\n📖 读取当前存储的值...");
  let currentValue = await simpleStorage.get();
  console.log("当前值:", currentValue.toString());
  
  // 2. 设置新值
  console.log("\n✏️  设置新值为 100...");
  const tx1 = await simpleStorage.set(100);
  console.log("交易哈希:", tx1.hash);
  const receipt1 = await tx1.wait();
  console.log("✓ 交易已确认，Gas 使用:", receipt1.gasUsed.toString());
  
  currentValue = await simpleStorage.get();
  console.log("新值:", currentValue.toString());
  
  // 3. 增加值
  console.log("\n➕ 增加 50...");
  const tx2 = await simpleStorage.increment(50);
  console.log("交易哈希:", tx2.hash);
  const receipt2 = await tx2.wait();
  console.log("✓ 交易已确认，Gas 使用:", receipt2.gasUsed.toString());
  
  currentValue = await simpleStorage.get();
  console.log("最终值:", currentValue.toString());
  
  // 4. 查询事件
  console.log("\n📋 查询 DataStored 事件...");
  const filter = simpleStorage.filters.DataStored();
  const events = await simpleStorage.queryFilter(filter);
  
  console.log(`找到 ${events.length} 个事件:\n`);
  events.forEach((event, index) => {
    console.log(`事件 ${index + 1}:`);
    console.log("  旧值:", event.args.oldValue.toString());
    console.log("  新值:", event.args.newValue.toString());
    console.log("  设置者:", event.args.setter);
    console.log("  区块号:", event.blockNumber);
    console.log("  交易哈希:", event.transactionHash);
    console.log("");
  });
  
  // 5. 获取合约所有者
  const owner = await simpleStorage.owner();
  console.log("👤 合约所有者:", owner);
  
  // 6. 统计信息
  console.log("\n📊 统计信息:");
  const totalGasUsed = receipt1.gasUsed.add(receipt2.gasUsed);
  console.log("  总 Gas 使用:", totalGasUsed.toString());
  console.log("  事件数量:", events.length);
  console.log("  当前值:", currentValue.toString());
  
  console.log("\n✅ 交互完成!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 交互失败:", error);
    process.exit(1);
  });
