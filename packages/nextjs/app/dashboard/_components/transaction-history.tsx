import React from "react";
import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight, CirclePoundSterling, ClipboardClock, RefreshCcw, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "~~/components/ui/avatar";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Skeleton } from "~~/components/ui/skeleton";
import { useTransactionHistory } from "~~/hooks/useTransactionHistory";
import timeAgo from "~~/utils/format-time";

const TransactionHistory = () => {
  const { txs, isLoading } = useTransactionHistory({ limit: 3 });
  console.log(txs);
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        {txs.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            //onClick={clearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[200px]" />
                  <Skeleton className="h-3 w-[180px]" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-[80px] ml-auto" />
                  <Skeleton className="h-3 w-[60px] ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No transaction history</div>
        ) : (
          <div className="space-y-4">
            {txs.map((tx, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/20 transition-colors">
                <Avatar
                  className={`h-10 w-10 ${tx.status === "confirmed" ? "bg-success/10" : tx.status === "pending" ? "bg-secondary/10" : "bg-destructive/10"}`}
                >
                  <AvatarFallback
                    className={`${
                      tx.category === "received"
                        ? "bg-success/20 "
                        : tx.category === "pending"
                          ? "bg-secondary/20"
                          : tx.category === "sent"
                            ? "bg-destructive/20"
                            : tx.category === "approval"
                              ? "bg-warning/20"
                              : "bg-primary/10"
                    }`}
                  >
                    {tx.category === "received" ? (
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
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium capitalize">{tx.category}</p>
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
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="truncate">From: {tx.from}</p>
                    <p className="truncate">To: {tx.to}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold uppercase ${tx.status === "confirmed" ? "text-success" : tx.status === "failed" ? "text-destructive" : "text-foreground"}`}
                  >
                    {tx.value} {tx.category === "approval" ? tx.tokenSymbol : tx.tokenName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(tx.timeStamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
