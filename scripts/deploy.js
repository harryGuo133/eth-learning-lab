const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚢 开始部署 SimpleStorage 合约...\n');
  
  // 连接到本地节点
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  try {
    // 检查节点连接
    const network = await provider.getNetwork();
    console.log('✓ 已连接到网络:', network.chainId);
  } catch (error) {
    console.error('❌ 无法连接到本地节点');
    console.error('请确保已运行: make node');
    process.exit(1);
  }
  
  // 获取部署账户（使用第一个账户）
  const accounts = await provider.listAccounts();
  const deployer = provider.getSigner(accounts[0]);
  const deployerAddress = await deployer.getAddress();
  
  console.log('部署账户:', deployerAddress);
  
  // 获取账户余额
  const balance = await provider.getBalance(deployerAddress);
  console.log('账户余额:', ethers.utils.formatEther(balance), 'ETH\n');
  
  // 读取编译后的合约
  const artifactPath = path.join(__dirname, '../artifacts/SimpleStorage.json');
  if (!fs.existsSync(artifactPath)) {
    console.error('❌ 未找到编译后的合约');
    console.error('请先运行: make compile');
    process.exit(1);
  }
  
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // 创建合约工厂
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    deployer
  );
  
  // 部署合约
  const initialValue = 42;
  console.log('正在部署合约，初始值:', initialValue);
  
  const contract = await factory.deploy(initialValue);
  console.log('等待交易确认...');
  
  await contract.deployed();
  
  console.log('\n✅ SimpleStorage 合约已部署!');
  console.log('合约地址:', contract.address);
  console.log('交易哈希:', contract.deployTransaction.hash);
  
  // 验证部署
  const storedValue = await contract.get();
  console.log('\n验证存储的值:', storedValue.toString());
  
  // 保存部署信息
  const network = await provider.getNetwork();
  const deploymentInfo = {
    contractAddress: contract.address,
    deployer: deployerAddress,
    transactionHash: contract.deployTransaction.hash,
    network: 'localhost',
    chainId: network.chainId,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log('\n部署信息已保存到 deployment.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ 部署失败:', error.message);
    process.exit(1);
  });
