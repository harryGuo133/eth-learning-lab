const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚢 开始部署 SimpleStorage 合约...\n");
  
  // 获取部署账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("部署账户:", deployer.address);
  
  // 获取账户余额
  const balance = await deployer.getBalance();
  console.log("账户余额:", hre.ethers.utils.formatEther(balance), "ETH\n");
  
  // 部署合约
  const initialValue = 42;
  console.log("正在部署合约，初始值:", initialValue);
  
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy(initialValue);
  await simpleStorage.deployed();
  
  console.log("\n✅ SimpleStorage 合约已部署!");
  console.log("合约地址:", simpleStorage.address);
  console.log("部署交易:", simpleStorage.deployTransaction.hash);
  
  // 验证部署
  const storedValue = await simpleStorage.get();
  console.log("\n验证存储的值:", storedValue.toString());
  
  // 保存部署信息
  const network = await hre.ethers.provider.getNetwork();
  const deploymentInfo = {
    contractAddress: simpleStorage.address,
    deployer: deployer.address,
    transactionHash: simpleStorage.deployTransaction.hash,
    network: hre.network.name,
    chainId: network.chainId,
    timestamp: new Date().toISOString(),
    initialValue: initialValue
  };
  
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n部署信息已保存到 deployment.json");
  
  // 显示 Gas 使用
  const deployTx = await hre.ethers.provider.getTransactionReceipt(
    simpleStorage.deployTransaction.hash
  );
  console.log("\nGas 使用信息:");
  console.log("  Gas Used:", deployTx.gasUsed.toString());
  console.log("  Gas Price:", hre.ethers.utils.formatUnits(deployTx.effectiveGasPrice, "gwei"), "Gwei");
  const totalCost = deployTx.gasUsed.mul(deployTx.effectiveGasPrice);
  console.log("  Total Cost:", hre.ethers.utils.formatEther(totalCost), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ 部署失败:", error);
    process.exit(1);
  });
