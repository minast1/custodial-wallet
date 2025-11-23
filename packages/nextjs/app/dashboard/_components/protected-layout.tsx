"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Loader from "./loader";
import {
  ArrowLeftRight,
  CirclePoundSterling,
  History,
  Image,
  Link2,
  LogOut,
  Menu,
  Settings,
  Wallet,
  X,
} from "lucide-react";
//import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import { useDisconnect } from "wagmi";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { Button } from "~~/components/ui/button";
import { cn } from "~~/lib/utils";

//import { useGlobalState } from "~~/services/store/store";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: Wallet },
  { name: "Tokens", path: "/dashboard/tokens", icon: CirclePoundSterling },
  { name: "Transfers", path: "/dashboard/transfers", icon: ArrowLeftRight },
  { name: "History", path: "/dashboard/history", icon: History },
  { name: "NFTs", path: "/dashboard/nfts", icon: Image },
  { name: "Settings", path: "/dashboard/settings", icon: Settings },
];

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, status, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const [isReady, setIsReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem("isWalletConnected");
    setIsReady(cached === "true");
  }, []);

  useEffect(() => {
    if (status !== "connecting" && pathname.startsWith("/dashboard")) {
      if (!isConnected && !isReady) router.replace("/");
    }
  }, [isReady, router, isConnected, pathname, status]);

  const handleDisconnect = () => {
    disconnect();
    //setIsConnected(false);
    localStorage.removeItem("isWalletConnected");
    setIsReady(false);
    router.push("/");
  };

  if (status === "connecting") return <Loader />;
  if (!isReady && !isConnected && pathname.startsWith("/dashboard")) return null;

  return (
    <section className="min-h-screen flex w-full">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-screen w-64 flex-col glass-card border-r overflow-y-auto">
        <div className="p-6 border-b border-glass-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg crypto-gradient flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold crypto-gradient-text">CryptoWallet</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              // prefetch={true}
              href={item.path}
              className={cn(
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium`,
                pathname === item.path ? `bg-primary text-primary-foreground shadow-lg` : `hover:bg-accent/30`,
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-glass-border space-y-2">
          <SwitchTheme className="justify-start w-full" />
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDisconnect}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Disconnect
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 glass-card border-r flex flex-col">
            <div className="p-6 border-b border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg crypto-gradient flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold crypto-gradient-text">CryptoWallet</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium`,
                    pathname.includes(item.path)
                      ? `bg-primary text-primary-foreground shadow-lg`
                      : `hover:bg-accent/50`,
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-glass-border space-y-2">
              <SwitchTheme className="w-full justify-start" />
              <Button
                variant="outline"
                className="w-full border-primary justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleDisconnect}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Disconnect
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Header */}
        <header className="h-16 border-b glass-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          {/* Chain Status Button */}
          <Button
            aria-readonly
            className="hidden md:flex h-7 hover:bg-green hover:text-white items-center gap-2 mr-auto bg-green-400 text-white"
          >
            <Link2 className="w-4 h-4" />
            <span className="text-xs font-semibold">{chain?.name}</span>
          </Button>
          <div className="flex items-center gap-2 lg:gap-3 lg:ml-auto">
            <RainbowKitCustomConnectButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </section>
  );
};

export default ProtectedLayout;
