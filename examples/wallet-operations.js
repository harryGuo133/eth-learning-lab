/**
 * 钱包操作示例
 * 演示如何创建钱包、签名消息等
 */

const { ethers } = require('ethers');

async function main() {
  console.log('👛 钱包操作示例\n');
  console.log('='.repeat(80));
  
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  // 1. 从助记词创建钱包
  console.log('\n🔑 从助记词创建钱包:');
  const mnemonic = 'test test test test test test test test test test test junk';
  const wallet1 = ethers.Wallet.fromMnemonic(mnemonic);
  
  console.log('  助记词:', mnemonic);
  console.log('  地址:', wallet1.address);
  console.log('  私钥:', wallet1.privateKey);
  console.log('  公钥:', wallet1.publicKey);
  
  // 2. 从私钥创建钱包
  console.log('\n🔐 从私钥创建钱包:');
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const wallet2 = new ethers.Wallet(privateKey);
  
  console.log('  私钥:', wallet2.privateKey);
  console.log('  地址:', wallet2.address);
  
  // 3. 连接钱包到 provider
  console.log('\n🔗 连接钱包到节点:');
  const connectedWallet = wallet2.connect(provider);
  const balance = await connectedWallet.getBalance();
  console.log('  地址:', connectedWallet.address);
  console.log('  余额:', ethers.utils.formatEther(balance), 'ETH');
  
  // 4. 签名消息
  console.log('\n✍️  签名消息:');
  const message = '欢迎使用以太坊！';
  const signature = await connectedWallet.signMessage(message);
  
  console.log('  原始消息:', message);
  console.log('  签名:', signature);
  
  // 5. 验证签名
  console.log('\n✅ 验证签名:');
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);
  console.log('  恢复的地址:', recoveredAddress);
  console.log('  签名有效:', recoveredAddress === connectedWallet.address);
  
  // 6. 签名交易
  console.log('\n📝 签名交易:');
  const tx = {
    to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    value: ethers.utils.parseEther('0.1'),
    gasLimit: 21000,
    gasPrice: await provider.getGasPrice(),
    nonce: await provider.getTransactionCount(connectedWallet.address)
  };
  
  const signedTx = await connectedWallet.signTransaction(tx);
  console.log('  已签名的交易:', signedTx.substring(0, 66) + '...');
  
  // 7. 发送签名的交易
  console.log('\n📤 发送交易:');
  const txResponse = await connectedWallet.sendTransaction(tx);
  console.log('  交易哈希:', txResponse.hash);
  console.log('  等待确认...');
  
  const receipt = await txResponse.wait();
  console.log('  ✓ 交易已确认');
  console.log('  区块号:', receipt.blockNumber);
  
  // 8. 生成随机钱包
  console.log('\n🎲 生成随机钱包:');
  const randomWallet = ethers.Wallet.createRandom();
  console.log('  地址:', randomWallet.address);
  console.log('  私钥:', randomWallet.privateKey);
  console.log('  助记词:', randomWallet.mnemonic.phrase);
  
  // 9. 加密钱包
  console.log('\n🔒 加密钱包:');
  const password = 'my-secret-password';
  console.log('  正在加密（这可能需要几秒钟）...');
  
  const encryptedJson = await randomWallet.encrypt(password);
  console.log('  加密的 JSON 长度:', encryptedJson.length, '字符');
  console.log('  JSON 预览:', encryptedJson.substring(0, 100) + '...');
  
  // 10. 解密钱包
  console.log('\n🔓 解密钱包:');
  console.log('  正在解密...');
  const decryptedWallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  console.log('  ✓ 解密成功');
  console.log('  地址匹配:', decryptedWallet.address === randomWallet.address);
  
  // 11. HD 钱包路径
  console.log('\n🌳 HD 钱包路径:');
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
  
  for (let i = 0; i < 3; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    const derivedWallet = hdNode.derivePath(path);
    console.log(`  路径 ${path}:`);
    console.log('    地址:', derivedWallet.address);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ 所有钱包操作完成！\n');
  console.log('⚠️  提醒: 这些私钥和助记词仅用于开发测试！');
  console.log('⚠️  切勿在生产环境或主网使用这些密钥！\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  });

