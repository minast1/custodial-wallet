import React, { useState } from "react";
import TokenStack from "./token-stack";
import clsx from "clsx";
import { X } from "lucide-react";
import { FieldArrayWithId, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { AddressInput } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~~/components/ui/field";
//import { Input } from "~~/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~~/components/ui/input-group";
import { Label } from "~~/components/ui/label";
import { TokenData } from "~~/hooks/tokens/useGetTokenBalances";
import { ApprovalSchema } from "~~/lib/schema";

type TProps = {
  //tokenData: TokenData[];

  spenderIndex: number;
  spenders: number;
  spender: FieldArrayWithId<
    {
      approvals: {
        spender: string;
        amount: number;
        tokenAddress: string | undefined;
        tokenSymbol: string | undefined;
        availableBalance: number | undefined;
        decimals?: number | undefined;
      }[];
    },
    "approvals",
    "id"
  >;
  remove: UseFieldArrayRemove;
};
const SpenderCard = ({ remove, spenders, spenderIndex }: TProps) => {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ApprovalSchema>();

  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();

  const handleTokenSelect = (selected: TokenData, index?: number) => {
    setSelectedToken(selected);

    setValue(`approvals.${index!}.tokenAddress`, selected.address);
    setValue(`approvals.${index!}.tokenSymbol`, selected.symbol);
    setValue(`approvals.${index!}.availableBalance`, selected.balance);
    setValue(`approvals.${index!}.decimals`, selected.decimals);
  };

  return (
    <FieldGroup className="p-4 rounded-xl border-2 border-border/50 bg-muted/20 space-y-2">
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
          setToken={handleTokenSelect}
          selectedToken={selectedToken}
          isNativeTransfer={false}
          index={spenderIndex}
        />
      </div>

      <Field
        className={clsx(
          errors.approvals?.[spenderIndex]?.spender &&
            " text-red-400 [&_input[type=text]]:border-red-400 [&_input[type=text]]:animate-shake",
          "flex flex-col gap-1",
        )}
      >
        <FieldLabel htmlFor="single-address" className="text-base">
          Contract/DEX Address
        </FieldLabel>
        <AddressInput
          control={control}
          name={`approvals.${spenderIndex}.spender` as const}
          placeholder="0x1234...abcd"
          className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
          // {...register(`approvals.${0}.spender` as const)}
        />
        {/* <Input
          id="approvalAddress"
          type="text"
          placeholder="0x1234...abcd"
          className="glass-card font-mono h-10 text-base border-2 focus-visible:border-primary"
          {...register(`approvals.${spenderIndex}.spender` as const)}
        /> */}
        {errors.approvals?.[spenderIndex]?.spender && (
          <FieldDescription className="text-xs text-red-500">
            {errors.approvals?.[spenderIndex]?.spender?.message}
          </FieldDescription>
        )}
      </Field>

      <Field
        className={clsx(
          errors.approvals?.[spenderIndex]?.amount && " text-red-400 [&_input[type=text]]:border-red-400",
          "flex flex-col gap-1",
        )}
      >
        <FieldLabel htmlFor="single-amount" className="text-base">
          Approval Amount
        </FieldLabel>
        {/* <div className="relative"> */}
        <InputGroup
          className={clsx(
            errors.approvals?.[spenderIndex]?.amount && "text-red-400 border-red-400 animate-shake",
            "glass-card font-mono h-10 text-sm border-2",
          )}
        >
          <InputGroupInput
            placeholder="0.00"
            id={`single-amount-${spenderIndex}`}
            //type="number"
            {...register(`approvals.${spenderIndex}.amount` as const, { valueAsNumber: true })}
            //value={batchRecipients[spenderIndex]?.amount || ""}
          />
          {selectedToken && (
            <InputGroupAddon align="inline-end" className="text-sm text-primary font-bold">
              {" "}
              {selectedToken.symbol}
            </InputGroupAddon>
          )}
        </InputGroup>
        {errors.approvals?.[spenderIndex]?.amount && (
          <FieldDescription className="text-xs text-red-500">
            {errors.approvals?.[spenderIndex]?.amount?.message}
          </FieldDescription>
        )}
      </Field>
    </FieldGroup>
  );
};

export default SpenderCard;
