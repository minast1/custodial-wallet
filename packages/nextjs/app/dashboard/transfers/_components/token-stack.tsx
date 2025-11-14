import React from "react";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/avatar";
import { Skeleton } from "~~/components/ui/skeleton";
import { TokenData } from "~~/hooks/tokens/useGetTokenBalances";
import { getTokenIcon } from "~~/utils/get-tokenicon";

type TProps = {
  isLoadingData: boolean;
  setToken: (symbol: string, index?: number) => void;
  selectedToken: TokenData | undefined;
  className?: string;
  tokens: TokenData[];
  index?: number;
};
const TokenStack = ({ isLoadingData, tokens, setToken, selectedToken, className, index }: TProps) => {
  return (
    <div className={clsx("grid grid-cols-4 gap-3", className)}>
      {isLoadingData
        ? // Skeleton loaders for token tiles
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border-2 border-border/50 flex flex-col items-center justify-center gap-2"
            >
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-12 h-3 rounded" />
            </div>
          ))
        : tokens?.map(t => {
            const iconUri = getTokenIcon(t.symbol);
            return (
              <button
                type="button"
                key={t.symbol}
                onClick={() => setToken(t.symbol, index)}
                className={`
                                relative p-4 rounded-xl border-2 transition-all duration-200
                                flex flex-col items-center justify-center gap-2 group
                                ${
                                  selectedToken?.symbol === t.symbol
                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                    : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                                }
                              `}
              >
                <Avatar className="rounded-large">
                  <AvatarImage src={iconUri} alt={t.symbol} />
                  <AvatarFallback
                    className={`w-6 h-6 ${selectedToken?.symbol === t.symbol ? "text-primary" : ""} transition-colors`}
                  >
                    {t.symbol}
                  </AvatarFallback>
                </Avatar>
                {/* <Avatar className={`w-6 h-6 ${token === t.symbol ? "text-primary" : t.color} transition-colors`} /> */}
                <span
                  className={`text-xs font-bold ${selectedToken?.symbol === t.symbol ? "text-primary" : "text-muted-foreground"}`}
                >
                  {t.symbol}
                </span>
                {selectedToken?.symbol === t.symbol && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-primary animate-pulse" />
                )}
              </button>
            );
          })}
    </div>
  );
};

export default TokenStack;
