"use client";

//import { useTargetNetwork } from "../scaffold-eth";
import { useGetWalletCapabilities } from "./useGetWalletCapabilities";
import { useMutation } from "@tanstack/react-query";
import { type Address, type Hex, encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { queryClient } from "~~/components/ScaffoldEthAppWithProviders";

//import { notification } from "~~/utils/scaffold-eth";

interface TransferInput {
  address: Address;
  amount: string; // human-readable, e.g. "0.01"
  tokenAddress?: Address; // omit or zero for native ETH
  decimals?: number;
}

interface ApprovalInput {
  spender: Address;
  amount: string;
  tokenAddress: Address;
  decimals?: number;
}

interface BatchAction {
  approvals?: ApprovalInput[];
  transfers?: TransferInput[];
}

interface BatchTxResponse {
  id: string;
  chainId: number;
  calls: {
    to: Address;
    value?: bigint;
    data: Hex;
  }[];
}

// interface MutationFunctionContext {
//   client: QueryClient;
// }

export function useBatchApproveAndTransfer() {
  const { walletClient } = useGetWalletCapabilities();
  const { address } = useAccount();

  const mutation = useMutation<BatchTxResponse, Error, BatchAction>({
    mutationFn: async ({ approvals = [], transfers = [] }) => {
      if (!walletClient || !address) {
        throw new Error("Wallet client not connected");
        // notification.error("No wallet connected", { position: "top-right" });
        // return {
        //   id: "",
        //   chainId: 1,
        //   calls: [],
        // } as BatchTxResponse;
      }
      const calls: {
        to: Address;
        value?: bigint;
        data?: `0x${string}`;
      }[] = [];

      //Transfers
      transfers.forEach(t => {
        const isNative = t.tokenAddress === "native";
        const decimals = t.decimals ?? 18;

        if (isNative) {
          calls.push({
            to: t.address,
            value: parseUnits(t.amount, decimals),
          });
        } else {
          const data = encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [t.address, parseUnits(t.amount, decimals)],
          });

          calls.push({
            to: t.tokenAddress as Address,
            data,
          });
        }
      });

      //Approvals
      approvals.forEach(a => {
        const decimals = a.decimals ?? 18;

        const data = encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [a.spender, parseUnits(a.amount, decimals)],
        });

        calls.push({
          to: a.tokenAddress as Address,
          data,
        });
      });

      if (!calls.length) {
        throw new Error("No calls to execute");
        // notification.error("No calls to execute", { position: "top-right" });
        // return {
        //   id: "",
        //   chainId: 1,
        //   calls,
        // } as BatchTxResponse;
        //throw new Error("No calls to execute")
      }

      //Send atomic batch with EIP-5792
      const { id } = await walletClient.sendCalls({
        account: address,
        calls,
      });
      return { id } as BatchTxResponse;
    },
    onSuccess: ({ id, chainId }) => {
      queryClient.invalidateQueries({ queryKey: ["batachTxStatus", id, chainId] });
    },
  });

  return {
    executeBatch: mutation.mutate,
    ...mutation,
  };
}
