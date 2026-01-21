# Ethereum Local Development Node

English | [简体中文](./README.md)

A complete local Ethereum blockchain environment for learning and development, powered by Ganache CLI and ethers.js.

## 📋 Prerequisites

- Node.js (v12 or higher)
- npm

## 🚀 Quick Start

### 1. Install Dependencies

```bash
make install
# or
npm install
```

### 2. Start Local Ethereum Node

Run in one terminal window:

```bash
make node
```

This will start a local Ethereum node (Ganache):
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `1337`
- Automatically generates 10 test accounts with 10,000 ETH each
- Supports automatic mining
- Uses a fixed mnemonic (convenient for development)

The node will display all available accounts and their private keys upon startup.

### 3. View Account Information

In another terminal window:

```bash
make accounts
```

### 4. Compile Contracts

```bash
make compile
```

This generates ABI and bytecode, saved in the `artifacts/` directory.

### 5. Deploy Contracts

Make sure the node is running, then:

```bash
make deploy
```

This will:
- Deploy the `SimpleStorage` contract
- Set initial value to 42
- Save contract address to `deployment.json`

### 6. Interact with Contract

```bash
make interact
```

This will:
- Read the current stored value
- Set a new value to 100
- Increment by 50 (final value: 150)
- Query all event logs

## 📁 Project Structure

```
eth/
├── contracts/           # Smart contracts
│   └── SimpleStorage.sol
├── scripts/            # Core scripts
│   ├── compile.js      # Compilation script
│   ├── deploy.js       # Deployment script
│   ├── interact.js     # Interaction script
│   └── accounts.js     # Account query script
├── examples/           # Learning examples
│   ├── basic-operations.js
│   ├── contract-events.js
│   └── wallet-operations.js
├── artifacts/          # Compiled output (ABI and bytecode)
│   └── SimpleStorage.json
├── deployment.json     # Deployment information
├── package.json        # Project dependencies
├── makefile           # Quick commands
└── README.md          # Documentation
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `make help` | Display all available commands |
| `make install` | Install dependencies |
| `make node` | Start local Ganache node |
| `make compile` | Compile smart contracts |
| `make deploy` | Deploy contracts to local node |
| `make interact` | Interact with contracts (read/write data, query events) |
| `make accounts` | View all accounts and balances |
| `make clean` | Clean compiled files |

## 📝 Code Examples

### Basic Connection

Create a new JavaScript file to interact with the local node:

```javascript
const { ethers } = require('ethers');

// Connect to local node
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

async function main() {
  // Get block number
  const blockNumber = await provider.getBlockNumber();
  console.log('Current block height:', blockNumber);
  
  // Get accounts
  const accounts = await provider.listAccounts();
  console.log('First account:', accounts[0]);
  
  // Get balance
  const balance = await provider.getBalance(accounts[0]);
  console.log('Balance:', ethers.utils.formatEther(balance), 'ETH');
}

main();
```

### Interact with Contract

```javascript
const { ethers } = require('ethers');
const fs = require('fs');

async function interactWithContract() {
  // Connect to local node
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  
  // Get signer
  const signer = provider.getSigner();
  
  // Read contract information
  const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
  const artifact = JSON.parse(fs.readFileSync('artifacts/SimpleStorage.json', 'utf8'));
  
  // Connect to contract
  const contract = new ethers.Contract(
    deployment.contractAddress,
    artifact.abi,
    signer
  );
  
  // Read data (no gas required)
  const value = await contract.get();
  console.log('Stored value:', value.toString());
  
  // Write data (gas required)
  const tx = await contract.set(200);
  await tx.wait(); // Wait for confirmation
  console.log('New value set');
  
  // Listen to events
  contract.on('DataStored', (oldValue, newValue, setter) => {
    console.log('Value changed:', oldValue.toString(), '->', newValue.toString());
  });
}

interactWithContract();
```

### Send ETH

```javascript
const { ethers } = require('ethers');

async function sendETH() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = provider.getSigner();
  
  // Send 1 ETH
  const tx = await signer.sendTransaction({
    to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    value: ethers.utils.parseEther('1.0')
  });
  
  console.log('Transaction hash:', tx.hash);
  await tx.wait();
  console.log('Transaction confirmed');
}

sendETH();
```

## 💻 Example Scripts

The project includes three comprehensive example scripts:

### 1. Basic Operations (`examples/basic-operations.js`)
- Network and block information
- Account balance queries
- Sending ETH
- Transaction details and receipts
- Gas estimation

```bash
node examples/basic-operations.js
```

### 2. Contract Events (`examples/contract-events.js`)
- Query historical events
- Listen to new events in real-time
- Filter specific events
- Parse event data

```bash
node examples/contract-events.js
```

### 3. Wallet Operations (`examples/wallet-operations.js`)
- Create wallet from mnemonic
- Create wallet from private key
- Message signing and verification
- Transaction signing
- Wallet encryption and decryption
- HD wallet paths

```bash
node examples/wallet-operations.js
```

## 🔐 Test Account Information

Default mnemonic:
```
test test test test test test test test test test test junk
```

Default accounts (first 3):
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

⚠️ **These accounts are for local development only. Never use in production!**

## 📚 SimpleStorage Contract

A simple storage contract with the following features:

### Functions

- `get()` - Get stored value (read-only)
- `set(uint256 x)` - Set new value
- `increment(uint256 x)` - Increment value
- `owner()` - Get contract owner address

### Events

- `DataStored(uint256 oldValue, uint256 newValue, address setter)` - Emitted when value changes

## 🧪 Adding Your Own Contracts

1. Create a new `.sol` file in the `contracts/` directory
2. Modify `scripts/compile.js` to add compilation for the new contract
3. Create a corresponding deployment script
4. Compile and deploy

## 💡 Learning Resources

- [Ethers.js Documentation](https://docs.ethers.org/v5/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethereum Development Docs](https://ethereum.org/developers)
- [Ganache Documentation](https://github.com/trufflesuite/ganache)

## 📌 Important Notes

1. **Data is not persistent**: All data is reset when the node restarts
2. **Development only**: This is a local test network, don't use real private keys
3. **Low gas fees**: Local node gas prices differ from mainnet
4. **Automatic mining**: Transactions are confirmed immediately
5. **Fixed mnemonic**: Convenient for development, but don't use in production

## 🔧 Troubleshooting

### Cannot Connect to Node

Make sure the node is running:
```bash
make node
```

### Compilation Fails

Check Solidity syntax and ensure you're using ^0.8.0 version

### Deployment Fails

1. Check if the node is running
2. Ensure accounts have enough ETH
3. Review error messages

## 🛑 Stopping the Node

### Method 1: Direct Stop (Recommended)
In the terminal running the node, press:
```bash
Ctrl + C
```

### Method 2: Kill Process
```bash
# Find the process
ps aux | grep ganache

# Stop the process
kill <process_id>

# Or force stop
pkill -f ganache-cli
```

## 🔄 Restarting the Node

To restart with a clean state:
```bash
pkill -f ganache-cli   # Stop
make clean             # Clean compiled files
make node              # Restart
```

After restarting, you'll need to redeploy contracts:
```bash
make compile
make deploy
```

## 🎯 Next Steps

Now you have a complete local Ethereum development environment! You can:

1. Modify the SimpleStorage contract and add new features
2. Create your own smart contracts
3. Learn Solidity language
4. Try more complex contract interactions
5. Build a DApp frontend

## 📖 Additional Documentation

- **Quick Reference**: See `QUICK_REFERENCE.md`
- **Detailed Guide**: See `USAGE_GUIDE.md`
- **Chinese README**: See `README.md`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT

---

Happy Coding! 🎉

**Built with ❤️ for Ethereum developers**

