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
    uint256 constant UINT256_LENGTH = 0x20;

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

    function store_solidity(address pool, address from, address to, uint24 amount) external {
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount;
    }

    function store_bytes(bytes calldata data) external {
        //console.logBytes(data);
        (address pool, address from, address to, uint24 amount) 
            = abi.decode(data, (address, address, address, uint24));
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount;
    }

    function store_bytes_zip(bytes calldata data) external {
        //console.logBytes(data);
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

    function store_bytes_zip_zip() external {
        uint input;
        address pool;
        address from;
        address to;
        uint24 amount;
        assembly {
            let calldata_len := calldatasize()
            let input_len := sub(calldata_len, 4)

            input := mload(0x40)
            calldatacopy(input, 4, input_len)
            let input_data := sub(input, 0x20)

            let free := add(input, input_len)
            let free_round := and(add(free, 31), not(31))
            mstore(0x40, free_round)

            pool := mload(add(input_data, ADDRESS_LENGTH))
            from := mload(add(input_data, mul(ADDRESS_LENGTH, 2)))
            to := mload(add(input_data, mul(ADDRESS_LENGTH, 3)))
            amount := mload(add(input_data, add(mul(ADDRESS_LENGTH, 3), UINT24_LENGTH)))
        }
        poolAddr = pool;
        fromToken = from;
        toToken = to;
        amountIn = amount; 
    }


    function test() external pure  {
        address _x = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; 
        address _y = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
        bytes memory packed = abi.encodePacked(_x, _y);
        console.logBytes(packed);
        address x;
        address y;
        assembly {
            x := mload(add(packed, ADDRESS_LENGTH))
            y := mload(add(packed, mul(ADDRESS_LENGTH, 2)))
        }

    }
}