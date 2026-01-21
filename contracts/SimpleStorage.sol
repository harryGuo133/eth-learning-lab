// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleStorage
 * @dev 一个简单的存储合约，用于学习和测试
 */
contract SimpleStorage {
    // 状态变量
    uint256 private storedData;
    address public owner;
    
    // 事件
    event DataStored(uint256 indexed oldValue, uint256 indexed newValue, address indexed setter);
    
    // 构造函数
    constructor(uint256 initialValue) {
        storedData = initialValue;
        owner = msg.sender;
    }
    
    /**
     * @dev 设置存储的数据
     * @param x 要存储的值
     */
    function set(uint256 x) public {
        uint256 oldValue = storedData;
        storedData = x;
        emit DataStored(oldValue, x, msg.sender);
    }
    
    /**
     * @dev 获取存储的数据
     * @return 当前存储的值
     */
    function get() public view returns (uint256) {
        return storedData;
    }
    
    /**
     * @dev 增加存储的数据
     * @param x 要增加的值
     */
    function increment(uint256 x) public {
        uint256 oldValue = storedData;
        storedData += x;
        emit DataStored(oldValue, storedData, msg.sender);
    }
}

