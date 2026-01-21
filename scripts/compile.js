const fs = require('fs');
const path = require('path');
const solc = require('solc');

console.log('🔨 编译智能合约...\n');

// 读取合约源代码
const contractPath = path.join(__dirname, '../contracts/SimpleStorage.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// 准备编译输入
const input = {
  language: 'Solidity',
  sources: {
    'SimpleStorage.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    },
    optimizer: {
      enabled: true,
      runs: 200
    },
    evmVersion: 'istanbul' // 使用 istanbul EVM 版本以兼容 Ganache
  }
};

// 编译合约
console.log('正在编译 SimpleStorage.sol...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// 检查编译错误
if (output.errors) {
  const errors = output.errors.filter(e => e.severity === 'error');
  if (errors.length > 0) {
    console.error('❌ 编译失败:');
    errors.forEach(err => console.error(err.formattedMessage));
    process.exit(1);
  }
  
  const warnings = output.errors.filter(e => e.severity === 'warning');
  if (warnings.length > 0) {
    console.warn('⚠️  警告:');
    warnings.forEach(warn => console.warn(warn.formattedMessage));
  }
}

// 创建 artifacts 目录
const artifactsDir = path.join(__dirname, '../artifacts');
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

// 保存编译结果
const contract = output.contracts['SimpleStorage.sol']['SimpleStorage'];
const artifact = {
  contractName: 'SimpleStorage',
  abi: contract.abi,
  bytecode: contract.evm.bytecode.object
};

const artifactPath = path.join(artifactsDir, 'SimpleStorage.json');
fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));

console.log('✅ 编译成功!');
console.log('合约 ABI 和字节码已保存到:', artifactPath);
console.log('\n合约信息:');
console.log('  - 函数数量:', contract.abi.filter(item => item.type === 'function').length);
console.log('  - 事件数量:', contract.abi.filter(item => item.type === 'event').length);
console.log('  - 字节码大小:', contract.evm.bytecode.object.length / 2, 'bytes');
