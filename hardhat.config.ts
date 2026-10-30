import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const rawKey = (process.env.PRIVATE_KEY || "").replace(/["']/g, "").trim();
const cleanKey = rawKey.startsWith("0x") ? rawKey.slice(2) : rawKey;
const isValidKey = /^[0-9a-fA-F]{64}$/.test(cleanKey);
const formattedKey = isValidKey ? `0x${cleanKey}` : undefined;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    botchain: {
      url: "https://rpc.bohr.life",
      chainId: 968,
      accounts: formattedKey ? [formattedKey] : [],
    },
  },
  etherscan: {
    apiKey: {
      botchain: "empty",
    },
    customChains: [
      {
        network: "botchain",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
