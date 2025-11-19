import { decodeFunctionData, erc20Abi } from "viem";
import { UsePublicClientReturnType } from "wagmi";

export const customDecodeTxData = async (tx: any, client: UsePublicClientReturnType) => {
  try {
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: tx.input,
    });

    const [spender, amount] = decoded.args as [string, bigint];

    const tokenAddress = tx.to?.toLowerCase();
    if (!tokenAddress || !client) return;
    const [decimals, symbol] = await Promise.all([
      client
        .readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "decimals",
        })
        .catch(() => 18),

      client
        .readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "symbol",
        })
        .catch(() => "UNKNOWN"),
    ]);

    const formattedAmount = Number(amount) / 10 ** decimals;

    return {
      tokenAddress,
      decimals,
      symbol,
      amount: formattedAmount,
      spender,
    };
  } catch (err: any) {
    // Ignore ABI signature mismatch errors — normal for non-ERC20 calls
    if (!(err?.name === "AbiFunctionSignatureNotFoundError" || err?.message?.includes("not found"))) {
      console.warn("Unexpected decode error:", err);
    }
  }
};
