const { ethers } = require("hardhat");

async function main() {

 const EscrowStore = await ethers.getContractFactory("EscrowStore");
 const escrowstore = await EscrowStore.deploy();

  console.log(
    `EscrowStore deployed to ${escrowstore.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
