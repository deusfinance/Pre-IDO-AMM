
const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const _factory = "0x0000000000000000000000000000000000000001"
    const _ammID = 0
    const _fee = 100
    const _collateralAddress = "0x19875868EfC944561405EeEaBe153354ACA4D071"
    const _startBlock = 9716270
    const _cw = "250000"
    const _name = "Test PreIDO Token"
    const _symbol = "TPT"

    // deploy power
    const PowerContract = await hre.ethers.getContractFactory("Power");
    const power = await PowerContract.deploy();
    await power.deployed();

    const PreIDOTokenContract = await hre.ethers.getContractFactory("PreIDOToken");

    // address _factory, uint256 _ammID, uint32 _fee, address _collateralAddress, address _powerLibrary, uint256 _startBlock, uint32 _cw, string memory _name, string memory _symbol
    const PreIDOToken = await PreIDOTokenContract.deploy(_factory, _ammID, _fee, _collateralAddress, power.address, _startBlock, _cw, _name, _symbol);
    await PreIDOToken.deployed();
    console.log("PreIDOToken deployed to:", PreIDOToken.address);

    await sleep(60000);
    //////////////////////////////////////////////////////////////////////////////
    await hre.run("verify:verify", {
        address: power.address,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: PreIDOToken.address,
        constructorArguments: [_factory, _ammID, _fee, _collateralAddress, power.address, _startBlock, _cw, _name, _symbol],
    });
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
