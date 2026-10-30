import { defineChain } from "viem";

/**
 * Botchain Testnet specification:
 * Network: Botchain Testnet
 * Chain ID: 968
 * RPC URL: https://rpc.bohr.life
 * Block Explorer: https://scan.bohr.life
 */
export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    name: "Botchain",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "BohrScan",
      url:
        process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.bohr.life",
    },
  },
  testnet: true,
});
