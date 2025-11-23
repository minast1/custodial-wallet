"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NftCard from "./_components/nft-card";
import { Package, Search } from "lucide-react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader } from "~~/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~~/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~~/components/ui/pagination";
import { Skeleton } from "~~/components/ui/skeleton";
import { useGetNftsByOwner } from "~~/hooks/nfts/useGetNfts";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

const NFTPage: NextPage = () => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const [pageKey, setPageKey] = useState<string | undefined>(undefined);
  const { data, isLoading } = useGetNftsByOwner(address as `0x${string}`, targetNetwork.id, pageKey);
  // const [isLoading, setIsLoading] = useState(true);
  //const [nfts] = useState(mockNFTs);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    if (data) {
      setPageKey(data.pageKey);
    }
  }, [data]);

  const filteredNfts = useMemo(() => {
    return data?.ownedNfts && data.ownedNfts.filter(nft => nft.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  const totalPages = filteredNfts ? Math.ceil(filteredNfts?.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNfts = filteredNfts?.slice(startIndex, startIndex + itemsPerPage);

  const hasNFTs = data && data.ownedNfts.length > 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
          NFT Collection
        </h1>
        <p className="text-muted-foreground">Explore your digital collectibles</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-10 w-32 mb-2" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-9 w-12" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Collection Value</p>
                <h2 className="text-4xl font-bold">{hasNFTs ? "40.6 ETH" : "0 ETH"}</h2>
                <p className="text-sm text-muted-foreground mt-1">≈ ${hasNFTs ? "78,052.00" : "0.00"} USD</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                <h3 className="text-3xl font-bold">{data?.ownedNfts.length}</h3>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {hasNFTs && !isLoading && (
        <Card className="glass-card h-fit p-0 w-1/2">
          <InputGroup className="w-full h-10">
            <InputGroupInput
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="glass-card overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !hasNFTs ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Your NFT collection is empty. Start exploring the marketplace to add digital collectibles to your wallet.
            </p>
            <Button variant="default" asChild>
              <Link href="https://opensea.io/" target="_blank" rel="noreferrer">
                Explore NFTs
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredNfts && filteredNfts.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No NFTs match your search. Try adjusting your search terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedNfts?.map((nft, i) => <NftCard key={i} nft={nft} idx={i} />)}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default NFTPage;
