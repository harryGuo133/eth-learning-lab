/**
 * 智能合约事件监听示例
 * 演示如何监听和处理智能合约事件
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('📡 智能合约事件监听示例\n');
  console.log('='.repeat(80));
  
  // 连接到本地节点
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  // 检查部署信息
  const deploymentPath = path.join(__dirname, '../deployment.json');
  if (!fs.existsSync(deploymentPath)) {
    console.error('❌ 未找到 deployment.json');
    console.error('请先运行: make deploy');
    process.exit(1);
  }
  
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const artifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../artifacts/SimpleStorage.json'), 'utf8')
  );
  
  const signer = provider.getSigner();
  const contract = new ethers.Contract(deployment.contractAddress, artifact.abi, signer);
  
  console.log('合约地址:', deployment.contractAddress);
  console.log('');
  
  // 1. 查询历史事件
  console.log('📜 查询历史事件:');
  const filter = contract.filters.DataStored();
  const events = await contract.queryFilter(filter);
  
  console.log('找到', events.length, '个历史事件\n');
  events.forEach((event, index) => {
    console.log('事件', index + 1 + ':');
    console.log('  旧值:', event.args.oldValue.toString());
    console.log('  新值:', event.args.newValue.toString());
    console.log('  设置者:', event.args.setter);
    console.log('  区块号:', event.blockNumber);
    console.log('');
  });
  
  // 2. 监听新事件
  console.log('👂 开始监听新事件...');
  console.log('（将执行一些操作来触发事件）\n');
  
  // 设置事件监听器
  contract.on('DataStored', (oldValue, newValue, setter, event) => {
    console.log('🔔 收到新事件:');
    console.log('  旧值:', oldValue.toString());
    console.log('  新值:', newValue.toString());
    console.log('  设置者:', setter);
    console.log('  区块号:', event.blockNumber);
    console.log('  交易哈希:', event.transactionHash);
    console.log('');
  });
  
  // 等待一下确保监听器已设置
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. 触发一些事件
  console.log('✏️  执行操作 1: 设置值为 999');
  const tx1 = await contract.set(999);
  await tx1.wait();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('✏️  执行操作 2: 增加 111');
  const tx2 = await contract.increment(111);
  await tx2.wait();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('✏️  执行操作 3: 设置值为 2026');
  const tx3 = await contract.set(2026);
  await tx3.wait();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 4. 使用过滤器查询特定事件
  console.log('\n🔍 查询特定条件的事件:');
  
  // 查询最近 10 个区块的事件
  const currentBlock = await provider.getBlockNumber();
  const recentEvents = await contract.queryFilter(
    filter,
    currentBlock - 10,
    currentBlock
  );
  
  console.log('最近 10 个区块中有', recentEvents.length, '个事件');
  
  // 5. 移除监听器
  contract.removeAllListeners('DataStored');
  console.log('\n✓ 已停止监听事件');
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ 示例完成！\n');
  
  process.exit(0);
}

main().catch((error) => {
  console.error('\n❌ 错误:', error.message);
  process.exit(1);
});

