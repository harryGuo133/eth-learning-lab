# 以太坊本地开发节点

[English](./README.en.md) | 简体中文

这是一个用于学习和开发的本地以太坊区块链节点环境，使用 Ganache CLI 和 ethers.js。

## 📋 前置要求

- Node.js (v12 或更高版本)
- npm

## 快速开始

### 1. 安装依赖

```bash
make install
# 或
npm install
```

### 2. 启动本地以太坊节点

在一个终端窗口中运行：

```bash
make node
```

这将启动一个本地以太坊节点（Ganache）：
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `1337`
- 自动生成 10 个测试账户，每个账户有 10000 ETH
- 支持自动挖矿
- 使用固定助记词（便于开发）

节点启动后会显示所有可用账户及其私钥。

### 3. 查看账户信息

在另一个终端窗口中运行：

```bash
make accounts
```

### 4. 编译合约

```bash
make compile
```

编译合约会生成 ABI 和字节码，保存在 `artifacts/` 目录。

### 5. 部署合约

确保节点正在运行，然后：

```bash
make deploy
```

这将：
- 部署 `SimpleStorage` 合约
- 设置初始值为 42
- 保存合约地址到 `deployment.json`

### 6. 与合约交互

```bash
make interact
```

这将执行以下操作：
- 读取合约当前存储的值
- 设置新值为 100
- 增加 50（最终值 150）
- 查询所有事件日志

## 📁 项目结构

```
eth/
├── contracts/           # 智能合约
│   └── SimpleStorage.sol
├── scripts/            # 脚本
│   ├── compile.js      # 编译脚本
│   ├── deploy.js       # 部署脚本
│   ├── interact.js     # 交互脚本
│   └── accounts.js     # 账户查询脚本
├── artifacts/          # 编译输出（ABI 和字节码）
│   └── SimpleStorage.json
├── deployment.json     # 部署信息
├── package.json        # 项目依赖
├── makefile           # 快捷命令
└── README.md          # 说明文档
```

## 🔧 可用命令

| 命令 | 说明 |
|------|------|
| `make help` | 显示所有可用命令 |
| `make install` | 安装依赖 |
| `make node` | 启动本地 Ganache 节点 |
| `make compile` | 编译智能合约 |
| `make deploy` | 部署合约到本地节点 |
| `make interact` | 与合约交互（读写数据、查询事件） |
| `make accounts` | 查看所有账户及余额 |
| `make clean` | 清理编译文件 |

## 📝 代码示例

### 基础连接

创建一个新的 JavaScript 文件来与本地节点交互：

```javascript
const { ethers } = require('ethers');

// 连接到本地节点
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

async function main() {
  // 获取区块号
  const blockNumber = await provider.getBlockNumber();
  console.log('当前区块高度:', blockNumber);
  
  // 获取账户
  const accounts = await provider.listAccounts();
  console.log('第一个账户:', accounts[0]);
  
  // 获取余额
  const balance = await provider.getBalance(accounts[0]);
  console.log('余额:', ethers.utils.formatEther(balance), 'ETH');
}

main();
```

### 与合约交互

```javascript
const { ethers } = require('ethers');
const fs = require('fs');

async function interactWithContract() {
  // 连接到本地节点
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  // 获取签名者
  const signer = provider.getSigner();
  
  // 读取合约信息
  const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
  const artifact = JSON.parse(fs.readFileSync('artifacts/SimpleStorage.json', 'utf8'));
  
  // 连接到合约
  const contract = new ethers.Contract(
    deployment.contractAddress,
    artifact.abi,
    signer
  );
  
  // 读取数据（不消耗 gas）
  const value = await contract.get();
  console.log('存储的值:', value.toString());
  
  // 写入数据（需要 gas）
  const tx = await contract.set(200);
  await tx.wait(); // 等待交易确认
  console.log('新值已设置');
  
  // 监听事件
  contract.on('DataStored', (oldValue, newValue, setter) => {
    console.log('值变化:', oldValue.toString(), '->', newValue.toString());
  });
}

interactWithContract();
```

### 发送 ETH

```javascript
const { ethers } = require('ethers');

async function sendETH() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = provider.getSigner();
  
  // 发送 1 ETH
  const tx = await signer.sendTransaction({
    to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    value: ethers.utils.parseEther('1.0')
  });
  
  console.log('交易哈希:', tx.hash);
  await tx.wait();
  console.log('交易已确认');
}

sendETH();
```

## 🔐 测试账户信息

默认助记词：
```
test test test test test test test test test test test junk
```

默认账户（前 3 个）：
```
账户 #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
私钥: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

账户 #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
私钥: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

账户 #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
私钥: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

⚠️ **这些账户仅用于本地开发，切勿在生产环境使用！**

## 📚 SimpleStorage 合约说明

这是一个简单的存储合约，包含以下功能：

### 函数

- `get()` - 获取存储的值（只读）
- `set(uint256 x)` - 设置新值
- `increment(uint256 x)` - 增加值
- `owner()` - 获取合约所有者地址

### 事件

- `DataStored(uint256 oldValue, uint256 newValue, address setter)` - 当值改变时触发

## 🧪 添加自己的合约

1. 在 `contracts/` 目录创建新的 `.sol` 文件
2. 修改 `scripts/compile.js` 添加新合约的编译
3. 创建对应的部署脚本
4. 编译并部署

## 💡 学习资源

- [Ethers.js 文档](https://docs.ethers.org/v5/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [以太坊开发文档](https://ethereum.org/developers)
- [Ganache 文档](https://github.com/trufflesuite/ganache)

## 📌 注意事项

1. **数据不持久化**: 每次重启节点，所有数据都会重置
2. **仅用于开发**: 这是本地测试网络，不要用真实私钥
3. **Gas 费用低**: 本地节点的 Gas 价格与主网不同
4. **自动挖矿**: 交易立即被打包确认
5. **固定助记词**: 便于开发，但不要在生产中使用

## 🔧 故障排查

### 无法连接到节点

确保节点正在运行：
```bash
make node
```

### 编译失败

检查 Solidity 语法，确保使用 ^0.8.0 版本

### 部署失败

1. 检查节点是否运行
2. 确保账户有足够的 ETH
3. 查看错误信息

## 下一步

现在你已经有了一个完整的本地以太坊开发环境！你可以：

1. 修改 SimpleStorage 合约，添加新功能
2. 创建自己的智能合约
3. 学习 Solidity 语言
4. 尝试更复杂的合约交互
5. 构建 DApp 前端

Happy Coding! 🎉
