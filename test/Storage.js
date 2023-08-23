const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("@nomicfoundation/hardhat-ethers");

const abiCoder = new hre.ethers.AbiCoder();

describe("Storage", function () {
    async function deployStorage() {
        const number = 100;
        const [user1, user2] = await hre.ethers.getSigners();

        const Storage = await hre.ethers.getContractFactory("Storage");
        const storage = await Storage.deploy(number);

        const from = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //WETH
        const to = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //DAI

        const pool = "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11";
        const amount = 200;

        //const newData = "0xd68fd36ce7b2bb8a38bec78a72afc480dafdf97c8751e9f95aa4621443f3048ad68fd36ce7b2bb8a38bec78a72afc480dafdf97c8751e9f95aa4621443f3048a";
        const newData = "0x10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001"
        return { storage, number, pool, from, to, amount, user1, newData };
    }

    describe("Deployment", function () {
        it("Should set the right number", async function () {
            const { storage, number } = await loadFixture(deployStorage);

            expect(await storage.number()).to.equal(number);
        });
    });

    describe("Storage parameters", function () {
        it("Storage number", async function () {
            const { storage } = await loadFixture(deployStorage);
            await storage.store(321);
        });
        it("Storage parameters by solidity", async function () {
            const { storage, pool, from, to, amount, newData } = await loadFixture(deployStorage);
            await storage.store_solidity(pool, from, to, amount, newData);
            expect(await storage.poolAddr()).to.equal(pool);
            expect(await storage.fromToken()).to.equal(from);
            expect(await storage.toToken()).to.equal(to);
            expect(await storage.amountIn()).to.equal(amount);
        });
        it("Storage parameters by bytes data", async function () {
            const { storage, pool, from, to, amount, newData } = await loadFixture(deployStorage);
            const data = abiCoder.encode(["address", "address", "address", "uint24", "bytes"], [pool, from, to, amount, newData]);
            await storage.store_bytes(data);
            expect(await storage.poolAddr()).to.equal(pool);
            expect(await storage.fromToken()).to.equal(from);
            expect(await storage.toToken()).to.equal(to);
            expect(await storage.amountIn()).to.equal(amount);
        });
        it("Storage parameters by ziped bytes data", async function () {
            const { storage, pool, from, to, amount, newData } = await loadFixture(deployStorage);
            const dataPacked = hre.ethers.solidityPacked(["address", "address", "address", "uint24", "bytes"], [pool, from, to, amount, newData]);
            await storage.store_bytes_zip(dataPacked);
            expect(await storage.poolAddr()).to.equal(pool);
            expect(await storage.fromToken()).to.equal(from);
            expect(await storage.toToken()).to.equal(to);
            expect(await storage.amountIn()).to.equal(amount);
        });
        it("Storage parameters by ziped ziped bytes data", async function () {
            const { storage, pool, from, to, amount, user1, newData } = await loadFixture(deployStorage);
            const functionSelector = storage.interface.encodeFunctionData('store_bytes_zip_zip', []);
            const dataPacked = hre.ethers.solidityPacked(["address", "address", "address", "uint24", "bytes"], [pool, from, to, amount, newData]);
            const dataAll = functionSelector + dataPacked.substring(2);
            await user1.sendTransaction({
                to: storage.getAddress(),
                data: dataAll
            });
            expect(await storage.poolAddr()).to.equal(pool);
            expect(await storage.fromToken()).to.equal(from);
            expect(await storage.toToken()).to.equal(to);
            expect(await storage.amountIn()).to.equal(amount);
        });
    });

    describe("Estimate Gas", function () {
        it("Storage parameters by solidity", async function () {
            const { storage, pool, from, to, amount, user1, newData } = await loadFixture(deployStorage);
            //await storage.store_solidity(pool, from, to, amount);
            const dataFunc = storage.interface.encodeFunctionData('store_solidity', [pool, from, to, amount, newData]);
            const estimateGas = await user1.estimateGas({
                to: storage.getAddress(), data: dataFunc
            })
            console.log("estimateGas = ", estimateGas);
        });
        it("Storage parameters by bytes data", async function () {
            const { storage, pool, from, to, amount, user1, newData } = await loadFixture(deployStorage);
            const data = abiCoder.encode(["address", "address", "address", "uint24", "bytes"], [pool, from, to, amount, newData]);
            //await storage.store_bytes(data);
            const dataFunc = storage.interface.encodeFunctionData('store_bytes', [data]);
            const estimateGas = await user1.estimateGas({
                to: storage.getAddress(), data: dataFunc
            })
            console.log("estimateGas = ", estimateGas);
        });
        it("Storage parameters by ziped bytes data", async function () {
            const { storage, pool, from, to, amount, user1 } = await loadFixture(deployStorage);
            const dataPacked = hre.ethers.solidityPacked(["address", "address", "address", "uint24"], [pool, from, to, amount]);
            //console.log(dataPacked);
            //await storage.store_bytes_zip(dataPacked);
            const dataFunc = storage.interface.encodeFunctionData('store_bytes_zip', [dataPacked]);
            const estimateGas = await user1.estimateGas({
                to: storage.getAddress(), data: dataFunc
            })
            console.log("estimateGas = ", estimateGas);
        });
        it("Storage parameters by ziped ziped bytes data", async function () {
            const { storage, pool, from, to, amount, user1 } = await loadFixture(deployStorage);
            const functionSelector = storage.interface.encodeFunctionData('store_bytes_zip_zip', []);
            const dataPacked = hre.ethers.solidityPacked(["address", "address", "address", "uint24"], [pool, from, to, amount]);
            const dataAll = functionSelector + dataPacked.substring(2) + '0'.repeat(58);
            //console.log(dataAll);
            const estimateGas = await user1.estimateGas({
                to: storage.getAddress(), data: dataAll
            })
            console.log("estimateGas = ", estimateGas);
        })
    });
});
