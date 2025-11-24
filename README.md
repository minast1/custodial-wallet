# 🏗 Web3 Wallet Application

<!--
<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4> -->

🧪 This project is a modern, full-stack Web3 wallet application built with a focus on simplicity, speed, and an intuitive user experience. It enables users to send, receive, store, and visualize digital assets across Ethereum-compatible networks while integrating advanced blockchain tooling and best-practice protocols.

⚙️ Built using NextJS, RainbowKit, Foundry,TailwindCss, Wagmi, Viem, and Typescript.

⭐ Core Features

- **Multi-Asset Support**:
  The wallet supports:

Native tokens (ETH, MATIC, etc.)

ERC-20 tokens

ERC-721 NFTs

ERC-1155 multi-asset NFTs

Users can:

View token balances

View NFT collections (with metadata and floor price)

Send and receive any token or NFT

Track transaction history (transfers, swaps, approvals, mints, burns)

- 🔥 **Transaction Categorization Engine**:
  Incoming transaction data is normalized and categorized using:

Alchemy’s getAssetTransfers API

Contract ABI decoding via viem

Categories include:

sent

received

swap

approval

mint

burn

transfer

The wallet detects:

Token approvals (approve(spender, amount))

Token swaps via major DEX routers

Minting and burning events

Native vs token transfers

- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

## ⭐ 3. NFT Portfolio Viewer

Using Alchemy NFT API, the wallet fetches:

Owned NFTs

Full metadata (image, traits, collection info)

Collection floor price

Multi-chain support (Ethereum, Polygon, Base, etc.)

A React Query hook manages:

Caching

Pagination

Automatic refetching

Error boundaries

⭐ 4. Receive Page

A clean, universal “Receive Asset” screen that provides:

QR code containing the user’s address

ENS name fallback

Animated scanning frame

Copy-to-clipboard support

Compatible with all tokens and NFTs (no token-specific receive logic needed)

⭐ 5. Send Flow

Tokens can be sent using:

viem writeContract or wagmi’s useContractWrite

Auto-detection of token type

Gas estimation

Automated decimal handling for ERC-20 tokens

Multi-chain support is integrated using wagmi connectors.
