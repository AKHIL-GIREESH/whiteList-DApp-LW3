const {ethers} = require("hardhat")

async function main(){
  const whiteListContract = await ethers.getContractFactory("WhiteList");
  const deployedWhiteListContract = await whiteListContract.deploy(10);
  await deployedWhiteListContract.deployed();
  console.log("WhiteListContract Address",deployedWhiteListContract.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});