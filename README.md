# assembly test

### Contract: Storage.sol

```solidity
//parameters
address public poolAddr;
address public fromToken;
address public toToken;
uint24 public amountIn;

//functions for changing parameters
//simple
function store_solidity(address pool, address from, address to, uint24 amount) external {
    poolAddr = pool;
    fromToken = from;
    toToken = to;
    amountIn = amount;
}
//send parameters by data and decode by abi.decode
function store_bytes(bytes calldata data) external {
    console.logBytes(data);
    (address pool, address from, address to, uint24 amount) 
        = abi.decode(data, (address, address, address, uint24));
    poolAddr = pool;
    fromToken = from;
    toToken = to;
    amountIn = amount;
}
//send ziped parameters by data and decode by assembly
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
//send ziped-ziped parameters by raw data and decode by assembly
function store_bytes_zip_zip() external {
    bytes memory input;
    address pool;
    address from;
    address to;
    uint24 amount;
    assembly {
        let calldata_len := calldatasize()
        let input_len := sub(calldata_len, 4)

        input := mload(0x40)
        mstore(input, input_len)

        let input_data := add(input, 0x20)
        calldatacopy(input_data, 4, input_len)

        let free := add(input_data, input_len)
        let free_round := and(add(free, 31), not(31))
        mstore(0x40, free_round)

        pool := mload(add(input, ADDRESS_LENGTH))
        from := mload(add(input, mul(ADDRESS_LENGTH, 2)))
        to := mload(add(input, mul(ADDRESS_LENGTH, 3)))
        amount := mload(add(input, add(mul(ADDRESS_LENGTH, 3), UINT24_LENGTH)))
    }
    poolAddr = pool;
    fromToken = from;
    toToken = to;
    amountIn = amount; 
}
```

### Test

```solidity
poolAddr: 0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11 //by uniswapv2 factory
fromToken: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 //WETH
toToken: 0x6B175474E89094C44Da98b954EedeAC495271d0F //DAI
amountIn: 200
```

##### data before and after compression


```solidity
//before compression, 4 * 32bytes = 128bytes 
000000000000000000000000a478c2975ab1ea89e8196811f51a7b7ade33eb11
000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f
00000000000000000000000000000000000000000000000000000000000000c8

//after compression, 3 * 20 + 3 = 63bytes
A478c2975Ab1Ea89e8196811F51A7B7Ade33eB11 //address: 20bytes
C02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
6B175474E89094C44Da98b954EedeAC495271d0F
0000c8 //uint24: 3bytes

//compress data further
//All data sent to the contract
4d9553cb //functionSelector
a478c2975ab1ea89e8196811f51a7b7ade33eb11
c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
6b175474e89094c44da98b954eedeac495271d0f
0000c8
0000000000000000000000000000000000000000000000000000000000 //padding
```

##### estimate Gas of three functions
simple:

- store_solidity: 92760

- store_bytes: 93313

- store_bytes_zip: 92477

- store_bytes_zip_zip: 91905 => 91893(delete input_len)

add bytes as parameter:

- store_solidity: 94748

- store_bytes: 95579

- store_bytes_zip: 93478

- store_bytes_zip_zip: 92961

### Contract: Executor.sol

add parameters for exchanges.length

Gas: 38204 => 38864 => 35222