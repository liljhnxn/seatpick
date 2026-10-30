import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainTestnet } from "./chain";

export const config = createConfig({
  chains: [botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainTestnet.id]: http(),
  },
  ssr: true,
});

