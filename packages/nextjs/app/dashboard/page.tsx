"use client";

import React from "react";
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
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your crypto portfolio</p>
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
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          {/* {activities.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearHistory}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          )} */}
        </CardHeader>
        <CardContent>
          {/* {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transaction history
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <Avatar className={`h-10 w-10 ${
                    activity.positive ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    <AvatarFallback className={`${
                      activity.positive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {activity.positive ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{activity.type}</p>
                      <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                        {activity.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="truncate">From: {activity.from}</p>
                      <p className="truncate">To: {activity.to}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${
                      activity.positive ? 'text-success' : 'text-foreground'
                    }`}>
                      {activity.amount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
