"use client";

import BatchApprovalForm from "./batch-approval-form";
import SingleApprovalForm from "./single-approval-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { ApprovalSchema, createApprovalSchema } from "~~/lib/schema";

type TProps = {
  isBatchApprovalMode: boolean;
};
const Approvals = ({ isBatchApprovalMode }: TProps) => {
  // const [token, setToken] = useState<TokenData | undefined>();

  const methods = useForm<ApprovalSchema>({
    resolver: zodResolver(createApprovalSchema()),
    defaultValues: {
      approvals: [{ spender: "", amount: 0 }],
    },
    mode: "onChange",
  });

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        Approve Spending {isBatchApprovalMode && "(Batch)"}
      </h3>

      {!isBatchApprovalMode ? (
        <FormProvider {...methods}>
          <SingleApprovalForm
          //setCurrentToken={findAndSetToken}
          // selectedToken={token}
          // tokens={tokens}
          />
        </FormProvider>
      ) : (
        <FormProvider {...methods}>
          <BatchApprovalForm />
        </FormProvider>
      )}
    </div>
  );
};

export default Approvals;
