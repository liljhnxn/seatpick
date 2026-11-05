import { defineChain } from "viem";

/**
 * Botchain Mainnet specification:
 * Network: Botchain Mainnet
 * Chain ID: 677
 * RPC URL: https://rpc.botchain.ai
 * Native Token: BOT
 * Block Explorer: https://scan.botchain.ai
 */
export const botchain = defineChain({
  id: 677,
  name: "Botchain Mainnet",
  nativeCurrency: {
    name: "Botchain",
    symbol: "BOT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "BotchainScan",
      url:
        process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.botchain.ai",
    },
  },
});
