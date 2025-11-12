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
