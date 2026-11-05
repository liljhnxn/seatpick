import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

async function main() {
  const rpcUrl = "https://rpc.botchain.ai";
  console.log("Connecting to Botchain Mainnet RPC:", rpcUrl);

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  try {
    const network = await provider.getNetwork();
    console.log("Network detected:");
    console.log(" - Chain ID:", network.chainId.toString());

    const feeData = await provider.getFeeData();
    console.log("Current Fee Data:");
    console.log(" - Gas Price:", feeData.gasPrice ? `${ethers.formatUnits(feeData.gasPrice, "gwei")} gwei` : "N/A");

    const rawKey = (process.env.PRIVATE_KEY || "").replace(/["']/g, "").trim();
    const cleanKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;

    const wallet = new ethers.Wallet(cleanKey, provider);
    console.log("Deployer Address:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("Deployer Balance:", ethers.formatEther(balance), "BOT");
  } catch (error: any) {
    console.error("RPC / Account check failed:", error.message);
  }
}

main();

