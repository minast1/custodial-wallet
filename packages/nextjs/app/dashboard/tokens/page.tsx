"use client";

import { useState } from "react";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { NextPage } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { useGetTokenBalances } from "~~/hooks/tokens/useGetTokenBalances";
import { getTokenIcon } from "~~/utils/get-tokenicon";

// const mockTokens = [
//   { name: "Ethereum", symbol: "ETH", balance: "2.547", value: "$4,892.36", change: "+2.92%", positive: true },
//   { name: "USD Coin", symbol: "USDC", balance: "1,250.00", value: "$1,250.00", change: "+0.01%", positive: true },
//   { name: "Chainlink", symbol: "LINK", balance: "125.40", value: "$892.85", change: "-1.24%", positive: false },
//   { name: "Uniswap", symbol: "UNI", balance: "45.20", value: "$315.40", change: "+5.67%", positive: true },
//   { name: "Aave", symbol: "AAVE", balance: "8.50", value: "$765.00", change: "+3.21%", positive: true },
// ];

const TokensPage: NextPage = () => {
  const [search, setSearch] = useState("");
  const { tokenData } = useGetTokenBalances();
  //  const [tokens, setTokens] = useState(tokenData.tokens);
  //  useEffect(() => {
  //    first

  //    return () => {
  //      second
  //    }
  //  }, [tokenData])

  const filteredTokens = tokenData.tokens.filter(
    token =>
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tokens</h1>
        <p className="text-muted-foreground">Manage your cryptocurrency portfolio</p>
      </div>

      {/* Total Value */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Token Value</p>
          <h2 className="text-4xl font-bold mb-2">{`$${tokenData?.totalUsdValue.toFixed(2)} USD`}</h2>

          {/* <div className={clsx("flex items-center gap-1", tokenData.text-success")}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+4.2% (24h)</span>
          </div> */}
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          className="pl-10 max-w-md bg-card text-card-foreground"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tokens List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Your Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTokens.map((token, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 crypto-gradient/10">
                    <AvatarImage src={getTokenIcon(token.symbol) || ""} alt={token.name} />
                    <AvatarFallback className="bg-transparent text-primary-foreground font-bold text-lg">
                      {token.symbol === "ETH" ? "Ξ" : token.symbol.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{token.name}</p>
                    <p className="text-sm text-muted-foreground">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {token.balance} {token.symbol}
                  </p>
                  <p className="text-sm text-muted-foreground">${token.usdValue?.toFixed(2)}</p>
                </div>
                <div
                  className={`flex items-center gap-1 min-w-[80px] justify-end ${
                    token.percentage_change_24h > 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {token.percentage_change_24h > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{token.percentage_change_24h.toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokensPage;
