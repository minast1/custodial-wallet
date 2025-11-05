"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useAccount, useBlockNumber } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
//import scaffoldConfig from "~~/scaffold.config";
import { EXPLORER_APIS } from "~~/utils/explorer-apis";

//import { fetchTokenPrices } from "~~/utils/fetch-tokenprices";

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

interface TokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  usdPrice?: number;
  usdValue?: number;
  percentage_change_24h: number;
}

//const { alchemyApiKey } = scaffoldConfig;
export const useGetTokenBalances = () => {
  const { address, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });
  const rpcUrl = targetNetwork ? EXPLORER_APIS[targetNetwork.id] : EXPLORER_APIS[1];

  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["tokenBalances", address, targetNetwork.id], [address, targetNetwork.id]);

  const {
    data: tokenData = { tokens: [], totalUsdValue: 0 },
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!address) return { tokens: [], totalUsdValue: 0 };

      const tokenBalancesRes = await fetch(`${rpcUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 42,
          method: "alchemy_getTokenBalances",
          params: [address],
        }),
      });

      const tokenBalancesData = await tokenBalancesRes.json();
      const balances: TokenBalance[] = tokenBalancesData?.result?.tokenBalances || [];
      const nonZeroBalances = balances.filter(b => b.tokenBalance !== "0x0");

      //Get token metadata (symbol, decimals, etc.)
      const tokenMetadata = await Promise.all(
        nonZeroBalances.map(async token => {
          const metaRes = await fetch(`${rpcUrl}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "alchemy_getTokenMetadata",
              params: [token.contractAddress],
            }),
          });

          const metaJson = await metaRes.json();
          return {
            address: token.contractAddress,
            symbol: metaJson.result?.symbol || "UNKNOWN",
            name: metaJson.result?.name || "Unknown Token",
            decimals: metaJson.result?.decimals || 18,
            balance: parseFloat(formatUnits(BigInt(token.tokenBalance), metaJson.result?.decimals || 18)),
          };
        }),
      );

      const symbols = tokenMetadata.map(t => t.symbol).filter(Boolean);
      /// const symbolJson = JSON.stringify(symbols);
      if (!symbols.length) return { tokens: [], totalUsdValue: 0 };
      const params = new URLSearchParams({ symbols: symbols.join(",") });

      //Fetch token Prices
      const prices = await fetch(`/api/prices?${params.toString()}`);
      if (!prices.ok) throw new Error("Failed to fetch token prices");
      const pricesJson = await prices.json();
      const pricesData = pricesJson?.data.data || [];

      //Map prices to tokens
      const tokensWithPrices: TokenData[] = tokenMetadata.map(token => {
        const usdPrice = pricesData[token.symbol]?.[0]?.quote?.USD?.price || 0;

        const usdValue = usdPrice * token.balance;
        const percentage_change_24h = pricesData[token.symbol]?.[0]?.quote?.USD?.percent_change_24h || 0;
        return { ...token, usdPrice, usdValue, percentage_change_24h };
      });

      // 7️⃣ Calculate total USD value
      const totalUsdValue = tokensWithPrices.reduce((sum, t) => sum + (t.usdValue || 0), 0);

      return {
        tokens: tokensWithPrices,
        totalUsdValue, //tokens.reduce((acc, t) => acc +  0), 0),
      };
    },
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000,
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
    tokenData,
    isFetching,
    isError,
    refetch,
  };
};
