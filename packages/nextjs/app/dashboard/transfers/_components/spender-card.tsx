import React, { useState } from "react";
import TokenStack from "./token-stack";
import { X } from "lucide-react";
import { FieldArrayWithId, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { TokenData } from "~~/hooks/tokens/useGetTokenBalances";

type TProps = {
  tokenData: TokenData[];
  isLoadingTokenData: boolean;
  spenderIndex: number;
  spenders: number;
  spender: FieldArrayWithId<
    {
      approvals: {
        spender: string;
        amount: number;
        tokenAddress: string;
        tokenSymbol: string;
        availableBalance: number;
        decimals?: number | undefined;
      }[];
    },
    "approvals",
    "id"
  >;
  remove: UseFieldArrayRemove;
};
const SpenderCard = ({ remove, spender, spenders, spenderIndex, isLoadingTokenData, tokenData }: TProps) => {
  const { register, setValue } = useFormContext();

  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();
  const handleTokenSelect = (symbol: string, index?: number) => {
    const selected = tokenData.find(t => t.symbol === symbol);
    if (!selected) return;
    setSelectedToken(selected);
    if (index) {
      setValue(`approvals.${index}.tokenAddress`, selected.address);
      setValue(`approvals.${index}.tokenSymbol`, selected.symbol);
      setValue(`approvals.${index}.availableBalance`, selected.balance);
      setValue(`approvals.${index}.decimals`, selected.decimals);
    }
  };
  // const findAndSetToken = (symbol: string) => {
  //   const token = tokenData.find(t => t.symbol === symbol);
  //   if (token) {
  //     setToken(token);
  //     reset({
  //       transfers: [{ address: "", amount: 0, tokenAddress: token.address, decimals: token.decimals }],
  //     });
  //   }
  // };
  return (
    <div className="p-4 rounded-xl border-2 border-border/50 bg-muted/20 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-primary">Spender #{spenderIndex + 1}</span>
        {spenders > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(spenderIndex)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Token</Label>
        <TokenStack
          className="grid grid-cols-4 gap-2"
          isLoadingData={isLoadingTokenData}
          setToken={() => handleTokenSelect}
          selectedToken={selectedToken}
          tokens={tokenData}
          index={spenderIndex}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`spender-address-${spender.id}`} className="text-sm">
          Spender Address
        </Label>
        <Input
          id={`spender-address-${spender.id}`}
          placeholder="0x1234...abcd"
          {...register(`transfers.${spenderIndex}.address` as const)}
          className="glass-card font-mono h-10 text-sm border-2 focus-visible:border-primary"
          // value={spender.address}
          // onChange={e => updateSpender(spender.id, "address", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`spender-amount-${spender.id}`} className="text-sm">
          Approval Amount
        </Label>
        <div className="relative">
          <Input
            id={`spender-amount-${spender.id}`}
            placeholder={"0.00"}
            className="glass-card pr-16 h-10 text-base font-semibold border-2 focus-visible:border-primary"
            {...register(`approvals.${spenderIndex}.amount` as const, { valueAsNumber: true })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary font-bold">
            {selectedToken?.symbol}
          </span>
        </div>
        {/* <div className="flex items-center gap-2">
                                 <input
                                   type="checkbox"
                                   id={`unlimited-${spender.id}`}
                                   checked={spender.isUnlimited}
                                   onChange={e => updateSpender(spender.id, "isUnlimited", e.target.checked)}
                                   className="w-4 h-4 rounded border-2 border-primary"
                                 />
                                 <Label htmlFor={`unlimited-${spender.id}`} className="text-xs cursor-pointer">
                                   Unlimited
                                 </Label>
                               </div> */}
      </div>
    </div>
  );
};

export default SpenderCard;
