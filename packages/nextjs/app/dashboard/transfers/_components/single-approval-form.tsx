import React, { useEffect, useState } from "react";
import TokenStack from "./token-stack";
import clsx from "clsx";
import { Loader2, ShieldCheck } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "~~/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~~/components/ui/field";
import { Input } from "~~/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~~/components/ui/input-group";
import { Label } from "~~/components/ui/label";
import { TokenData } from "~~/hooks/tokens/useGetTokenBalances";
import { useSingleApproveAndTransfer } from "~~/hooks/transfers/useSingleApproveAndTransfer";
import { ApprovalSchema } from "~~/lib/schema";

type TProps = {
  isLoadingTokenData: boolean;
  // setCurrentToken: (symbol: string) => void;

  tokens: TokenData[];
};
const SingleApprovalForm = ({ isLoadingTokenData, tokens }: TProps) => {
  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();
  const { executeSingle, isPending } = useSingleApproveAndTransfer();
  const {
    register,
    reset,
    setValue,

    handleSubmit,
    formState: { errors },
  } = useFormContext<ApprovalSchema>();

  useEffect(() => {
    setSelectedToken(tokens[0]);
    reset({
      approvals: [{ spender: "", amount: 0 }],
    });
  }, []);

  const handleTokenSelect = (symbol: string) => {
    const selected = tokens.find(t => t.symbol === symbol);
    if (!selected) return;
    setSelectedToken(selected);
    setValue(`approvals.0.tokenAddress`, selected.address);
    setValue(`approvals.0.tokenSymbol`, selected.symbol);
    setValue(`approvals.${0}.availableBalance`, selected.balance);
    setValue(`approvals.${0}.decimals`, selected.decimals);
    setValue(`approvals.${0}.availableBalance`, selected.balance);
  };

  const handleTokenApproval = async (data: ApprovalSchema) => {
    executeSingle(
      {
        approvals: data.approvals.map(a => ({
          spender: a.spender as `0x${string}`,
          amount: String(a.amount),
          tokenAddress: a.tokenAddress as `0x${string}`,
          decimals: a.decimals as number,
        })),
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: err => {
          console.log(err);

          //reset();
        },
      },
    );
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleTokenApproval)}>
      <FieldGroup className="flex flex-col gap-2 border boder-gray-300 rounded-2xl p-3 space-y-3 bg-gray-100">
        <div className="space-y-3">
          <Label className="text-base">Select Token</Label>
          <TokenStack
            isLoadingData={isLoadingTokenData}
            setToken={handleTokenSelect}
            selectedToken={selectedToken}
            tokens={tokens}
            className="mb-4"
          />
        </div>
        <Field
          className={clsx(
            errors.approvals?.[0]?.spender &&
              " text-red-400 [&_input[type=text]]:border-red-400 [&_input[type=text]]:animate-shake",
            "flex flex-col gap-1",
          )}
        >
          <FieldLabel htmlFor="single-address" className="text-base">
            Contract/DEX Address
          </FieldLabel>
          <Input
            id="approvalAddress"
            type="text"
            placeholder="0x1234...abcd"
            className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
            {...register(`approvals.${0}.spender` as const)}
          />
          {errors.approvals?.[0]?.spender && (
            <FieldDescription className="text-xs text-red-500">
              {errors.approvals?.[0]?.spender?.message}
            </FieldDescription>
          )}
        </Field>
        {/* <div className="space-y-3">
          <Label htmlFor="approvalAddress" className="text-base">
            Contract/DEX Address
          </Label>
          <Input
            id="approvalAddress"
            placeholder="0x1234...abcd"
            className="glass-card font-mono h-12 text-base border-2 focus-visible:border-primary"
            //value={approvalAddress}
            // onChange={e => setApprovalAddress(e.target.value)}
          />
        </div> */}
        <Field
          className={clsx(
            errors.approvals?.[0]?.amount && " text-red-400 [&_input[type=text]]:border-red-400",
            "flex flex-col gap-1",
          )}
        >
          <FieldLabel htmlFor="single-amount" className="text-base">
            Approval Amount
          </FieldLabel>
          {/* <div className="relative"> */}
          <InputGroup
            className={clsx(
              errors.approvals?.[0]?.amount && "text-red-400 border-red-400 animate-shake",
              "glass-card font-mono h-12 text-sm border-2",
            )}
          >
            <InputGroupInput
              placeholder="0.00"
              id={`single-amount-${0}`}
              //type="number"
              {...register(`approvals.${0}.amount` as const, { valueAsNumber: true })}
              //value={batchRecipients[0]?.amount || ""}
            />
            {selectedToken && (
              <InputGroupAddon align="inline-end" className="text-sm text-primary font-bold">
                {" "}
                {selectedToken.symbol}
              </InputGroupAddon>
            )}
          </InputGroup>
          {errors.approvals?.[0]?.amount && (
            <FieldDescription className="text-xs text-red-500">
              {errors.approvals?.[0]?.amount?.message}
            </FieldDescription>
          )}
        </Field>

        <Button
          className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
          // onClick={handleApprove}
        >
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
          Approve Spending
        </Button>
      </FieldGroup>
    </form>
  );
};

export default SingleApprovalForm;
