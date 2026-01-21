#!/bin/bash
# 自动加载 nvm 并启动节点

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 20 > /dev/null 2>&1

cd "$(dirname "$0")"
exec npm run node
