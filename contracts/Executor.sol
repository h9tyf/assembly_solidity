// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Executor {
    struct Exchange {
        uint8 platform;
        address pool;
        uint256 len;
        bytes data;
    }
    uint number;

    function execute_init(uint inAmount, address recipient, uint256 len, Exchange[] calldata exchanges, address[] calldata tokens) external {
        bytes memory params = abi.encode(recipient, exchanges, tokens);
        number = inAmount;
        console.log(len);
        console.logBytes(params);
    }

    function execute_assembly() external {
        /* uint inAmount
        address payable_recipient
        uint len
        address[] token (size = length+1)
        Exchange[] exchanges (size = length)
        */
    }
}
