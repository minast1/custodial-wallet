const TOKEN_ICON_MAP: Record<string, string> = {
  // 🪙 ETH Ecosystem
  ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  WETH: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
  USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
  DAI: "https://assets.coingecko.com/coins/images/9956/small/4943.png",
  LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png",
  UNI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
  COMP: "https://assets.coingecko.com/coins/images/10775/small/COMP.png",
  MKR: "https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png",
  LDO: "https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png",
  SNX: "https://assets.coingecko.com/coins/images/3406/small/SNX.png",
  GRT: "https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png",
  ENS: "https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg",
  SUSHI: "https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_background.png",
  CRV: "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
  BAL: "https://assets.coingecko.com/coins/images/12882/small/Balancer.png",
  YFI: "https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png",
  BAT: "https://assets.coingecko.com/coins/images/677/small/basic-attention-token.png",
  RPL: "https://assets.coingecko.com/coins/images/2090/small/rocket_pool_%28RPL%29.png",

  // 🟣 Polygon Ecosystem
  MATIC: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
  QUICK: "https://assets.coingecko.com/coins/images/25023/small/Quickswap.png",
  SAND: "https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg",

  // 🔵 Arbitrum / Optimism / L2
  ARB: "https://assets.coingecko.com/coins/images/16547/small/arb1.png",
  OP: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",

  // 🟢 Stablecoins
  FRAX: "https://assets.coingecko.com/coins/images/13422/small/frax_logo.png",
  TUSD: "https://assets.coingecko.com/coins/images/3449/small/tusd.png",
  USDP: "https://assets.coingecko.com/coins/images/9648/small/USDP.png",
  GUSD: "https://assets.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png",
  LUSD: "https://assets.coingecko.com/coins/images/14666/small/Group_3.png",
  BUSD: "https://assets.coingecko.com/coins/images/9576/small/BUSD.png",

  // 🟡 Other Blue Chips / Layer 1s
  BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  AVAX: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png",
  FTM: "https://assets.coingecko.com/coins/images/4001/small/Fantom.png",
  SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
  ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",

  // ⚙️ Miscellaneous Tokens
  "1INCH": "https://assets.coingecko.com/coins/images/13469/small/1inch-token.png",
  GNO: "https://assets.coingecko.com/coins/images/662/small/gnosis-logo.png",
  MANA: "https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png",
  APE: "https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg",
  PEPE: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
  SHIB: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
  FLOKI: "https://assets.coingecko.com/coins/images/16746/small/PNG_image.png",
  DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
};

/**
 * Returns a token image URL or undefined if not found.
 * Falls back to rendering the token symbol.
 */
export function getTokenIcon(symbol: string): string | undefined {
  if (!symbol) return undefined;

  const upperSymbol = symbol.toUpperCase();
  return TOKEN_ICON_MAP[upperSymbol];
}
