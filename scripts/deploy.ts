import hre from "hardhat";

const { ethers } = hre;

async function main() {
  console.log("Deploying SeatPick smart contract to network...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance));

  const SeatPick = await ethers.getContractFactory("SeatPick");
  const seatPick = await SeatPick.deploy();

  await seatPick.waitForDeployment();

  const address = await seatPick.getAddress();
  console.log("--------------------------------------------------");
  console.log("SeatPick deployed successfully to:", address);
  console.log("Total seats configured: 20");
  console.log("Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local with:", address);
  console.log("--------------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
