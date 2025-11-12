"use client";

import React, { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";

const Swaps = () => {
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const handleSwap = () => {
    if (!fromAmount || !toAmount) {
      // toast.error("Please fill in all fields");
      return;
    }
    ///toast.success("Swap transaction submitted successfully");
    setFromAmount("");
    setToAmount("");
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value) {
      const rate = 2500; // Mock exchange rate
      setToAmount((parseFloat(value) * rate).toFixed(2));
    } else {
      setToAmount("");
    }
  };

  return (
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
  );
};

export default Swaps;
