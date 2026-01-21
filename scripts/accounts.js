const { ethers } = require('ethers');

async function main() {
  console.log('🔑 本地节点账户信息\n');
  console.log('='.repeat(80));
  
  // 连接到本地节点
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  try {
    const network = await provider.getNetwork();
    console.log('\n网络信息:');
    console.log('  Chain ID:', network.chainId);
    console.log('  Network Name:', network.name);
  } catch (error) {
    console.error('\n❌ 无法连接到本地节点');
    console.error('请确保已运行: make node');
    process.exit(1);
  }
  
  // 获取所有账户
  const accounts = await provider.listAccounts();
  
  console.log('\n账户列表:');
  console.log('='.repeat(80));
  
  for (let i = 0; i < accounts.length; i++) {
    const address = accounts[i];
    const balance = await provider.getBalance(address);
    
    console.log('\n账户 #' + i);
    console.log('  地址:', address);
    console.log('  余额:', ethers.utils.formatEther(balance), 'ETH');
  }
  
  // 获取最新区块信息
  const blockNumber = await provider.getBlockNumber();
  console.log('\n' + '='.repeat(80));
  console.log('\n区块链信息:');
  console.log('  当前区块高度:', blockNumber);
  
  console.log('\n💡 提示: 每个账户初始都有 10000 ETH 可用于开发测试');
  console.log('💡 提示: 使用助记词: "test test test test test test test test test test test junk"');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  });
