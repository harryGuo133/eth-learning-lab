.PHONY: install node node-local stop compile deploy interact accounts test test-coverage test-gas clean help

help: ## 显示帮助信息
	@echo "=========================================="
	@echo "以太坊开发环境 - Hardhat + Ganache v7"
	@echo "=========================================="
	@echo ""
	@echo "节点管理:"
	@echo "  make install    - 安装依赖"
	@echo "  make node       - 启动节点 (允许远程访问)"
	@echo "  make node-local - 启动节点 (仅本机访问)"
	@echo "  make stop       - 停止节点"
	@echo ""
	@echo "开发命令:"
	@echo "  make compile    - 编译智能合约 (Hardhat)"
	@echo "  make deploy     - 部署合约到本地节点"
	@echo "  make interact   - 与已部署的合约交互"
	@echo "  make accounts   - 查看账户信息"
	@echo ""
	@echo "测试命令:"
	@echo "  make test       - 运行所有测试"
	@echo "  make test-coverage - 生成测试覆盖率报告"
	@echo "  make test-gas   - 运行测试并显示 Gas 报告"
	@echo ""
	@echo "其他:"
	@echo "  make clean      - 清理编译文件"
	@echo "  make help       - 显示此帮助"
	@echo ""

install: ## 安装项目依赖
	@echo "📦 安装依赖..."
	npm install

node: ## 启动节点 (允许远程访问)
	@echo "🚀 启动以太坊节点 Ganache v7 (允许远程访问)..."
	@echo "🌐 监听地址: 0.0.0.0:8545"
	@echo "📡 本机访问: http://127.0.0.1:8545"
	@echo "📡 局域网访问: http://$(shell hostname -I | awk '{print $$1}'):8545"
	@echo "🔗 Chain ID: 1337"
	@echo "💰 每个账户初始余额: 10000 ETH"
	@echo ""
	@echo "⚠️  安全警告: 节点允许远程访问，仅用于开发环境！"
	@echo ""
	./start-node.sh

node-local: ## 启动节点 (仅本机访问)
	@echo "🚀 启动以太坊节点 (仅本机访问)..."
	@echo "📡 RPC URL: http://127.0.0.1:8545"
	@echo "🔗 Chain ID: 1337"
	@echo "💰 每个账户初始余额: 10000 ETH"
	@echo ""
	npm run node-local

stop: ## 停止节点
	@echo "🛑 停止本地以太坊节点..."
	@pkill -f "ganache" && echo "✅ 节点已停止" || echo "⚠️  没有运行中的节点"

compile: ## 编译智能合约
	@echo "🔨 编译合约 (Hardhat)..."
	npm run compile

deploy: ## 部署合约到本地节点
	@echo "🚢 部署合约..."
	@echo "⚠️  请确保节点正在运行 (make node)"
	npm run deploy

interact: ## 与合约交互
	@echo "💬 与合约交互..."
	npm run interact

accounts: ## 显示账户信息
	@echo "👥 查询账户信息..."
	npm run accounts

test: ## 运行测试
	@echo "🧪 运行测试套件..."
	npm run test

test-coverage: ## 生成测试覆盖率
	@echo "📊 生成测试覆盖率报告..."
	npm run test:coverage

test-gas: ## 运行测试并显示 Gas 报告
	@echo "⛽ 运行测试并显示 Gas 报告..."
	npm run test:gas

clean: ## 清理编译文件
	@echo "🧹 清理文件..."
	rm -rf artifacts cache coverage coverage.json deployment.json gas-report.txt
