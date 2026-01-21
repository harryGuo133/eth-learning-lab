# 快速参考卡片 🚀

## 启动流程（两个终端）

### 终端 1 - 启动节点
```bash
cd /home/parallels/workspace/codespace/crypto/eth
make node
```
**保持运行！** 节点地址：http://127.0.0.1:8545

### 终端 2 - 执行操作
```bash
cd /home/parallels/workspace/codespace/crypto/eth
make accounts    # 查看账户
make compile     # 编译合约
make deploy      # 部署合约
make interact    # 与合约交互
```

---

## 常用命令

| 命令 | 功能 |
|------|------|
| `make node` | 启动本地节点 |
| `make accounts` | 查看账户信息 |
| `make compile` | 编译智能合约 |
| `make deploy` | 部署合约 |
| `make interact` | 与合约交互 |
| `make clean` | 清理编译文件 |
| `make help` | 显示帮助 |

---

## 示例脚本

```bash
# 基础操作（发送 ETH、查询余额等）
node examples/basic-operations.js

# 合约事件监听
node examples/contract-events.js

# 钱包操作（签名、加密等）
node examples/wallet-operations.js
```

---

## 节点信息

- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 1337
- **账户数量**: 10 个
- **每个账户余额**: 10000 ETH
- **助记词**: `test test test test test test test test test test test junk`

---

## 默认账户

```
账户 #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

账户 #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
私钥: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

⚠️ **仅用于开发测试！**

---

## 代码模板

### 连接节点
```javascript
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
```

### 获取签名者
```javascript
const signer = provider.getSigner();
// 或使用特定账户
const signer = provider.getSigner(1); // 使用第二个账户
```

### 连接合约
```javascript
const fs = require('fs');
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
const artifact = JSON.parse(fs.readFileSync('artifacts/SimpleStorage.json', 'utf8'));

const contract = new ethers.Contract(
  deployment.contractAddress,
  artifact.abi,
  signer
);
```

### 读取合约数据
```javascript
const value = await contract.get();
console.log('值:', value.toString());
```

### 写入合约数据
```javascript
const tx = await contract.set(100);
await tx.wait(); // 等待确认
console.log('交易哈希:', tx.hash);
```

### 发送 ETH
```javascript
const tx = await signer.sendTransaction({
  to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  value: ethers.utils.parseEther('1.0')
});
await tx.wait();
```

### 监听事件
```javascript
contract.on('DataStored', (oldValue, newValue, setter) => {
  console.log('新值:', newValue.toString());
});
```

---

## 重要文件

| 文件 | 说明 |
|------|------|
| `deployment.json` | 已部署合约的地址 |
| `artifacts/SimpleStorage.json` | 合约 ABI 和字节码 |
| `contracts/SimpleStorage.sol` | 合约源代码 |

---

## 单位转换

```javascript
// ETH 转 Wei
ethers.utils.parseEther('1.0')        // 1 ETH = 1000000000000000000 Wei

// Wei 转 ETH
ethers.utils.formatEther(balance)     // Wei -> ETH 字符串

// Gwei 转换
ethers.utils.parseUnits('20', 'gwei') // 20 Gwei
ethers.utils.formatUnits(value, 'gwei') // -> Gwei 字符串
```

---

## 常见操作

### 查询余额
```javascript
const balance = await provider.getBalance(address);
console.log(ethers.utils.formatEther(balance), 'ETH');
```

### 获取区块号
```javascript
const blockNumber = await provider.getBlockNumber();
```

### 获取交易
```javascript
const tx = await provider.getTransaction(txHash);
const receipt = await provider.getTransactionReceipt(txHash);
```

### 估算 Gas
```javascript
const gasEstimate = await contract.estimateGas.set(100);
const gasPrice = await provider.getGasPrice();
```

---

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| 无法连接节点 | 确保 `make node` 正在运行 |
| 部署失败 | 先运行 `make compile` |
| 找不到合约 | 先运行 `make deploy` |
| 交易卡住 | 重启节点 |

---

## 学习资源

- 📖 [完整文档](./README.md)
- 📚 [使用指南](./USAGE_GUIDE.md)
- 💻 [示例代码](./examples/)
- 🌐 [Ethers.js 文档](https://docs.ethers.org/v5/)
- 📝 [Solidity 文档](https://docs.soliditylang.org/)

---

**提示**: 将此文件保存为书签，方便快速查阅！

