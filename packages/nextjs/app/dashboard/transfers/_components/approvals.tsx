"use client";

import BatchApprovalForm from "./batch-approval-form";
import SingleApprovalForm from "./single-approval-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Address } from "viem";
import { NativeBalanceType, useGetTokenBalances } from "~~/hooks/tokens/useGetTokenBalances";
import { ApprovalSchema, createApprovalSchema } from "~~/lib/schema";

type TProps = {
  address: Address | undefined;
  nativeBalance: NativeBalanceType | undefined;
  isBatchApprovalMode: boolean;
};
const Approvals = ({ isBatchApprovalMode, nativeBalance }: TProps) => {
  const { tokenData, isLoading: isLoadingTokenData } = useGetTokenBalances(nativeBalance);
  // const [token, setToken] = useState<TokenData | undefined>();
  const tokens = tokenData.tokens.filter(t => t.symbol !== "ETH");
  const methods = useForm<ApprovalSchema>({
    resolver: zodResolver(createApprovalSchema()),
    defaultValues: {
      approvals: [],
    },
    mode: "onChange",
  });

  // const findAndSetToken = (symbol: string) => {
  //   const token = tokenData.tokens.find(t => t.symbol === symbol);
  //   if (token) {
  //     setToken(token);
  //     // reset({
  //     //   transfers: [{ address: "", amount: 0, tokenAddress: token.address, decimals: token.decimals }],
  //     // });
  //   }
  // };
  // Reset token balace after invalidation && setting default selected token
  // useEffect(() => {
  //   if (!tokenData?.tokens?.length) return;

  //   const defaultToken = tokenData.tokens.find(t => t.symbol === "ETH");

  //   if (defaultToken && !token) {
  //     setToken(defaultToken);
  //     // reset({
  //     //   transfers: [{ address: "", amount: 0, tokenAddress: defaultToken.address, decimals: defaultToken.decimals }],
  //     // });
  //     return;
  //   }
  //   if (token) {
  //     const updatedToken = tokenData.tokens.find(t => t.address === token.address);
  //     if (updatedToken && updatedToken.balance !== token.balance) {
  //       setToken(updatedToken);
  //     }
  //   }
  // }, [tokenData.tokens, token, setToken]);

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        Approve Spending {isBatchApprovalMode && "(Batch)"}
      </h3>

      {!isBatchApprovalMode ? (
        <FormProvider {...methods}>
          <SingleApprovalForm
            isLoadingTokenData={isLoadingTokenData}
            //setCurrentToken={findAndSetToken}
            // selectedToken={token}
            tokens={tokens}
          />
        </FormProvider>
      ) : (
        <FormProvider {...methods}>
          <BatchApprovalForm isLoadingTokenData={isLoadingTokenData} tokens={tokens} />
        </FormProvider>
      )}
    </div>
  );
};

export default Approvals;
