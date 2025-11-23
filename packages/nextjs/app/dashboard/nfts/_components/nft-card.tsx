/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "~~/components/ui/item";
import { AlchemyNft } from "~~/hooks/nfts/useGetNfts";

type TProps = {
  nft: AlchemyNft;
  idx: number;
};
const NftCard = ({ nft }: TProps) => {
  return (
    <Card className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all group p-0 crypto-gradient">
      <Item>
        <ItemHeader className="w-full">
          <img
            src={String(nft.image?.thumbnailUrl)}
            alt={nft.name}
            width={128}
            height={120}
            className="aspect-square w-full rounded-sm object-cover"
          />
        </ItemHeader>
        <ItemContent className="text-primary-foreground">
          <ItemTitle>
            {" "}
            <span className="truncate">{nft.name}</span>
            <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" asChild>
              <Link href={nft.image?.originalUrl ?? ""}>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </ItemTitle>
          <ItemDescription className="text-sm text-muted-foreground line-clamp-2">{nft.description}</ItemDescription>
        </ItemContent>
      </Item>
    </Card>
  );
};

export default NftCard;
