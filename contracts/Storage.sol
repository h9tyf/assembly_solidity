// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Storage {

    uint256 public number;

    address public poolAddr;
    address public fromToken;
    address public toToken;
    uint24 public amountIn;

    uint256 constant ADDRESS_LENGTH = 0x14;
    uint256 constant UINT24_LENGTH = 0x03;

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

    function retrieve_amount() public view returns (uint24){
        return amountIn;
    }

    function store_solidity(address pool, address from, address to, uint24 amount) external {
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount;
    }

    function store_bytes(bytes calldata data) external {
        console.logBytes(data);
        (address pool, address from, address to, uint24 amount) 
            = abi.decode(data, (address, address, address, uint24));
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount;
    }

    function store_bytes_zip(bytes calldata data) external {
        console.logBytes(data);
        bytes memory packed = data;
        address pool;
        address from;
        address to;
        uint24 amount;
        assembly {
            pool := mload(add(packed, ADDRESS_LENGTH))
            from := mload(add(packed, mul(ADDRESS_LENGTH, 2)))
            to := mload(add(packed, mul(ADDRESS_LENGTH, 3)))
            amount := mload(add(packed, add(mul(ADDRESS_LENGTH, 3), UINT24_LENGTH)))
        }
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount;
    }
}