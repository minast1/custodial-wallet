"use client";

import React from "react";
import TransactionHistory from "./_components/transaction-history";
import { Fuel, Globe, TrendingUp } from "lucide-react";
import { type NextPage } from "next";
import { useAccount } from "wagmi";
import { Balance } from "~~/components/scaffold-eth";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { useNetworkColor, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useGetGasPrice } from "~~/hooks/useGetGasPrice";

const DashboardPage: NextPage = () => {
  const networkColor = useNetworkColor();
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { gasPrice } = useGetGasPrice();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to your Web3 Wallet</h1>
        <p className="text-muted-foreground">
          Manage your crypto assets, make transfers and track your transaction history in one place{" "}
        </p>
      </div>

      {/* Balance Card */}
      <Card className="glass-card border-2 crypto-gradient">
        <CardContent className="p-6">
          <div className="text-primary-foreground">
            <p className="text-sm opacity-90 mb-1">Total Balance</p>
            <h2 className="text-5xl font-bold mb-4">
              <Balance address={address} />
            </h2>
            <span className="text-sm opacity-75 flex gap-2">
              ≈
              <Balance address={address} usdMode={true} />
              USD
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetNetwork.name}</div>
            <span className="text-xs text-muted-foreground mt-1 flex gap-2">
              Connected
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: networkColor }} />
            </span>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(gasPrice).toFixed(1)}
              Gwei
            </div>
            {/* TODO: Add average gas price */}
            <p className="text-xs text-success mt-1">↓ 12% from average</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">24h Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$142.86</div>
            <p className="text-xs text-muted-foreground mt-1">+2.92%</p>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity */}
      <TransactionHistory />
    </div>
  );
};

export default DashboardPage;
