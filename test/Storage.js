const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");
const{ethers} = require("@nomicfoundation/hardhat-ethers");

const abiCoder = new hre.ethers.AbiCoder();

describe("Storage", function () {
    async function deployStorage() {
        const number = 100;
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const Storage = await hre.ethers.getContractFactory("Storage");
        const storage = await Storage.deploy(number);

        const from = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //WETH
        const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //DAI

        const pool = "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11";
        const amount = 200;
        return { storage, number, pool, from, to, amount };
    }

    describe("Deployment", function () {
        it("Should set the right number", async function () {
            const { storage, number } = await loadFixture(deployStorage);

            expect(await storage.number()).to.equal(number);
            /* console.log(await storage.number());
            console.log(await storage.poolAddr());
            console.log(await storage.fromToken());
            console.log(await storage.toToken());
            console.log(await storage.amountIn()); */
        });
    });

    describe("Storage parameters", function () {
        it("Storage number", async function () {
            const { storage } = await loadFixture(deployStorage);
            await storage.store(321);
            /* console.log(await storage.number());
            console.log(await storage.poolAddr());
            console.log(await storage.fromToken());
            console.log(await storage.toToken());
            console.log(await storage.amountIn()); */
        });
        it("Storage parameters by solidity", async function () {
            const { storage, pool, from, to, amount } = await loadFixture(deployStorage);
            await storage.store_solidity(pool, from, to, amount);
            /* console.log(await storage.number());
            console.log(await storage.poolAddr());
            console.log(await storage.fromToken());
            console.log(await storage.toToken());
            console.log(await storage.amountIn()); */
        });
        it("Storage parameters by bytes data", async function () {
            const { storage, pool, from, to, amount } = await loadFixture(deployStorage);
            const data = abiCoder.encode(["address", "address", "address", "uint24"], [pool, from, to, amount]);
            await storage.store_bytes(data);
            //console.log(data);
            /* console.log(await storage.number());
            console.log(await storage.poolAddr());
            console.log(await storage.fromToken());
            console.log(await storage.toToken());
            console.log(await storage.amountIn()); */
        });
        it("Storage parameters by ziped bytes data", async function () {
            const { storage, pool, from, to, amount } = await loadFixture(deployStorage);    
            const dataPacked = hre.ethers.solidityPacked(["address", "address", "address", "uint24"], [pool, from, to, amount]);
            console.log(dataPacked);
            await storage.store_bytes_zip(dataPacked);
            console.log(await storage.number());
            console.log(await storage.poolAddr());
            console.log(await storage.fromToken());
            console.log(await storage.toToken());
            console.log(await storage.amountIn()); 
        })


    });
});
