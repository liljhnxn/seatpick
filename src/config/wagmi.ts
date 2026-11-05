import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchain } from "./chain";

export const config = createConfig({
  chains: [botchain],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchain.id]: http(),
  },
  ssr: true,
});
