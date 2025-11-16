"use client";

import { useTargetNetwork } from "../scaffold-eth";
import { TokenData } from "../tokens/useGetTokenBalances";
import { useQuery } from "@tanstack/react-query";
import { erc20Abi, formatUnits } from "viem";
import { useAccount, usePublicClient } from "wagmi";

export function useAllowance(token: TokenData | undefined, spender: `0x${string}`) {
  const { targetNetwork } = useTargetNetwork();
  const client = usePublicClient({ chainId: targetNetwork.id });
  const { address: owner } = useAccount();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["allowance", spender, token],
    queryFn: async () => {
      if (!client || !owner || !token) return console.error("Client not found");
      try {
        const allowance = await client.readContract({
          address: token.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "allowance",
          args: [owner, spender],
        });

        const formattedAllowance = formatUnits(allowance, token?.decimals || 18);
        return formattedAllowance;
      } catch (error) {
        throw error;
      }
    },
    enabled: false,
  });

  return {
    allowance: data,
    isLoading,
    refetch,
    isRefetching,
  };
}
