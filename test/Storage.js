const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Storage", function () {
    async function deployStorage() {
        const number = 100;
        const [owner, otherAccount] = await ethers.getSigners();

        const Storage = await ethers.getContractFactory("Storage");
        const storage = await Storage.deploy(number);

        return { storage, number, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right number", async function () {
            const { storage, number } = await loadFixture(deployStorage);

            expect(await storage.number()).to.equal(number);
            console.log(await storage.number());
            console.log(await storage.poolAddr());
            console.log(await storage.fromToken());
            console.log(await storage.toToken());
            console.log(await storage.amountIn());
        });
    });

    describe("Storage parameters", function () {
        it("Storage number", async function () {
            expect(1).to.equal(1);

        });
        it("Storage parameters by solidity", async function () {
            expect(1).to.equal(1);
        });
        it("Storage parameters by assembly", async function () {
            expect(1).to.equal(1);
        })


    });
});
