# 以太坊本地节点使用指南

## 🎯 快速开始

### 1. 启动节点（终端 1）

```bash
cd /home/parallels/workspace/codespace/crypto/eth
make node
```

节点启动后会显示：
- 10 个测试账户地址和私钥
- RPC 端点：http://127.0.0.1:8545
- Chain ID: 1337

**保持这个终端运行！**

### 2. 在另一个终端执行操作（终端 2）

```bash
cd /home/parallels/workspace/codespace/crypto/eth

# 查看账户
make accounts

# 编译合约
make compile

# 部署合约
make deploy

# 与合约交互
make interact
```

## 📚 示例脚本

我为你准备了三个完整的示例脚本，展示了以太坊开发的各个方面：

### 1. 基础操作 (examples/basic-operations.js)

演示内容：
- 获取网络和区块信息
- 查询账户余额
- 发送 ETH
- 获取交易详情
- Gas 估算

运行：
```bash
node examples/basic-operations.js
```

### 2. 合约事件监听 (examples/contract-events.js)

演示内容：
- 查询历史事件
- 实时监听新事件
- 过滤特定事件
- 事件数据解析

运行：
```bash
node examples/contract-events.js
```

### 3. 钱包操作 (examples/wallet-operations.js)

演示内容：
- 从助记词创建钱包
- 从私钥创建钱包
- 消息签名和验证
- 交易签名
- 钱包加密和解密
- HD 钱包路径

运行：
```bash
node examples/wallet-operations.js
```

## 💻 代码模板

### 连接到本地节点

```javascript
const { ethers } = require('ethers');

// 连接到本地节点
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

async function main() {
  // 获取区块号
  const blockNumber = await provider.getBlockNumber();
  console.log('当前区块:', blockNumber);
  
  // 获取账户
  const accounts = await provider.listAccounts();
  console.log('第一个账户:', accounts[0]);
}

main();
```

### 与已部署的合约交互

```javascript
const { ethers } = require('ethers');
const fs = require('fs');

async function interactWithContract() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = provider.getSigner();
  
  // 读取部署信息
  const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
  const artifact = JSON.parse(fs.readFileSync('artifacts/SimpleStorage.json', 'utf8'));
  
  // 连接到合约
  const contract = new ethers.Contract(
    deployment.contractAddress,
    artifact.abi,
    signer
  );
  
  // 读取数据
  const value = await contract.get();
  console.log('当前值:', value.toString());
  
  // 写入数据
  const tx = await contract.set(123);
  await tx.wait();
  console.log('新值已设置');
}

interactWithContract();
```

### 部署新合约

```javascript
const { ethers } = require('ethers');

async function deployContract() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = provider.getSigner();
  
  // 合约 ABI 和字节码
  const abi = [...]; // 从编译输出获取
  const bytecode = '0x...'; // 从编译输出获取
  
  // 创建合约工厂
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  
  // 部署合约（传入构造函数参数）
  const contract = await factory.deploy(arg1, arg2);
  await contract.deployed();
  
  console.log('合约地址:', contract.address);
  return contract;
}

deployContract();
```

### 监听合约事件

```javascript
const { ethers } = require('ethers');

async function listenToEvents() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  // 假设你已经有了合约实例
  const contract = new ethers.Contract(address, abi, provider);
  
  // 监听事件
  contract.on('DataStored', (oldValue, newValue, setter) => {
    console.log('数据变化:');
    console.log('  旧值:', oldValue.toString());
    console.log('  新值:', newValue.toString());
    console.log('  设置者:', setter);
  });
  
  // 查询历史事件
  const filter = contract.filters.DataStored();
  const events = await contract.queryFilter(filter);
  console.log('历史事件数量:', events.length);
}

listenToEvents();
```

### 发送 ETH

```javascript
const { ethers } = require('ethers');

async function sendETH() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = provider.getSigner();
  
  const tx = await signer.sendTransaction({
    to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    value: ethers.utils.parseEther('1.0') // 发送 1 ETH
  });
  
  console.log('交易哈希:', tx.hash);
  await tx.wait();
  console.log('交易已确认');
}

sendETH();
```

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `make help` | 显示所有可用命令 |
| `make node` | 启动本地节点 |
| `make accounts` | 查看账户信息 |
| `make compile` | 编译合约 |
| `make deploy` | 部署合约 |
| `make interact` | 与合约交互 |
| `make clean` | 清理编译文件 |

## 📁 重要文件

- `deployment.json` - 保存已部署合约的地址和信息
- `artifacts/SimpleStorage.json` - 编译后的合约 ABI 和字节码
- `contracts/SimpleStorage.sol` - 智能合约源代码

## 🎓 学习路径

### 初学者

1. ✅ 运行 `make node` 启动节点
2. ✅ 运行 `make accounts` 查看账户
3. ✅ 运行 `make compile` 编译合约
4. ✅ 运行 `make deploy` 部署合约
5. ✅ 运行 `make interact` 与合约交互
6. ✅ 运行示例脚本了解更多功能

### 进阶

1. 修改 `SimpleStorage.sol` 添加新功能
2. 创建自己的智能合约
3. 编写自定义交互脚本
4. 学习事件监听和过滤
5. 实现多合约交互

### 高级

1. 构建 DApp 前端
2. 实现复杂的智能合约逻辑
3. 使用代理模式实现可升级合约
4. 集成 IPFS 存储
5. 实现 ERC-20/ERC-721 代币

## 💡 提示和技巧

### 1. 重置节点

如果需要重置区块链状态，只需重启节点：
```bash
# 在节点终端按 Ctrl+C 停止
# 然后重新运行
make node
```

### 2. 使用不同账户

```javascript
// 使用第二个账户
const signer = provider.getSigner(1);

// 或者使用特定地址
const signer = provider.getSigner('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
```

### 3. 调试交易

```javascript
try {
  const tx = await contract.someFunction();
  await tx.wait();
} catch (error) {
  console.error('交易失败:', error.message);
  // 查看详细错误
  if (error.error) {
    console.error('详细信息:', error.error);
  }
}
```

### 4. 估算 Gas

```javascript
// 在发送交易前估算 Gas
const gasEstimate = await contract.estimateGas.set(100);
console.log('需要的 Gas:', gasEstimate.toString());

// 设置 Gas 限制
const tx = await contract.set(100, {
  gasLimit: gasEstimate.mul(120).div(100) // 增加 20% 余量
});
```

### 5. 监控账户余额变化

```javascript
const address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

provider.on('block', async (blockNumber) => {
  const balance = await provider.getBalance(address);
  console.log(`区块 ${blockNumber}: 余额 ${ethers.utils.formatEther(balance)} ETH`);
});
```

## 🐛 常见问题

### 问题：无法连接到节点

**解决方案：**
- 确保节点正在运行（`make node`）
- 检查端口 8545 是否被占用
- 确认 RPC URL 是 `http://127.0.0.1:8545`

### 问题：部署失败

**解决方案：**
- 确保合约已编译（`make compile`）
- 检查账户是否有足够的 ETH
- 查看错误信息，可能是合约代码问题

### 问题：交易一直 pending

**解决方案：**
- 本地节点应该自动挖矿，交易会立即确认
- 如果卡住，尝试重启节点

### 问题：找不到 deployment.json

**解决方案：**
- 先运行 `make deploy` 部署合约
- 部署成功后会自动生成该文件

## 📖 参考资源

- [Ethers.js 文档](https://docs.ethers.org/v5/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [以太坊开发文档](https://ethereum.org/developers)
- [OpenZeppelin 合约库](https://docs.openzeppelin.com/contracts/)

## 🎉 下一步

现在你已经掌握了基础知识，可以：

1. 创建自己的智能合约
2. 构建 DApp 应用
3. 学习 DeFi 协议
4. 研究 NFT 开发
5. 探索 Layer 2 解决方案

祝你学习愉快！🚀

