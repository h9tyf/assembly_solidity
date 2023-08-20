// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Storage {

    uint256 public number;

    address public poolAddr;
    address public fromToken;
    address public toToken;
    uint256 public amountIn;

    constructor(uint256 num) {
        number = num;
    }

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }

    function retrieve_pool() public view returns (address){
        return poolAddr;
    }

    function retrieve_from() public view returns (address){
        return fromToken;
    }

    function retrieve_to() public view returns (address){
        return toToken;
    }

    function retrieve_amount() public view returns (uint256){
        return amountIn;
    }

    function store_solidity(address pool, address from, address to, uint256 amount, bytes calldata) external {
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount;
    }

    function store_assembly(bytes calldata) external {

    }
}