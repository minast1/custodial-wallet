import { isAddress } from "viem";
import * as z from "zod";

export const createTransferSchema = (availableBAlance: number) =>
  z.object({
    transfers: z
      .array(
        z.object({
          address: z
            .string()
            .min(1, { message: "Recipient address is required" })
            .refine(addr => isAddress(addr), {
              message: "Address provided is invalid..",
            }),
          amount: z
            .number()
            .gt(0, { message: "Amount is required" })
            .positive("Amount must be greater than zero")
            .refine(amount => amount <= availableBAlance, {
              message: "Insufficient balance",
            }),
          tokenAddress: z.string(),
          decimals: z.number().optional(),
        }),
      )
      .superRefine((transfers, ctx) => {
        const total = transfers.reduce((acc, transfer) => acc + (transfer.amount || 0), 0);
        if (total > availableBAlance) {
          ctx.addIssue({
            code: "custom",
            message: `Total transfer amount exceeds available balance of ${!Number.isInteger(availableBAlance) ? availableBAlance.toFixed(4) : availableBAlance}`,

            path: ["0", "amount"],
          });
        }
      }),
  });

export type TransferSchema = z.infer<typeof createTransferSchema>;

/**
 * Schema factory for token approvals.
 * Each approval validates against its own available balance.
 * Also checks aggregate total per token.
 */
export const createApprovalSchema = () =>
  z.object({
    approvals: z
      .array(
        z.object({
          spender: z
            .string()
            .min(1, { message: "Spender address is required" })
            .refine(addr => isAddress(addr), {
              message: "Invalid Ethereum address",
            }),
          amount: z.number().gt(0, { message: "Amount is required" }).positive("Amount must be greater than zero"),
          tokenAddress: z.string().min(1, { message: "Token address is required" }),
          tokenSymbol: z.string().min(1, { message: "Token symbol is required" }),
          availableBalance: z.number().nonnegative({ message: "Invalid available balance" }),
          decimals: z.number().optional(),
        }),
      )
      .superRefine((approvals, ctx) => {
        // 🔹 1️⃣ Validate per-approval balance
        approvals.forEach((approval, index) => {
          if (approval.amount > approval.availableBalance) {
            ctx.addIssue({
              code: "custom",
              message: `Insufficient ${approval.tokenSymbol} balance`,
              path: [index, "amount"],
            });
          }
        });

        const totals = approvals.reduce<Record<string, { symbol: string; total: number; available: number }>>(
          (acc, approval) => {
            const token = acc[approval.tokenAddress] || {
              symbol: approval.tokenSymbol,
              total: 0,
              available: approval.availableBalance,
            };
            token.total += approval.amount;
            acc[approval.tokenAddress] = token;
            return acc;
          },
          {},
        );

        Object.entries(totals).forEach(([tokenAddr, { symbol, total, available }]) => {
          if (total > available) {
            const index = approvals.findIndex(a => a.tokenAddress === tokenAddr);
            ctx.addIssue({
              code: "custom",
              message: `Total approvals for ${symbol} (${total.toFixed(
                4,
              )}) exceed available balance of ${available.toFixed(4)}.`,
              path: [index, "amount"],
            });
          }
        });
      }),
  });

export type ApprovalSchema = z.infer<ReturnType<typeof createApprovalSchema>>;

export const allowanceSchema = z.object({
  spender: z
    .string()
    .min(1, { message: "Spender address is required" })
    .refine(addr => isAddress(addr), {
      message: "Invalid Ethereum address",
    }),
  // tokenAddress: z
  //   .string()
  //   .min(1, { message: "Token address is required" })
  //   .refine(addr => isAddress(addr), {
  //     message: "Invalid Token address",
  //   }),
});

export type AllowanceSchema = z.infer<typeof allowanceSchema>;
