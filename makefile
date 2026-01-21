.PHONY: install node compile deploy interact accounts clean help

help: ## 显示帮助信息
	@echo "以太坊本地开发节点 - 可用命令:"
	@echo ""
	@echo "  make install    - 安装依赖"
	@echo "  make node       - 启动本地以太坊节点 (Ganache)"
	@echo "  make compile    - 编译智能合约"
	@echo "  make deploy     - 部署合约到本地节点"
	@echo "  make interact   - 与已部署的合约交互"
	@echo "  make accounts   - 查看本地账户信息"
	@echo "  make clean      - 清理编译文件"
	@echo ""

install: ## 安装项目依赖
	@echo "📦 安装依赖..."
	npm install

node: ## 启动本地以太坊节点 (端口: 8545)
	@echo "🚀 启动本地以太坊节点 (Ganache)..."
	@echo "📡 RPC URL: http://127.0.0.1:8545"
	@echo "🔗 Chain ID: 1337"
	@echo "💰 每个账户初始余额: 10000 ETH"
	@echo ""
	npm run node

compile: ## 编译智能合约
	@echo "🔨 编译合约..."
	node scripts/compile.js

deploy: ## 部署合约到本地节点
	@echo "🚢 部署合约..."
	npm run deploy

interact: ## 与合约交互
	@echo "💬 与合约交互..."
	npm run interact

accounts: ## 显示账户信息
	@echo "👥 查询账户信息..."
	npm run accounts

clean: ## 清理编译文件
	@echo "🧹 清理文件..."
	rm -rf artifacts deployment.json
