import { useEffect, useState } from "react";
import { useTargetNetwork } from "./scaffold-eth";
import { formatGwei } from "viem";
import { usePublicClient } from "wagmi";

export const useGetGasPrice = () => {
  const { targetNetwork } = useTargetNetwork();
  const [gasPrice, setGasPrice] = useState<string | null>(null);
  const client = usePublicClient({ chainId: targetNetwork.id });

  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!client) return console.error("Client not found");
      try {
        const gasPrice = await client.getGasPrice();

        setGasPrice(formatGwei(gasPrice));
      } catch (error) {
        console.error("Failed to fetch gas price:", error);
      }
    };
    fetchGasPrice();
  }, [client, targetNetwork.id]);

  return { gasPrice };
};
