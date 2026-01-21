const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('💬 开始与智能合约交互...\n');
  
  // 连接到本地节点
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  try {
    await provider.getNetwork();
  } catch (error) {
    console.error('❌ 无法连接到本地节点');
    console.error('请确保已运行: make node');
    process.exit(1);
  }
  
  // 读取部署信息
  const deploymentPath = path.join(__dirname, '../deployment.json');
  if (!fs.existsSync(deploymentPath)) {
    console.error('❌ 未找到 deployment.json 文件');
    console.error('请先运行: make deploy');
    process.exit(1);
  }
  
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deploymentInfo.contractAddress;
  
  console.log('合约地址:', contractAddress);
  
  // 读取合约 ABI
  const artifactPath = path.join(__dirname, '../artifacts/SimpleStorage.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  // 获取签名者（使用第一个账户）
  const accounts = await provider.listAccounts();
  const signer = provider.getSigner(accounts[0]);
  
  // 连接到合约
  const contract = new ethers.Contract(contractAddress, artifact.abi, signer);
  
  // 获取当前值
  console.log('\n📖 读取当前存储的值...');
  let currentValue = await contract.get();
  console.log('当前值:', currentValue.toString());
  
  // 设置新值
  console.log('\n✏️  设置新值为 100...');
  const tx1 = await contract.set(100);
  console.log('交易已发送:', tx1.hash);
  console.log('等待确认...');
  await tx1.wait();
  console.log('✓ 交易已确认');
  
  currentValue = await contract.get();
  console.log('新值:', currentValue.toString());
  
  // 增加值
  console.log('\n➕ 增加 50...');
  const tx2 = await contract.increment(50);
  console.log('交易已发送:', tx2.hash);
  console.log('等待确认...');
  await tx2.wait();
  console.log('✓ 交易已确认');
  
  currentValue = await contract.get();
  console.log('最终值:', currentValue.toString());
  
  // 查询事件
  console.log('\n📋 查询 DataStored 事件...');
  const filter = contract.filters.DataStored();
  const events = await contract.queryFilter(filter);
  
  console.log('找到', events.length, '个事件:\n');
  events.forEach((event, index) => {
    console.log('事件', index + 1 + ':');
    console.log('  旧值:', event.args.oldValue.toString());
    console.log('  新值:', event.args.newValue.toString());
    console.log('  设置者:', event.args.setter);
    console.log('  区块号:', event.blockNumber);
    console.log('  交易哈希:', event.transactionHash);
    console.log('');
  });
  
  // 获取合约所有者
  const owner = await contract.owner();
  console.log('👤 合约所有者:', owner);
  
  console.log('\n✅ 交互完成!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ 交互失败:', error.message);
    process.exit(1);
  });
