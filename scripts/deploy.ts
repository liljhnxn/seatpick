import hre from "hardhat";

const { ethers } = hre;

async function main() {
  const network = await ethers.provider.getNetwork();
  console.log("==================================================");
  console.log(`Deploying SeatPick smart contract to network...`);
  console.log(`Chain ID: ${network.chainId.toString()}`);

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const initialBalance = await ethers.provider.getBalance(deployer.address);
  console.log("Initial deployer balance:", ethers.formatEther(initialBalance), "BOT");

  // Query network fee data to ensure we do not overpay gas
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log("Using standard network gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  const SeatPick = await ethers.getContractFactory("SeatPick");
  
  // Deploy with exact standard gas price without inflated tip
  const seatPick = await SeatPick.deploy({
    gasPrice: gasPrice,
  });

  console.log("Transaction broadcasted! Waiting for block confirmation...");
  await seatPick.waitForDeployment();

  const address = await seatPick.getAddress();
  const deployTx = seatPick.deploymentTransaction();
  const receipt = await deployTx?.wait();

  const finalBalance = await ethers.provider.getBalance(deployer.address);
  const gasUsed = receipt?.gasUsed || 0n;
  const gasCost = gasUsed * gasPrice;

  console.log("==================================================");
  console.log("🎉 SeatPick DEPLOYED SUCCESSFULLY!");
  console.log("Contract Address:", address);
  console.log("Transaction Hash:", deployTx?.hash);
  console.log("Gas Units Used:", gasUsed.toString());
  console.log("Total Deployment Cost:", ethers.formatEther(gasCost), "BOT");
  console.log("Remaining Balance:", ethers.formatEther(finalBalance), "BOT");
  console.log("Total Seats Configured: 20");
  console.log("==================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
