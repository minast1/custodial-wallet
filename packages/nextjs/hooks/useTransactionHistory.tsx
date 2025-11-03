import { useEffect, useMemo } from "react";
import { useTargetNetwork } from "./scaffold-eth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useBlockNumber } from "wagmi";
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

function inferCategory(tx: any, address: string): string {
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  if (tx.from?.toLowerCase() === zeroAddress) return "mint";
  if (tx.to?.toLowerCase() === zeroAddress) return "burn";

  const dexRouters = [
    "0xe592427a0aece92de3edee1f18e0157c05861564", // Uniswap V3
    "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506", // SushiSwap
    "0xdef1c0ded9bec7f1a1670819833240f027b25eff", // 0x Exchange
    "0x1111111254eeb25477b68fb85ed929f73a960582", // 1inch
  ];

  if (dexRouters.includes(tx.to?.toLowerCase())) return "swap";

  if (tx.to?.toLowerCase() === address.toLowerCase()) return "received";
  if (tx.from?.toLowerCase() === address.toLowerCase()) return "sent";
  return "transfer";
}

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
async function fetchConfirmedTxs(limit: number, rpcUrl: string, address: string) {
  const payload = (filter: Record<string, any>) => ({
    jsonrpc: "2.0",
    id: 0,
    method: "alchemy_getAssetTransfers",
    params: [
      {
        ...filter,
        category: ["external", "erc20", "erc721", "erc1155", "internal"],
        order: "desc",
        maxCount: `0x${limit.toString(16)}`,
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

  return [...outTxs, ...inTxs].map(
    (tx: any): Tx => ({
      hash: tx.hash,
      direction: tx.to?.toLowerCase() === address.toLowerCase() ? "in" : "out",
      from: tx.from,
      to: tx.to,
      value: tx.value,
      tokenName: tx.asset ?? tx.tokenName,
      tokenSymbol: tx.asset ?? tx.tokenSymbol,
      tokenId: tx.tokenId,
      type: formatTxCategory(tx),
      timeStamp: tx.metadata?.blockTimestamp ?? "",
      status: "confirmed",
      category: inferCategory(tx, address),
    }),
  );
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
        category: inferCategory(tx, address),
      };
    });
  } catch {
    return [];
  }
}
export const useTransactionHistory = ({ limit = 3 }: { limit?: number }) => {
  const { targetNetwork } = useTargetNetwork();
  const { address, isConnected } = useAccount();

  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });

  const rpcUrl = targetNetwork ? EXPLORER_APIS[targetNetwork.id] : EXPLORER_APIS[1];
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => ["txHistory", address, targetNetwork, rpcUrl], [address, targetNetwork, rpcUrl]);

  const {
    data: txs = [],
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    enabled: !!isConnected && !!address,
    queryFn: async () => {
      if (!address) return [];

      const [confirmed, pending] = await Promise.all([
        fetchConfirmedTxs(3, rpcUrl, address),
        fetchPendingTxs(3, rpcUrl, address),
      ]);

      const all = [...pending, ...confirmed];

      const unique = Array.from(new Map(all.map(tx => [tx.hash, tx])).values());
      return unique.sort((a, b) => (b.timeStamp > a.timeStamp ? 1 : -1)).slice(0, limit);
      // return unique
      //   .sort((a, b) => {
      //     const ta = a.timeStamp ? new Date(a.timeStamp).getTime() : 0;
      //     const tb = b.timeStamp ? new Date(b.timeStamp).getTime() : 0;
      //     return tb - ta;
      //   })
      //   .slice(0, limit);
    },
    retry: false,
    //staleTime: 1000 * 60, // 1 minute,
  });

  useEffect(() => {
    const loader = async () => {
      if (isConnected && address) {
        await queryClient.ensureQueryData({ queryKey });
      }
    };

    loader();
  }, [rpcUrl, targetNetwork, isConnected, address, queryClient, queryKey]);

  //another useEffect to invalidate the query
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient]);

  return {
    txs,
    isFetching,
    isError,
    refetch,
  };
};
