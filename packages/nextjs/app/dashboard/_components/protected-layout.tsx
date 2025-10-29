"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Loader from "./loader";
import { ArrowLeftRight, Coins, History, Image, LogOut, Menu, Moon, Settings, Sun, Wallet, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import { useDisconnect } from "wagmi";
import { Button } from "~~/components/ui/button";
import { cn } from "~~/lib/utils";

//import { useGlobalState } from "~~/services/store/store";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: Wallet },
  { name: "Tokens", path: "/tokens", icon: Coins },
  { name: "Transfers", path: "/transfers", icon: ArrowLeftRight },
  { name: "History", path: "/history", icon: History },
  { name: "NFTs", path: "/nfts", icon: Image },
  { name: "Settings", path: "/settings", icon: Settings },
];

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isConnected, status } = useAccount();
  const { disconnect } = useDisconnect();
  const cached = typeof window !== "undefined" && localStorage.getItem("isWalletConnected");
  const [isReady, setIsReady] = useState(!!cached);
  const pathname = usePathname();
  //const isConnected = useGlobalState(state => state.isConnected);
  // const setIsConnected = useGlobalState(state => state.setIsConnected);

  useEffect(() => {
    if (!isReady && !isConnected && pathname.startsWith("/dashboard")) router.replace("/");
  }, [isReady, router, isConnected, pathname]);

  // const { disconnectWallet, address } = useWallet();

  const { theme, setTheme } = useTheme();
  //const navigate = useNavigate();

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
    <div className="min-h-screen flex w-full">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col glass-card border-r">
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
              href={item.path}
              className={cn(
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium`,
                pathname.includes(item.path) ? `bg-primary text-primary-foreground shadow-lg` : `hover:bg-accent/50`,
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-glass-border space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => setTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {theme === "dark" ? "Light" : "Dark"} Mode
          </Button>
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
              <Button
                variant="outline"
                className="w-full justify-start"
                //onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                {theme === "dark" ? "Light" : "Dark"} Mode
              </Button>
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
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b glass-card flex items-center justify-between px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2 lg:ml-0 ml-auto">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-xs text-muted-foreground">Connected</p>
              <p className="text-sm font-mono font-semibold">
                {/* {address?.slice(0, 6)}...{address?.slice(-4)} */} 0xderee1324234
              </p>
            </div>
            <div className="w-4 h-4 rounded-full crypto-gradient" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
