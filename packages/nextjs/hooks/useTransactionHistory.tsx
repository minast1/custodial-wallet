import { useTargetNetwork } from "./scaffold-eth";
import { useQuery } from "@tanstack/react-query";
//import { decodeFunctionData, erc20Abi } from "viem";
import { UsePublicClientReturnType, useAccount, usePublicClient } from "wagmi";
import { customDecodeTxData } from "~~/utils/customDecodeTxData";
import { EXPLORER_APIS } from "~~/utils/explorer-apis";

export type TxType = "native" | "erc20" | "erc721" | "erc1155" | "internal";
export type TXStatus = "pending" | "confirmed" | "failed";

export interface Tx {
  hash: string;
  direction: "in" | "out";
  from: string;
  to: string;
  value?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenId?: string;
  type: TxType;
  timeStamp: string;
  status: TXStatus;
  category?: string;
}

// ---------------------HELPERS---------------------
// function hexToDecimal(hex?: string) {
//   if (!hex) return 0;
//   return parseInt(hex, 16);
// }
const ZERO = "0x0000000000000000000000000000000000000000";
export type TxCategory =
  | {
      category: "approval";
      symbol: string;
      amount: number;
    }
  | {
      category: "token_received";
      symbol: string;
      amount: number;
    }
  | {
      category: "mint" | "burn" | "swap" | "sent" | "transfer" | "received";
    };
const categoryParser = async function (
  tx: any,
  address: string,
  client: UsePublicClientReturnType,
): Promise<TxCategory> {
  const from = tx.from?.toLowerCase();
  const to = tx.to?.toLowerCase();
  const user = address.toLowerCase();

  // --- Mint / Burn ---
  if (from === ZERO) return { category: "mint" };
  if (to === ZERO) return { category: "burn" };

  // --- Known DEX Routers ---
  const dexRouters = new Set([
    "0xe592427a0aece92de3edee1f18e0157c05861564", // Uniswap V3
    "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506", // SushiSwap
    "0xdef1c0ded9bec7f1a1670819833240f027b25eff", // 0x Exchange
    "0x1111111254eeb25477b68fb85ed929f73a960582", // 1inch
  ]);

  if (dexRouters.has(to)) return { category: "swap" };

  // --- Pull the *full transaction* to detect Approvals ---
  let fullTx;
  try {
    fullTx = await client?.getTransaction({ hash: tx.hash }).catch(() => null);
  } catch {
    fullTx = null;
  }

  // No input data = not an approval
  if (!fullTx || !fullTx.input || fullTx.input === "0x") {
    // fallback to sent/received
    if (to === user) return { category: "received" };
    if (from === user) return { category: "sent" };
    return { category: "transfer" };
  }

  const res = await customDecodeTxData(fullTx, client);

  //Received token transfer
  if (res && to === user) return { category: "token_received", amount: res.amount, symbol: res.symbol };

  //Approval
  if (res) {
    return {
      category: "approval",
      symbol: res.symbol,
      amount: res.amount,
    };
  }

  // --- Regular incoming/outgoing transfers ---
  if (to === user) return { category: "received" };
  if (from === user) return { category: "sent" };

  return { category: "transfer" };
};

function formatTxCategory(transfer: any): TxType {
  if (transfer.category?.includes("erc721")) return "erc721";
  if (transfer.category?.includes("erc1155")) return "erc1155";
  if (transfer.category?.includes("erc20")) return "erc20";
  if (transfer.category?.includes("internal")) return "internal";
  return "native";
}
/**
 * Fetch confirmed transactions (sent + received)
 */
async function fetchConfirmedTxs(client: UsePublicClientReturnType, rpcUrl: string, address: string) {
  const payload = (filter: Record<string, any>) => ({
    jsonrpc: "2.0",
    id: 0,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        ...filter,
        category: ["external", "erc20", "erc721", "erc1155", "internal"],
        order: "desc",
        //maxCount: `0x${limit.toString(16)}`,
        excludeZeroValue: false,
        withMetadata: true,
      },
    ],
  });

  // Fetch outgoing and incoming transfers in parallel
  const [outRes, inRes] = await Promise.all([
    fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload({ fromAddress: address })),
    }),
    fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload({ toAddress: address })),
    }),
  ]);

  const [outJson, inJson] = await Promise.all([outRes.json(), inRes.json()]);

  const outTxs = outJson?.result?.transfers || [];
  const inTxs = inJson?.result?.transfers || [];

  const txPromises = [...outTxs, ...inTxs].map(async (tx: any): Promise<Tx> => {
    const category = await categoryParser(tx, address, client);

    return {
      hash: tx.hash,
      direction: tx.to?.toLowerCase() === address.toLowerCase() ? "in" : "out",
      from: tx.from,
      to: tx.to,
      value:
        category.category === "approval"
          ? category.amount
          : category.category === "token_received"
            ? tx.value
            : tx.value,
      tokenName: tx.asset ?? tx.tokenName,
      tokenSymbol: category.category === "approval" ? category.symbol : (tx.asset ?? tx.tokenSymbol),
      tokenId: tx.tokenId,
      type: formatTxCategory(tx),
      timeStamp: tx.metadata?.blockTimestamp ?? "",
      status: "confirmed",
      category: category?.category,
    };
  });

  const confirmedTxs = await Promise.all(txPromises);
  return confirmedTxs;
}

/**
 * Fetch pending and failed transactions
 */
async function fetchPendingTxs(limit: number, rpcUrl: string, address: string) {
  try {
    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTransactionReceipts",
      params: [
        {
          fromAddress: address,
        },
      ],
    };

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const { result } = await response.json();
    if (!result?.receipts?.length) return [];

    // Fetch block timestamps for failed txs
    const blockNumbers = [...new Set(result.receipts.filter((r: any) => r.blockNumber).map((r: any) => r.blockNumber))];

    const blockTimestamps: Record<string, string> = {};
    await Promise.all(
      blockNumbers.map(async blockNum => {
        const res = await fetch(rpcUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: blockNum,
            method: "eth_getBlockByNumber",
            params: [blockNum, false],
          }),
        });
        const { result } = await res.json();
        if (result?.timestamp) {
          blockTimestamps[blockNum as string] = new Date(parseInt(result.timestamp, 16) * 1000).toISOString();
        }
      }),
    );
    return result.receipts.map((tx: any) => {
      const isPending = !tx.blockNumber;
      const isFailed = tx.status === "0x0";
      const timestamp =
        (tx.blockNumber && blockTimestamps[tx.blockNumber]) || (isPending ? new Date().toISOString() : "");

      return {
        hash: tx.transactionHash,
        direction: tx.from?.toLowerCase() === address.toLowerCase() ? "out" : "in", //always out
        from: tx.from,
        to: tx.to,
        value: tx.value,
        type: "native",
        timeStamp: timestamp,
        status: isPending ? "pending" : isFailed ? "failed" : "confirmed",
        category: "internal",
      };
    });
  } catch {
    return [];
  }
}
export const useTransactionHistory = ({ limit = 3 }: { limit?: number }) => {
  const { targetNetwork } = useTargetNetwork();
  const { address, isConnected } = useAccount();
  const client = usePublicClient({ chainId: targetNetwork.id });
  // const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });

  const rpcUrl = targetNetwork ? EXPLORER_APIS[targetNetwork.id] : EXPLORER_APIS[1];
  //const queryClient = useQueryClient();

  const queryKey = ["txHistory", address, targetNetwork, limit];

  const {
    data: txs = [],
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    enabled: !!isConnected && !!address,
    queryFn: async () => {
      if (!address) return [];

      const [confirmed, pending] = await Promise.all([
        fetchConfirmedTxs(client, rpcUrl, address),
        fetchPendingTxs(3, rpcUrl, address),
      ]);

      const all = [...pending, ...confirmed];
      //console.log(all);
      const unique = Array.from(new Map(all.map(tx => [tx.hash, tx])).values());
      return unique.sort((a, b) => (b.timeStamp > a.timeStamp ? 1 : -1)).slice(0, limit);
    },
    retry: false,
    //staleTime: 1000 * 60, // 1 minute,
  });

  return {
    txs,
    isFetching,
    isLoading,
    isError,
    refetch,
  };
};
