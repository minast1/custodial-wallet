"use client";

import { useState } from "react";
import BatchTxsIndicatorBadge from "./_components/batchtransactions-indicatorbadge";
import { ArrowLeftRight, Coins, DollarSign, Link2, Search, Send, ShieldCheck, Sparkles } from "lucide-react";
import { NextPage } from "next";
//import { toast } from "sonner";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";

const tokens = [
  { symbol: "ETH", name: "Ethereum", icon: Coins, color: "text-purple-400" },
  { symbol: "USDC", name: "USD Coin", icon: DollarSign, color: "text-blue-400" },
  { symbol: "LINK", name: "Chainlink", icon: Link2, color: "text-cyan-400" },
  { symbol: "UNI", name: "Uniswap", icon: Sparkles, color: "text-pink-400" },
];

const Transfers: NextPage = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("ETH");

  // Swap states
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // Approval states
  const [approvalToken, setApprovalToken] = useState("ETH");
  const [approvalAddress, setApprovalAddress] = useState("");
  const [approvalAmount, setApprovalAmount] = useState("");
  const [isUnlimited, setIsUnlimited] = useState(false);

  // Check allowance states
  const [checkToken, setCheckToken] = useState("ETH");
  const [checkContract, setCheckContract] = useState("");
  const [allowanceResult, setAllowanceResult] = useState<string | null>(null);

  const handleSend = () => {
    if (!recipient || !amount) {
      //toast.error("Please fill in all fields");
      return;
    }
    //toast.success("Transaction submitted successfully");
    setRecipient("");
    setAmount("");
  };

  const handleSwap = () => {
    if (!fromAmount || !toAmount) {
      // toast.error("Please fill in all fields");
      return;
    }
    // toast.success("Swap transaction submitted successfully");
    setFromAmount("");
    setToAmount("");
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  // Mock exchange rate calculation
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value) {
      const rate = 2500; // Mock exchange rate
      setToAmount((parseFloat(value) * rate).toFixed(2));
    } else {
      setToAmount("");
    }
  };

  const handleApprove = () => {
    if (!approvalAddress || (!approvalAmount && !isUnlimited)) {
      // toast.error("Please fill in all fields");
      return;
    }
    // const amount = isUnlimited ? "unlimited" : `${approvalAmount} ${approvalToken}`;
    // toast.success(`Approved ${amount} spending for ${approvalAddress.slice(0, 6)}...${approvalAddress.slice(-4)}`);
    setApprovalAddress("");
    setApprovalAmount("");
    setIsUnlimited(false);
  };

  const handleCheckAllowance = () => {
    if (!checkContract) {
      //toast.error("Please enter a contract address");
      return;
    }
    // Mock allowance check
    const mockAllowance = Math.random() > 0.5 ? "1000000" : "0";
    setAllowanceResult(mockAllowance);
    if (mockAllowance === "0") {
      // toast.info("No allowance found");
    } else {
      // toast.success(`Allowance found: ${mockAllowance} ${checkToken}`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
            Transfers
          </h1>
          <p className="text-muted-foreground text-lg">Send tokens and swap assets with advanced trading features</p>
        </div>
        <BatchTxsIndicatorBadge />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Send */}
        <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300">
          <CardHeader className="space-y-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Send className="w-6 h-6" />
              </div>
              Send Tokens
            </CardTitle>

            {/* Token Selection Tiles */}
            <div className="space-y-3">
              <Label className="text-base">Select Token</Label>
              <div className="grid grid-cols-4 gap-3">
                {tokens.map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.symbol}
                      onClick={() => setToken(t.symbol)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        flex flex-col items-center justify-center gap-2 group
                        ${
                          token === t.symbol
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                        }
                      `}
                    >
                      <Icon className={`w-6 h-6 ${token === t.symbol ? "text-primary" : t.color} transition-colors`} />
                      <span
                        className={`text-xs font-bold ${token === t.symbol ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {t.symbol}
                      </span>
                      {token === t.symbol && (
                        <div className="absolute inset-0 rounded-xl ring-2 ring-primary animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="recipient" className="text-base">
                Recipient Address
              </Label>
              <Input
                id="recipient"
                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-base">
                Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="glass-card pr-20 h-12 text-lg font-semibold border-2 focus-visible:border-primary"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-primary font-bold">
                  {token}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Available: 2.547 {token}</p>
            </div>

            <Button
              className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              onClick={handleSend}
            >
              <Send className="w-5 h-5 mr-2" />
              Send Transaction
            </Button>
          </CardContent>
        </Card>

        {/* Swap */}
        <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              Swap Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* From Token */}
            <div className="space-y-3">
              <Label htmlFor="fromToken" className="text-base">
                From
              </Label>
              <div className="p-4 rounded-xl border-2 border-border/50 bg-muted/20 space-y-3">
                <div className="flex gap-2">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="glass-card w-[140px] h-12 border-2 font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="LINK">LINK</SelectItem>
                      <SelectItem value="UNI">UNI</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Input
                      id="fromAmount"
                      type="number"
                      placeholder="0.00"
                      className="glass-card h-12 text-lg font-semibold border-2 focus-visible:border-primary"
                      value={fromAmount}
                      onChange={e => handleFromAmountChange(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Balance: 2.547 {fromToken}</p>
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center -my-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full glass-card h-12 w-12 border-2 hover:border-primary hover:bg-primary/10 transition-all hover:scale-110"
                onClick={handleSwapTokens}
              >
                <ArrowLeftRight className="w-5 h-5 rotate-90" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-3">
              <Label htmlFor="toToken" className="text-base">
                To
              </Label>
              <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3">
                <div className="flex gap-2">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="glass-card w-[140px] h-12 border-2 font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="LINK">LINK</SelectItem>
                      <SelectItem value="UNI">UNI</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Input
                      id="toAmount"
                      type="number"
                      placeholder="0.00"
                      className="glass-card h-12 text-lg font-semibold border-2"
                      value={toAmount}
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-semibold text-primary">
                    1 {fromToken} ≈ {fromToken === "ETH" ? "2500" : "0.0004"} {toToken}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              onClick={handleSwap}
            >
              <ArrowLeftRight className="w-5 h-5 mr-2" />
              Swap Tokens
            </Button>
          </CardContent>
        </Card>

        {/* Token Approvals */}
        <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              Token Approvals
            </CardTitle>
            <p className="text-sm text-muted-foreground">Manage spending permissions for smart contracts and DEXs</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Approve Spending */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  Approve Spending
                </h3>

                <div className="space-y-3">
                  <Label className="text-base">Select Token</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {tokens.map(t => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.symbol}
                          onClick={() => setApprovalToken(t.symbol)}
                          className={`
                            relative p-4 rounded-xl border-2 transition-all duration-200
                            flex flex-col items-center justify-center gap-2 group
                            ${
                              approvalToken === t.symbol
                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                            }
                          `}
                        >
                          <Icon
                            className={`w-6 h-6 ${approvalToken === t.symbol ? "text-primary" : t.color} transition-colors`}
                          />
                          <span
                            className={`text-xs font-bold ${approvalToken === t.symbol ? "text-primary" : "text-muted-foreground"}`}
                          >
                            {t.symbol}
                          </span>
                          {approvalToken === t.symbol && (
                            <div className="absolute inset-0 rounded-xl ring-2 ring-primary animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="approvalAddress" className="text-base">
                    Contract/DEX Address
                  </Label>
                  <Input
                    id="approvalAddress"
                    placeholder="0x1234...abcd"
                    className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
                    value={approvalAddress}
                    onChange={e => setApprovalAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="approvalAmount" className="text-base">
                    Approval Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="approvalAmount"
                      type="number"
                      placeholder={isUnlimited ? "Unlimited" : "0.00"}
                      className="glass-card pr-20 h-12 text-lg font-semibold border-2 focus-visible:border-primary"
                      value={approvalAmount}
                      onChange={e => setApprovalAmount(e.target.value)}
                      disabled={isUnlimited}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-primary font-bold">
                      {approvalToken}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="unlimited"
                      checked={isUnlimited}
                      onChange={e => setIsUnlimited(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-primary"
                    />
                    <Label htmlFor="unlimited" className="text-sm cursor-pointer">
                      Unlimited approval (not recommended for security)
                    </Label>
                  </div>
                </div>

                <Button
                  className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
                  onClick={handleApprove}
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Approve Spending
                </Button>
              </div>

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
      </div>
    </div>
  );
};

export default Transfers;
