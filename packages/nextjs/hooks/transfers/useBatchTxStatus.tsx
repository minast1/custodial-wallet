"use client";

import { TxnNotification, useTargetNetwork } from "../scaffold-eth";
import { useGetWalletCapabilities } from "./useGetWalletCapabilities";
import { useQuery } from "@tanstack/react-query";
import scaffoldConfig from "~~/scaffold.config";
import { AllowedChainIds, notification } from "~~/utils/scaffold-eth";
import { getParsedErrorWithAllAbis } from "~~/utils/scaffold-eth/contract";

const useBatchTxStatus = (id: string | undefined) => {
  const { walletClient } = useGetWalletCapabilities();
  const { targetNetwork } = useTargetNetwork();

  const status = useQuery({
    queryKey: ["batchTxStatus", id, targetNetwork.id],
    enabled: !!walletClient && !!id,
    // retry: false,
    // refetchIntervalInBackground: true,

    // refetchInterval: query => (query.state.data?.status === "pending" ? 1000 : false), // every second
    queryFn: async () => {
      if (!walletClient || !id) return;
      let notificationId = null;
      let transactionStatus: "success" | "pending" | "failure" | undefined;
      let chainId: number = scaffoldConfig.targetNetworks[0].id;
      try {
        notificationId = notification.loading(<TxnNotification message="Waiting for transaction to complete." />);
        const result = await walletClient.waitForCallsStatus({ id });
        transactionStatus = result.status;
        chainId = result.chainId;

        if (result.status === "success") {
          notification.remove(notificationId);
          notification.success(<TxnNotification message="Transaction completed successfully!" />, {
            icon: "🎉",
          });
        }
      } catch (error: any) {
        if (notificationId) {
          notification.remove(notificationId);
        }
        console.error("⚡️ ~ file: useTransactor.ts ~ error", error);
        const message = getParsedErrorWithAllAbis(error, chainId as AllowedChainIds);
        if (transactionStatus === "failure") {
          notification.error(<TxnNotification message={message} />);
          throw error;
        }
      }
      const response = { id, status: transactionStatus };

      return response;
    },
  });

  return status;
};

export default useBatchTxStatus;
