"use client";

//import Link from "next/link";
//import { useAccount } from "wagmi";
import { Wallet, Zap } from "lucide-react";
import type { NextPage } from "next";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 crypto-gradient opacity-10 " />

      <Card className="glass-card w-full max-w-md p-8 space-y-6 relative z-10 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full crypto-gradient mb-4">
            <Wallet className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold crypto-gradient-text">CryptoWallet</h1>
          <p className="text-muted-foreground">Connect your wallet to access your decentralized portfolio</p>
        </div>

        <div className="space-y-4">
          <Button
            // onClick={handleConnect}
            className="w-full crypto-gradient text-primary-foreground hover:opacity-90 transition-all h-12 text-lg font-semibold shadow-lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>

          <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <Zap className="h-5 w-5 text-accent" />
            <div className="text-sm">
              <p className="font-medium">Fast & Secure</p>
              <p className="text-muted-foreground text-xs">Your keys, your crypto</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          By connecting, you agree to our Terms of Service and Privacy Policy
        </div>
      </Card>
    </div>
  );
};

export default Home;
