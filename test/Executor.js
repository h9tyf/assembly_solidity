const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("@nomicfoundation/hardhat-ethers");

const abiCoder = new hre.ethers.AbiCoder();

describe("Executor", function () {
    async function deploy() {
        const [user1, user2] = await hre.ethers.getSigners();

        const Executor = await hre.ethers.getContractFactory("Executor");
        const executor = await Executor.deploy();

        const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

        const platform1 = { platform: 1, pool: "0xD8dEC118e1215F02e10DB846DCbBfE27d477aC19", data: "0x0000000000000000000000000000000000000000000000000000000000000064" };
        const platform2 = { platform: 2, pool: "0x60594a405d53811d3BC4766596EFD80fd545A270", data: "0x00000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000001f4" };

        return { executor, WETH, DAI, platform1, platform2, user1, user2 };
    }

    it("simple", async function () {
        const { executor, WETH, DAI, platform1, platform2, user1 } = await loadFixture(deploy);
        await executor.execute_init(
            100,
            user1.address,
            [WETH, DAI, WETH],
            [platform1, platform2]); 
        const dataFunc = executor.interface.encodeFunctionData('execute_init', [100, user1.address, [WETH, DAI, WETH], [platform1, platform2]]);
        const estimateGas = await user1.estimateGas({
            to: executor.getAddress(), data: dataFunc
        })
        console.log("estimateGas = ", estimateGas);

    });
    it("simple for data", async function () {
        const { executor, WETH, DAI, platform1, platform2, user1 } = await loadFixture(deploy);
        const dataAll = executor.interface.encodeFunctionData("execute_init", [100, user1.address, [WETH, DAI, WETH], [platform1, platform2]]);
        //console.log(dataAll);
        await user1.sendTransaction({
            to: executor.getAddress(),
            data: dataAll
        });
    });
    it("assembly", async function () {
        const { executor, WETH, DAI, platform1, platform2, user1 } = await loadFixture(deploy);
        const functionSelector = executor.interface.encodeFunctionData('execute_assembly', []);

        const struct1Packed = abiCoder.encode(["uint8", "address", "bytes"], [platform1.platform, platform1.pool, platform1.data]);
        const struct2Packed = abiCoder.encode(["uint8", "address", "bytes"], [platform2.platform, platform2.pool, platform2.data]);
        const size1 = (struct1Packed.length - 2)/2;
        const size2 = (struct2Packed.length - 2)/2;

        const dataPacked = hre.ethers.solidityPacked(["uint", "address", "uint", "address[]", "uint256[]"], [100, user1.address, 2, [WETH, DAI, WETH], [size1, size2]]);
        const dataAll = functionSelector + dataPacked.substring(2) + struct1Packed.substring(2) + struct2Packed.substring(2);
        //console.log("raw data = ", dataAll);
        await user1.sendTransaction({
            to: executor.getAddress(),
            data: dataAll
        });
        const estimateGas = await user1.estimateGas({
            to: executor.getAddress(), data: dataAll
        })
        console.log("estimateGas = ", estimateGas);
    });

});