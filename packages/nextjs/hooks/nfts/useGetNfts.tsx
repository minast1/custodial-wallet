import { useQuery } from "@tanstack/react-query";
import { EXPLORER_APISV3 } from "~~/utils/explorer-apis";

export interface AlchemyNft {
  contract: {
    address: string;
  };
  tokenId: string;
  tokenType: "ERC721" | "ERC1155";
  name?: string;
  description?: string;
  image?: {
    cachedUrl: string | null;
    thumbnailUrl: string | null;
    pngUrl: string | null;
    contentType: string | null;
    size: number | null;
    originalUrl: string | null;
  };
  metadata?: Record<string, any>;
}

export interface NftsResponse {
  ownedNfts: AlchemyNft[];
  totalCount: number;
  pageKey?: string;
}

export const useGetNftsByOwner = (
  owner: `0x${string}` | undefined,
  networkId: number,
  pageKey?: string,
  pageSize = 8,
) => {
  return useQuery<NftsResponse>({
    queryKey: ["nfts", owner, pageKey, pageSize],
    queryFn: async () => {
      if (!owner) throw new Error("Owner Address is required");
      const host = EXPLORER_APISV3[networkId];
      const url = new URL(`${host}/getNFTsForOwner?owner=${owner}&withMetadata=true&pageSize=${pageSize}`);
      if (pageKey) url.searchParams.set("pageKey", pageKey);

      const res = await fetch(url.toString());

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch NFTs: ${errText}`);
      }
      const json = await res.json();
      const nfts = json.ownedNfts ?? [];
      return {
        ownedNfts: nfts,
        totalCount: json.totalCount ?? 0,
        pageKey: json.pageKey,
      };
    },
    enabled: !!owner,
  });
};
