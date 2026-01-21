/**
 * 以太坊基础操作示例
 * 演示如何使用 ethers.js 进行各种区块链操作
 */

const { ethers } = require('ethers');

// 连接到本地节点
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

async function main() {
  console.log('🔗 以太坊基础操作示例\n');
  console.log('='.repeat(80));
  
  // 1. 获取网络信息
  console.log('\n📡 网络信息:');
  const network = await provider.getNetwork();
  console.log('  Chain ID:', network.chainId);
  console.log('  Network Name:', network.name);
  
  // 2. 获取区块信息
  console.log('\n📦 区块信息:');
  const blockNumber = await provider.getBlockNumber();
  console.log('  当前区块高度:', blockNumber);
  
  const block = await provider.getBlock(blockNumber);
  console.log('  区块哈希:', block.hash);
  console.log('  时间戳:', new Date(block.timestamp * 1000).toLocaleString());
  console.log('  交易数量:', block.transactions.length);
  
  // 3. 获取账户信息
  console.log('\n👤 账户操作:');
  const accounts = await provider.listAccounts();
  const account1 = accounts[0];
  const account2 = accounts[1];
  
  console.log('  账户 1:', account1);
  const balance1 = await provider.getBalance(account1);
  console.log('  余额 1:', ethers.utils.formatEther(balance1), 'ETH');
  
  console.log('  账户 2:', account2);
  const balance2 = await provider.getBalance(account2);
  console.log('  余额 2:', ethers.utils.formatEther(balance2), 'ETH');
  
  // 4. 发送 ETH
  console.log('\n💸 发送 ETH:');
  const signer = provider.getSigner(account1);
  const tx = await signer.sendTransaction({
    to: account2,
    value: ethers.utils.parseEther('1.5') // 发送 1.5 ETH
  });
  
  console.log('  交易哈希:', tx.hash);
  console.log('  发送方:', tx.from);
  console.log('  接收方:', tx.to);
  console.log('  金额:', ethers.utils.formatEther(tx.value), 'ETH');
  console.log('  等待确认...');
  
  const receipt = await tx.wait();
  console.log('  ✓ 交易已确认');
  console.log('  区块号:', receipt.blockNumber);
  console.log('  Gas 使用:', receipt.gasUsed.toString());
  
  // 5. 查看更新后的余额
  console.log('\n💰 更新后的余额:');
  const newBalance1 = await provider.getBalance(account1);
  const newBalance2 = await provider.getBalance(account2);
  console.log('  账户 1:', ethers.utils.formatEther(newBalance1), 'ETH');
  console.log('  账户 2:', ethers.utils.formatEther(newBalance2), 'ETH');
  
  // 6. 获取交易详情
  console.log('\n📋 交易详情:');
  const transaction = await provider.getTransaction(tx.hash);
  console.log('  Nonce:', transaction.nonce);
  console.log('  Gas Price:', ethers.utils.formatUnits(transaction.gasPrice, 'gwei'), 'Gwei');
  console.log('  Gas Limit:', transaction.gasLimit.toString());
  
  // 7. 获取交易收据
  console.log('\n📜 交易收据:');
  console.log('  状态:', receipt.status === 1 ? '成功' : '失败');
  console.log('  累计 Gas:', receipt.cumulativeGasUsed.toString());
  console.log('  日志数量:', receipt.logs.length);
  
  // 8. 估算 Gas
  console.log('\n⛽ Gas 估算:');
  const gasEstimate = await provider.estimateGas({
    to: account2,
    value: ethers.utils.parseEther('1.0')
  });
  console.log('  发送 1 ETH 需要的 Gas:', gasEstimate.toString());
  
  // 9. 获取 Gas 价格
  const gasPrice = await provider.getGasPrice();
  console.log('  当前 Gas 价格:', ethers.utils.formatUnits(gasPrice, 'gwei'), 'Gwei');
  
  // 10. 计算交易成本
  const txCost = gasEstimate.mul(gasPrice);
  console.log('  预计交易成本:', ethers.utils.formatEther(txCost), 'ETH');
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ 所有操作完成！\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  });

