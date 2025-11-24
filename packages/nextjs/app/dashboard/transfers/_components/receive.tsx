import React from "react";
//import { motion } from "framer-motion";
import { ArrowDownToLine } from "lucide-react";
import QRCode from "react-qr-code";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";

const Receive = () => {
  const { address } = useAccount();
  return (
    <Card className="glass-card border-2 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <ArrowDownToLine className="w-6 h-6" />
          </div>
          Receive Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <p className="text-sm text-muted-foreground">Share your wallet address to receive tokens</p> */}

        <div className="aspect-square bg-card rounded-lg flex items-center justify-center">
          {address && <QRCode value={address} size={246} style={{ height: "auto", maxWidth: "80%", width: "80%" }} />}

          {/* Animated scanning frame
          <motion.div
            initial={{ y: -210 }}
            animate={{ y: 210 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute left-0 right-0 h-[3px] bg-blue-500/70 shadow-sm"
          /> */}
        </div>

        <div className="space-y-2 flex items-center justify-center">
          <Address address={address} onlyEnsOrAddress={true} disableAddressLink={true} format="long" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Receive;
