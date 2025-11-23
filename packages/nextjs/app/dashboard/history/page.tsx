"use client";

import React, { useState } from "react";
import TransactionSkeleton from "./_components/transaction-skeleton";
import clsx from "clsx";
import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CirclePoundSterling,
  ClipboardClock,
  ExternalLink,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useTransactionHistory } from "~~/hooks/useTransactionHistory";
import timeAgo from "~~/utils/format-time";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-eth";

const HistoryPage: NextPage = () => {
  const { address } = useAccount();
  const [itemsToDisplay, setItemsToDisplay] = useState<number>(5);
  const { txs, refetch, isLoading } = useTransactionHistory({ limit: itemsToDisplay });
  const { targetNetwork } = useTargetNetwork();
  const blockExplorerAddressLink = address ? getBlockExplorerAddressLink(targetNetwork, address) : undefined;
  //console.log(txs);
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
            Transaction History
          </h1>
          <p className="text-muted-foreground">View all your past transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show:</span>
              <Select value={itemsToDisplay.toString()} onValueChange={value => setItemsToDisplay(Number(value))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: itemsToDisplay }).map((_, i) => <TransactionSkeleton key={i} />)
              : txs?.map((tx, i) => (
                  <div
                    key={i}
                    className="flex flex-col border-primary/30 bg-primary/10 sm:flex-row sm:items-center gap-4 p-4 rounded-lg hover:bg-accent/20 transition-colors border-2"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.category.includes("received")
                            ? "bg-success/10"
                            : tx.category === "sent"
                              ? "bg-destructive/10"
                              : tx.category === "approval"
                                ? "bg-warning/20"
                                : "bg-accent/50"
                        }`}
                      >
                        {tx.category.includes("received") ? (
                          <ArrowDownRight className="w-5 h-5 text-success" />
                        ) : tx.category === "pending" ? (
                          <ClipboardClock className="w-5 h-5" />
                        ) : tx.category === "sent" ? (
                          <ArrowUpRight className="w-5 h-5 text-destructive" />
                        ) : tx.category === "approval" ? (
                          <CirclePoundSterling className="w-5 h-5 text-warning" />
                        ) : (
                          <RefreshCcw className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold capitalize">
                            {tx.category.includes("received") ? "received" : tx.category}
                          </p>
                          <Badge
                            className={clsx(
                              "text-xs",
                              tx.status === "confirmed"
                                ? "bg-green-500"
                                : tx.status === "failed"
                                  ? "bg-destructive/10"
                                  : "bg-secondary/10",
                            )}
                          >
                            {tx.status === "confirmed" || tx.status === "failed" ? "completed" : "pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono truncate w-1/5">{tx.hash}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className="font-semibold">
                          {tx.category === "swap" ? `${tx.from} → ${tx.to}` : `${tx.value} ${tx.tokenSymbol}`}
                        </p>
                        {tx.usd && <p className="text-sm text-muted-foreground">{tx.usd}</p>}
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(tx.timeStamp), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">{timeAgo(tx.timeStamp)}</p>
                        </div>

                        <a
                          target="_blank"
                          href={blockExplorerAddressLink}
                          rel="noopener noreferrer"
                          className="whitespace-nowrap"
                        >
                          <ExternalLink className="h-6 w-4 ml-2 sm:ml-0" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
