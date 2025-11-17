import React, { useState } from "react";
import TokenStack from "./token-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { TokenData } from "~~/hooks/tokens/useGetTokenBalances";
import { useAllowance } from "~~/hooks/transfers/useAllowance";
import { AllowanceSchema, allowanceSchema } from "~~/lib/schema";

// type TProps = {

// }
const CheckAllowance = () => {
  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();
  // const [checkContract, setCheckContract] = useState("");
  const { address } = useAccount();

  const handleTokenChange = (selected: TokenData) => {
    setSelectedToken(selected);
  };

  const {
    control,
    formState: { errors },
    watch,

    handleSubmit,
  } = useForm<AllowanceSchema>({
    resolver: zodResolver(allowanceSchema),
    defaultValues: {
      spender: "",
    },

    mode: "onChange",
  });

  const spender = watch("spender");

  const { allowance, refetch, isRefetching } = useAllowance(selectedToken, spender as `0x${string}`);
  const handleSubmitForm = () => {
    refetch();
  };
  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleSubmitForm)}>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        Check Allowance
      </h3>

      <div className="space-y-2">
        <Label className="text-base">Select Token</Label>
        <TokenStack isNativeTransfer={false} selectedToken={selectedToken} setToken={handleTokenChange} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="checkContract" className="text-base">
          Contract/Spender Address
        </Label>
        <AddressInput
          placeholder="0x1234...abcd"
          control={control}
          name="spender"
          className="glass-card font-mono h-12 text-base border focus-visible:border-primary"
        />

        {errors.spender && <p className="text-red-500 text-sm">{errors.spender.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="yourAddress" className="text-base">
          Your Address
        </Label>
        <Input
          id="yourAddress"
          value={address}
          className="glass-card font-mono h-12 text-base border-2 bg-muted/50"
          readOnly
        />
      </div>

      {allowance ? (
        <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Allowance</span>
            <span className="text-lg font-bold text-primary">
              {allowance === "0" ? "None" : `${allowance} ${selectedToken?.symbol}`}
            </span>
          </div>
        </div>
      ) : null}

      <Button className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all">
        {isRefetching ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <Search className="w-5 h-5 mr-2" />
            Check Allowance
          </>
        )}
      </Button>
    </form>
  );
};

export default CheckAllowance;
