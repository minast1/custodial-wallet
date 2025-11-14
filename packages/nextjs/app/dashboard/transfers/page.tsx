"use client";

import { useState } from "react";
import Approvals from "./_components/approvals";
import Swaps from "./_components/swaps";
import Transfers from "./_components/transfers";
//import BatchTxsIndicatorBadge from "./_components/batchtransactions-indicatorbadge";
import { AlertCircleIcon, Coins, DollarSign, Link2, Search, Send, ShieldCheck, Sparkles } from "lucide-react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
//import { toast } from "sonner";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Switch } from "~~/components/ui/switch";
import { useTargetNetwork, useWatchBalance } from "~~/hooks/scaffold-eth";
import { useGetWalletCapabilities } from "~~/hooks/transfers/useGetWalletCapabilities";

//import { toast } from 'sonner';

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: Coins, color: "text-purple-400" },
  { symbol: "USDC", name: "USD Coin", icon: DollarSign, color: "text-blue-400" },
  { symbol: "LINK", name: "Chainlink", icon: Link2, color: "text-cyan-400" },
  { symbol: "UNI", name: "Uniswap", icon: Sparkles, color: "text-pink-400" },
];

// interface BatchSpender {
//   id: string;
//   token: string;
//   address: string;
//   amount: string;
//   isUnlimited: boolean;
// }

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
  // Approval states
  // const [approvalToken, setApprovalToken] = useState("ETH");
  // const [approvalAddress, setApprovalAddress] = useState("");
  // const [approvalAmount, setApprovalAmount] = useState("");
  // const [isUnlimited, setIsUnlimited] = useState(false);

  // Batch approval states
  // const [batchSpenders, setBatchSpenders] = useState<BatchSpender[]>([
  //   { id: "1", token: "ETH", address: "", amount: "", isUnlimited: false },
  // ]);

  // Check allowance states
  const [checkToken, setCheckToken] = useState("ETH");
  const [checkContract, setCheckContract] = useState("");
  const [allowanceResult, setAllowanceResult] = useState<string | null>(null);

  // Approve and Send states
  const [approveAndSendToken, setApproveAndSendToken] = useState("ETH");
  const [approveAndSendSpender, setApproveAndSendSpender] = useState("");
  const [approveAndSendApprovalAmount, setApproveAndSendApprovalAmount] = useState("");
  const [approveAndSendRecipient, setApproveAndSendRecipient] = useState("");
  const [approveAndSendAmount, setApproveAndSendAmount] = useState("");

  // Mock exchange rate calculation

  // const handleApprove = () => {
  //   if (!approvalAddress || (!approvalAmount && !isUnlimited)) {
  //     //toast.error("Please fill in all fields");
  //     return;
  //   }
  //   // const amount = isUnlimited ? "unlimited" : `${approvalAmount} ${approvalToken}`;
  //   //toast.success(`Approved ${amount} spending for ${approvalAddress.slice(0, 6)}...${approvalAddress.slice(-4)}`);
  //   setApprovalAddress("");
  //   setApprovalAmount("");
  //   setIsUnlimited(false);
  // };

  const handleCheckAllowance = () => {
    if (!checkContract) {
      // toast.error("Please enter a contract address");
      return;
    }
    // Mock allowance check
    const mockAllowance = Math.random() > 0.5 ? "1000000" : "0";
    setAllowanceResult(mockAllowance);
    if (mockAllowance === "0") {
      //toast.info("No allowance found");
    } else {
      //toast.success(`Allowance found: ${mockAllowance} ${checkToken}`);
    }
  };

  // Batch approval functions
  // const addSpender = () => {
  //   setBatchSpenders([
  //     ...batchSpenders,
  //     {
  //       id: Date.now().toString(),
  //       token: "ETH",
  //       address: "",
  //       amount: "",
  //       isUnlimited: false,
  //     },
  //   ]);
  // };

  // const removeSpender = (id: string) => {
  //   if (batchSpenders.length > 1) {
  //     setBatchSpenders(batchSpenders.filter(s => s.id !== id));
  //   }
  // };

  // const updateSpender = (id: string, field: keyof BatchSpender, value: string | boolean) => {
  //   setBatchSpenders(batchSpenders.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  // };

  // const handleBatchApprove = () => {
  //   const hasEmptyFields = batchSpenders.some(s => !s.address || (!s.amount && !s.isUnlimited));
  //   if (hasEmptyFields) {
  //     //toast.error("Please fill in all spender fields");
  //     return;
  //   }
  //   //toast.success(`Batch approval for ${batchSpenders.length} spender(s) across multiple tokens submitted`);
  //   setBatchSpenders([{ id: "1", token: "ETH", address: "", amount: "", isUnlimited: false }]);
  // };

  // Approve and Send function
  const handleApproveAndSend = () => {
    if (!approveAndSendSpender || !approveAndSendRecipient || !approveAndSendAmount || !approveAndSendApprovalAmount) {
      //toast.error("Please fill in all fields");
      return;
    }
    // toast.success(
    //   `Approved ${approveAndSendApprovalAmount} ${approveAndSendToken} for ${approveAndSendSpender.slice(0, 6)}... and sent ${approveAndSendAmount} ${approveAndSendToken} to ${approveAndSendRecipient.slice(0, 6)}...`,
    // );
    setApproveAndSendSpender("");
    setApproveAndSendApprovalAmount("");
    setApproveAndSendRecipient("");
    setApproveAndSendAmount("");
  };

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
              <Approvals address={address} nativeBalance={nativeBalance} isBatchApprovalMode={isBatchApprovalMode} />

              {/* Check Allowance */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Check Allowance
                </h3>

                <div className="space-y-3">
                  <Label className="text-base">Select Token</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {tokens.map(t => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.symbol}
                          onClick={() => setCheckToken(t.symbol)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-200
                            flex flex-col items-center justify-center gap-2 group
                            ${
                              checkToken === t.symbol
                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                            }
                          `}
                        >
                          <Icon
                            className={`w-6 h-6 ${checkToken === t.symbol ? "text-primary" : t.color} transition-colors`}
                          />
                          <span
                            className={`text-xs font-bold ${checkToken === t.symbol ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {t.symbol}
                          </span>
                          {checkToken === t.symbol && (
                            <div className="absolute inset-0 rounded-xl ring-2 ring-primary animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="checkContract" className="text-base">
                    Contract/DEX Address
                  </Label>
                  <Input
                    id="checkContract"
                    placeholder="0x1234...abcd"
                    className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
                    value={checkContract}
                    onChange={e => setCheckContract(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="yourAddress" className="text-base">
                    Your Address
                  </Label>
                  <Input
                    id="yourAddress"
                    value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    className="glass-card font-mono h-12 text-base border-2 bg-muted/50"
                    readOnly
                  />
                </div>

                {allowanceResult !== null && (
                  <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Allowance</span>
                      <span className="text-lg font-bold text-primary">
                        {allowanceResult === "0" ? "None" : `${allowanceResult} ${checkToken}`}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                  onClick={handleCheckAllowance}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Check Allowance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approve and Send */}
        <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              Approve and Send
            </CardTitle>
            <p className="text-sm text-muted-foreground">Approve token spending and send tokens in one transaction</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left side - Approval */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Step 1: Approve
                </h3>

                <div className="space-y-3">
                  <Label className="text-base">Select Token</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {tokens.map(t => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.symbol}
                          onClick={() => setApproveAndSendToken(t.symbol)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-200
                            flex flex-col items-center justify-center gap-2 group
                            ${
                              approveAndSendToken === t.symbol
                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                            }
                          `}
                        >
                          <Icon
                            className={`w-6 h-6 ${approveAndSendToken === t.symbol ? "text-primary" : t.color} transition-colors`}
                          />
                          <span
                            className={`text-xs font-bold ${approveAndSendToken === t.symbol ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {t.symbol}
                          </span>
                          {approveAndSendToken === t.symbol && (
                            <div className="absolute inset-0 rounded-xl ring-2 ring-primary animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approve-send-spender">Spender Address</Label>
                  <Input
                    id="approve-send-spender"
                    placeholder="0x1234...abcd"
                    className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
                    value={approveAndSendSpender}
                    onChange={e => setApproveAndSendSpender(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approve-send-approval-amount">Approval Amount</Label>
                  <div className="relative">
                    <Input
                      id="approve-send-approval-amount"
                      type="number"
                      placeholder="0.00"
                      className="glass-card pr-20 h-12 text-lg font-semibold border-2 focus-visible:border-primary"
                      value={approveAndSendApprovalAmount}
                      onChange={e => setApproveAndSendApprovalAmount(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-primary font-bold">
                      {approveAndSendToken}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side - Send */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Step 2: Send
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="approve-send-recipient">Recipient Address</Label>
                  <Input
                    id="approve-send-recipient"
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
                    value={approveAndSendRecipient}
                    onChange={e => setApproveAndSendRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approve-send-amount">Send Amount</Label>
                  <div className="relative">
                    <Input
                      id="approve-send-amount"
                      type="number"
                      placeholder="0.00"
                      className="glass-card pr-20 h-12 text-lg font-semibold border-2 focus-visible:border-primary"
                      value={approveAndSendAmount}
                      onChange={e => setApproveAndSendAmount(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-primary font-bold">
                      {approveAndSendToken}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
                  <p className="text-sm text-muted-foreground mb-2">Transaction Summary:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Approve:</span>
                      <span className="font-semibold">
                        {approveAndSendApprovalAmount || "0"} {approveAndSendToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Send:</span>
                      <span className="font-semibold">
                        {approveAndSendAmount || "0"} {approveAndSendToken}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 mt-6 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              onClick={handleApproveAndSend}
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Approve and Send in One Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransfersPage;
