import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Loader2, Plus, Send, X } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Address } from "viem";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/avatar";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "~~/components/ui/field";
import { Input } from "~~/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~~/components/ui/input-group";
import { Label } from "~~/components/ui/label";
import { Skeleton } from "~~/components/ui/skeleton";
import { Switch } from "~~/components/ui/switch";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { NativeBalanceType, TokenData, useGetTokenBalances } from "~~/hooks/tokens/useGetTokenBalances";
import { useBatchApproveAndTransfer } from "~~/hooks/transfers/useBatchApproveAndTransfer";
import useBatchTxStatus from "~~/hooks/transfers/useBatchTxStatus";
import { useSingleApproveAndTransfer } from "~~/hooks/transfers/useSingleApproveAndTransfer";
import { createTransferSchema } from "~~/lib/schema";
import { getTokenIcon } from "~~/utils/get-tokenicon";

type TProps = {
  supportBatchTransfers: boolean;
  address: Address | undefined;
  nativeBalance: NativeBalanceType | undefined;
};

const Transfers = ({ supportBatchTransfers, address, nativeBalance }: TProps) => {
  const [isBatchTransferMode, setIsBatchTransferMode] = useState(false);
  const { executeBatch, data: batchTx } = useBatchApproveAndTransfer();
  const { executeSingle, isPending } = useSingleApproveAndTransfer();
  const { targetNetwork } = useTargetNetwork();
  const queryClient = useQueryClient();
  const { data: batchTxStatus } = useBatchTxStatus(batchTx?.id);

  useEffect(() => {
    if (batchTxStatus?.status === "success") {
      queryClient.invalidateQueries({ queryKey: ["tokenBalances", address, targetNetwork.id, nativeBalance] });
    }
  }, [address, batchTxStatus, targetNetwork.id, queryClient, nativeBalance]);

  const { tokenData, isLoading: isLoadingTokenData } = useGetTokenBalances(nativeBalance);

  const [token, setToken] = useState<TokenData | undefined>();
  const transferSchema = createTransferSchema(token?.balance || 0);
  type TransferSchema = z.infer<typeof transferSchema>;
  const handleSendTransaction = async (data: TransferSchema) => {
    if (isBatchTransferMode) {
      executeBatch(
        {
          transfers: data.transfers.map(t => ({
            address: t.address,
            amount: t.amount.toString(),
            tokenAddress: token?.address,
            decimals: token?.decimals,
          })),
        },
        {
          onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["tokenBalances", address, targetNetwork.id] });
            reset();
          },
        },
      );
    } else {
      executeSingle(
        {
          transfers: data.transfers.map(t => ({
            to: t.address,
            amount: t.amount.toString(),
            tokenAddress: token?.address,
            decimals: t.decimals,
          })),
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tokenBalances", address, targetNetwork.id, nativeBalance] });
            reset();
          },
          onError: err => {
            console.log(err);

            //reset();
          },
        },
      );
    }
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransferSchema>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transfers: [{ address: "", amount: 0, tokenAddress: token?.address, decimals: token?.decimals }],
    },
  });

  useEffect(() => {
    if (!tokenData?.tokens?.length) return;

    const defaultToken = tokenData.tokens.find(t => t.symbol === "ETH");

    if (defaultToken && !token) {
      setToken(defaultToken);
      reset({
        transfers: [{ address: "", amount: 0, tokenAddress: defaultToken.address, decimals: defaultToken.decimals }],
      });
      return;
    }
    if (token) {
      const updatedToken = tokenData.tokens.find(t => t.address === token.address);
      if (updatedToken && updatedToken.balance !== token.balance) {
        setToken(updatedToken);
      }
    }
  }, [tokenData.tokens, reset, token, setToken]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "transfers",
  });

  const findAndSetToken = (symbol: string) => {
    const token = tokenData.tokens.find(t => t.symbol === symbol);
    if (token) {
      setToken(token);
      reset({
        transfers: [{ address: "", amount: 0, tokenAddress: token.address, decimals: token.decimals }],
      });
    }
  };
  const transfers = useWatch({
    control,
    name: "transfers",
  });
  const totalAmount = transfers.reduce((acc, transfer) => acc + (transfer.amount || 0), 0) || 0;

  return (
    <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Send className="w-6 h-6" />
            </div>
            Send Tokens
          </CardTitle>
          {supportBatchTransfers && (
            <div className="flex items-center gap-2">
              <Label htmlFor="batch-transfer-toggle" className="text-sm cursor-pointer">
                Batch Mode
              </Label>
              <Switch
                id="batch-transfer-toggle"
                checked={isBatchTransferMode}
                onCheckedChange={setIsBatchTransferMode}
              />
            </div>
          )}
        </div>

        {/* Token Selection Tiles */}
        <div className="space-y-3">
          <Label className="text-base">Select Token</Label>
          <div className="grid grid-cols-4 gap-3">
            {isLoadingTokenData
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
              : tokenData.tokens?.map(t => {
                  const iconUri = getTokenIcon(t.symbol);
                  return (
                    <button
                      key={t.symbol}
                      onClick={() => findAndSetToken(t.symbol)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        flex flex-col items-center justify-center gap-2 group
                        ${
                          token?.symbol === t.symbol
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border/50 hover:border-primary/30 hover:bg-primary/5"
                        }
                      `}
                    >
                      <Avatar className="rounded-large">
                        <AvatarImage src={iconUri} alt={t.symbol} />
                        <AvatarFallback
                          className={`w-6 h-6 ${token?.symbol === t.symbol ? "text-primary" : ""} transition-colors`}
                        >
                          {t.symbol}
                        </AvatarFallback>
                      </Avatar>
                      {/* <Avatar className={`w-6 h-6 ${token === t.symbol ? "text-primary" : t.color} transition-colors`} /> */}
                      <span
                        className={`text-xs font-bold ${token?.symbol === t.symbol ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {t.symbol}
                      </span>
                      {token?.symbol === t.symbol && (
                        <div className="absolute inset-0 rounded-xl ring-2 ring-primary animate-pulse" />
                      )}
                    </button>
                  );
                })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit(handleSendTransaction)}>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {isBatchTransferMode ? (
              <div className="flex items-center justify-between">
                <Label className="text-base">Recipients ({fields.length})</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      address: "",
                      amount: 0,
                      tokenAddress: token?.address as string,
                      decimals: token?.decimals,
                    })
                  }
                  className="glass-card border-2 hover:border-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Recipient
                </Button>
              </div>
            ) : null}

            {fields.map((field, index) => (
              <FieldGroup
                key={field.id}
                className="flex flex-col gap-2 border boder-gray-300 rounded-2xl p-3 bg-gray-100"
              >
                <Field orientation="horizontal" className="flex flex-1 items-center justify-betweeen">
                  <FieldDescription className="text-sm flex-1 font-semibold text-primary">
                    {isBatchTransferMode && `Recipient #${index + 1}`}
                  </FieldDescription>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      className="p-0 hover:bg-red-500 hover:text-red-400 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </Field>

                <Field
                  className={clsx(
                    errors.transfers?.[index]?.address &&
                      " text-red-400 [&_input[type=text]]:border-red-400 [&_input[type=text]]:animate-shake",
                    "flex flex-col gap-1",
                  )}
                >
                  <FieldLabel htmlFor="single-address" className="text-sm">
                    Recipient Address
                  </FieldLabel>
                  <Input
                    type="text"
                    id={`single-address-${index}`}
                    {...register(`transfers.${index}.address` as const)}
                    placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                    className="glass-card font-mono h-10 text-sm border-2 focus-visible:border-border"
                  />
                  {errors.transfers?.[index]?.address && (
                    <FieldDescription className="text-xs text-red-500">
                      {errors.transfers?.[index]?.address?.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field
                  className={clsx(
                    errors.transfers?.[index]?.amount && " text-red-400 [&_input[type=text]]:border-red-400",
                    "flex flex-col gap-1",
                  )}
                >
                  <FieldLabel htmlFor="single-amount" className="text-sm">
                    Amount
                  </FieldLabel>
                  {/* <div className="relative"> */}
                  <InputGroup
                    className={clsx(
                      errors.transfers?.[index]?.amount && "text-red-400 border border-red-400 animate-shake",
                      "glass-card font-mono h-10 text-sm border-2",
                    )}
                  >
                    <InputGroupInput
                      placeholder="0.00"
                      id={`single-amount-${index}`}
                      //type="number"
                      {...register(`transfers.${index}.amount` as const, { valueAsNumber: true })}
                      //value={batchRecipients[0]?.amount || ""}
                    />
                    <InputGroupAddon align="inline-end" className="text-sm text-primary font-bold">
                      {" "}
                      {token?.symbol}
                    </InputGroupAddon>
                  </InputGroup>
                  {errors.transfers?.[index]?.amount && (
                    <FieldDescription className="text-xs text-red-500">
                      {errors.transfers?.[index]?.amount?.message}
                    </FieldDescription>
                  )}
                </Field>
              </FieldGroup>
            ))}
          </div>
          <div className="p-3 rounded-xl border-2 border-primary/30 bg-primary/5 my-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-lg font-bold text-primary">
                {totalAmount} {token?.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-semibold">
                {token?.balance.toFixed(4)} {token?.symbol}
              </span>
            </div>
          </div>
          <Field>
            <Button
              type="submit"
              className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              // onClick={handleSend}
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}

              {isBatchTransferMode
                ? `Send Batch Transaction (${fields.length} ${fields.length === 1 ? "Recipient" : "Recipients"})`
                : "Send Transaction"}
            </Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  );
};

export default Transfers;
