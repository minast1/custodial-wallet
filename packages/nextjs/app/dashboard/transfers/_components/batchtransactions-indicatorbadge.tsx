import React from "react";
import clsx from "clsx";
import { BadgeCheckIcon, ShieldAlertIcon } from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { useGetWalletCapabilities } from "~~/hooks/transfers/useGetWalletCapabilities";

const BatchTxsIndicatorBadge = () => {
  const { supportsAtomicActions, isFetching } = useGetWalletCapabilities();
  //dont show anything if unresolved
  if (isFetching) return null;
  return (
    <Badge
      variant="default"
      className={clsx(
        supportsAtomicActions
          ? "text-white bg-green-400 border-green-300"
          : "text-white bg-destructive border-destructive",
        "h-8 w-fit",
      )}
    >
      {supportsAtomicActions ? (
        <>
          <BadgeCheckIcon />
          Batch Transactions Supported
        </>
      ) : (
        <>
          <ShieldAlertIcon />
          Batch Transactions Not Supported
        </>
      )}
    </Badge>
  );
};

export default BatchTxsIndicatorBadge;
