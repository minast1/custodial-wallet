"use client";

import { useTransactor } from "../scaffold-eth";
import { useGetWalletCapabilities } from "./useGetWalletCapabilities";
import { useMutation } from "@tanstack/react-query";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { useAccount } from "wagmi";

//import { queryClient } from "~~/components/ScaffoldEthAppWithProviders";

type SingleAction = {
  approvals?: {
    tokenAddress: `0x${string}`;
    spender: `0x${string}`;
    amount: string; // human-readable
    decimals: number;
  }[];
  transfers?: {
    tokenAddress?: `0x${string}` | string; // undefined for native ETH
    to: Address;
    amount: string; // human-readable
    decimals?: number;
  }[];
};

// type SingleTxResponse = {
//   txHashes: `0x${string}`[];
// };

export const useSingleApproveAndTransfer = () => {
  const writeTX = useTransactor();
  const { walletClient } = useGetWalletCapabilities();
  const { address } = useAccount();

  const mutation = useMutation<boolean, Error, SingleAction>({
    mutationFn: async ({ approvals = [], transfers = [] }) => {
      if (!walletClient || !address) {
        throw new Error("Wallet client not connected");
      }
      const tx: {
        account: Address;
        to: Address;
        value?: bigint;
        data?: `0x${string}`;
      }[] = [];

      //Transfers
      transfers.forEach(t => {
        const isNative = t.tokenAddress === "native";
        const decimals = t.decimals ?? 18;

        if (isNative) {
          tx.push({
            account: address,
            to: t.to,
            value: parseUnits(t.amount, decimals),
          });
        } else {
          const data = encodeFunctionData({
            abi: erc20Abi,
            functionName: "transfer",
            args: [t.to, parseUnits(t.amount, decimals)],
          });
          tx.push({
            account: address,
            to: t.tokenAddress as `0x${string}`,
            data,
          });
        }
      });

      //Approvals
      approvals.forEach(a => {
        const data = encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: [a.spender, parseUnits(a.amount, a.decimals)],
        });
        tx.push({
          account: address,
          to: a.tokenAddress as `0x${string}`,
          data,
        });
      });

      const txToUse = tx.at(0);
      if (!txToUse) {
        throw new Error("No transactions to send");
      }
      await writeTX(txToUse, {
        blockConfirmations: 1,
        // onBlockConfirmation: () => {
        //   queryClient.invalidateQueries({ queryKey: ["tokenBalances", address, targetNetwork.id, nativeBalance] });
        // },
      });

      return true;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["tokenBalances", address, targetNetwork.id] });
    // },
    onError(error, variables, context) {
      console.log("error", error);
      console.log("variables", variables);
      console.log("context", context);
    },
  });

  return {
    executeSingle: mutation.mutate,
    ...mutation,
  };
};
