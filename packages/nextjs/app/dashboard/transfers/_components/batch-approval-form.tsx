import React from "react";
import SpenderCard from "./spender-card";
import { Plus, ShieldCheck } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "~~/components/ui/button";
import { Label } from "~~/components/ui/label";
import { useBatchApproveAndTransfer } from "~~/hooks/transfers/useBatchApproveAndTransfer";
import { ApprovalSchema } from "~~/lib/schema";

const BatchApprovalForm = () => {
  const { executeBatch } = useBatchApproveAndTransfer();
  const { control, handleSubmit, reset } = useFormContext<ApprovalSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "approvals",
  });

  const handleBatchSubmit = (data: ApprovalSchema) => {
    // console.log(data);
    executeBatch(
      {
        approvals: data.approvals.map(t => ({
          spender: t.spender,
          amount: t.amount.toString(),
          tokenAddress: t?.tokenAddress,
          decimals: t?.decimals,
        })),
      },
      {
        onSuccess: () => {
          reset();
        },
        onError: err => {
          console.log(err);
        },
      },
    );
  };
  return (
    <form onSubmit={handleSubmit(handleBatchSubmit)}>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-base">Spenders ({fields.length})</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              spender: "",
              amount: 0,
              tokenAddress: "",
              tokenSymbol: "",
              availableBalance: 0,
              decimals: 0,
            })
          }
          className="glass-card border-2 hover:border-primary hover:bg-primary/10"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Spender
        </Button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 mb-3">
        {fields.map((spender, index) => (
          <SpenderCard
            key={spender.id}
            //tokenData={tokens}
            spenderIndex={index}
            spenders={fields.length}
            spender={spender}
            remove={remove}
          />
        ))}
      </div>

      <Button
        className="w-full h-12 crypto-gradient text-primary-foreground text-base font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
        // onClick={handleBatchApprove}
      >
        <ShieldCheck className="w-5 h-5 mr-2" />
        Approve Batch ({fields.length} Spender{fields.length !== 1 ? "s" : ""})
      </Button>
    </form>
  );
};

export default BatchApprovalForm;
