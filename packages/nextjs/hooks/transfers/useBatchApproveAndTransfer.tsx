"use client";

//import { useTargetNetwork } from "../scaffold-eth";
import { TxnNotification } from "../scaffold-eth";
import { useGetWalletCapabilities } from "./useGetWalletCapabilities";
import { useMutation } from "@tanstack/react-query";
import { type Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { useAccount } from "wagmi";
//import { queryClient } from "~~/components/ScaffoldEthAppWithProviders";
import { getBlockExplorerTxLink, notification } from "~~/utils/scaffold-eth";
import { getParsedErrorWithAllAbis } from "~~/utils/scaffold-eth/contract";

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
  status: "success" | "pending" | "failure" | undefined;
  // calls: {
  //   to: Address;
  //   value?: bigint;
  //   data: Hex;
  // }[];
}

// interface MutationFunctionContext {
//   client: QueryClient;
// }

export function useBatchApproveAndTransfer() {
  const { walletClient } = useGetWalletCapabilities();
  const { address } = useAccount();

  const mutation = useMutation<BatchTxResponse, Error, BatchAction>({
    mutationFn: async ({ approvals = [], transfers = [] }) => {
      let notificationId = null;
      let blockExplorerTxURL = "";

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
      }
      try {
        //notificationId = notification.loading(<TxnNotification message="Awaiting user confirmation.." />);
        //Send atomic batch with EIP-5792
        const { id } = await walletClient.sendCalls({
          account: address,
          calls,
        });

        //notification.remove(notificationId);

        notificationId = notification.loading(<TxnNotification message="Transaction confirmation in progress" />);
        const result = await walletClient.waitForCallsStatus({ id });
        notification.remove(notificationId);

        if (result.status === "success") {
          const transactionHash = result.receipts?.at(0)?.transactionHash;
          blockExplorerTxURL = result.chainId
            ? getBlockExplorerTxLink(result.chainId, transactionHash as `0x${string}`)
            : "";
          notification.remove(notificationId);
          notification.success(
            <TxnNotification message="Transaction completed successfully!" blockExplorerLink={blockExplorerTxURL} />,
            {
              icon: "🎉",
            },
          );
        }

        if (result.status === "failure" || result.status === undefined) {
          notification.error(<TxnNotification message="Transaction failed!" blockExplorerLink={blockExplorerTxURL} />, {
            icon: "🎉",
          });
          throw new Error(result.status);
        }

        return { id, status: result.status, chainId: result.chainId };
      } catch (error: any) {
        if (notificationId) {
          notification.remove(notificationId);
        }
        console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
        const message = getParsedErrorWithAllAbis(error, 1);

        if (message.includes("No matching bundle found")) {
          notification.error(<TxnNotification message={"Transaction was rejected by user.."} />);
        } else {
          notification.error(<TxnNotification message={message} />);
        }

        throw error;
      }
    },
  });

  return {
    executeBatch: mutation.mutate,
    ...mutation,
  };
}
