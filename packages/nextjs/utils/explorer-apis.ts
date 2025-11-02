import scaffoldConfig from "~~/scaffold.config";

const { alchemyApiKey } = scaffoldConfig;

export const EXPLORER_APIS: Record<number, string> = {
  1: `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  11155111: `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`,
  137: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  10: `https://opt-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  42161: `https://arb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  8453: `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  31337: "http://127.0.0.1:8545",
};
