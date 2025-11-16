"use client";

import { useState } from "react";
import Approvals from "./_components/approvals";
import CheckAllowance from "./_components/check-allowance";
import Swaps from "./_components/swaps";
import Transfers from "./_components/transfers";
//import BatchTxsIndicatorBadge from "./_components/batchtransactions-indicatorbadge";
import { AlertCircleIcon, ShieldCheck } from "lucide-react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
//import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Label } from "~~/components/ui/label";
import { Switch } from "~~/components/ui/switch";
import { useTargetNetwork, useWatchBalance } from "~~/hooks/scaffold-eth";
import { useGetWalletCapabilities } from "~~/hooks/transfers/useGetWalletCapabilities";

const TransfersPage: NextPage = () => {
  // Batch mode toggles
  const [isBatchApprovalMode, setIsBatchApprovalMode] = useState(false);
  const { supportsAtomicActions } = useGetWalletCapabilities();
  const { targetNetwork } = useTargetNetwork();
  const { address, isConnected } = useAccount();
  const { data: nativeBalance } = useWatchBalance({
    address,
    chainId: targetNetwork.id,
    query: { enabled: !!isConnected },
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
          Transfers
        </h1>
        <p className="text-muted-foreground text-lg">Send tokens and swap assets with advanced trading features</p>
        {supportsAtomicActions && (
          <Alert className="bg-yellow-400/10 border-2 border-yellow-400">
            <AlertCircleIcon />
            <AlertTitle className="font-bold">Your EOA wallet supports Atomic Actions</AlertTitle>
            <AlertDescription>Toggle batch mode switch to enable batch transactions feature</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Send */}
        <Transfers supportBatchTransfers={supportsAtomicActions} address={address} nativeBalance={nativeBalance} />

        {/* Swap */}
        <Swaps />

        {/* Token Approvals */}
        <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  Token Approvals
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage spending permissions for smart contracts and DEXs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="batch-approval-toggle" className="text-sm cursor-pointer">
                  Batch Mode
                </Label>
                <Switch
                  id="batch-approval-toggle"
                  checked={isBatchApprovalMode}
                  onCheckedChange={setIsBatchApprovalMode}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Approve Spending */}
              <Approvals isBatchApprovalMode={isBatchApprovalMode} />

              {/* Check Allowance */}
              <CheckAllowance />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransfersPage;
