import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [sepolia],
  connectors: [],
  ssr: true,
  transports: {
    [sepolia.id]: http("", {
      fetchOptions: {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
      },
    }),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
