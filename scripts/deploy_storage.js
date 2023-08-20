const hre = require("hardhat");

async function main() {
    const number = 12;
    const storage = await hre.ethers.deployContract("Storage", [number]);

    await storage.waitForDeployment();

    console.log(
        `Storage deployed with number ${number}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
