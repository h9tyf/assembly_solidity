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

        const platform1 = {platform: 1, pool: "0xD8dEC118e1215F02e10DB846DCbBfE27d477aC19", len: 1, data: "0x0000000000000000000000000000000000000000000000000000000000000064"};
        const platform2 = {platform: 2, pool: "0x60594a405d53811d3BC4766596EFD80fd545A270", len: 2, data: "0x00000000000000000000000000000000000000000000000000000000000001f400000000000000000000000000000000000000000000000000000000000001f4"};

        return { executor, WETH, DAI, platform1, platform2, user1, user2 };
    }

    it("simple", async function () {
        const { executor, WETH, DAI, platform1, platform2, user1 } = await loadFixture(deploy);
        await executor.execute_init(
            100, 
            user1.address,
            2, 
            [platform1, platform2],
            [WETH, DAI, WETH]);
    });
    it("assembly", async function () {
        
    });

});