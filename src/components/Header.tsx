"use client";

import React from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/chain";
import { shortenAddress } from "@/utils/format";
import { Wallet, LogOut, AlertTriangle, ShieldCheck } from "lucide-react";

export function Header() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== botchainTestnet.id;

  const handleConnect = () => {
    const metaMaskConnector =
      connectors.find((c) => c.id === "metaMask" || c.name.toLowerCase().includes("metamask")) ||
      connectors[0];

    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="w-full border-b border-charcoal-700 bg-charcoal-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-purple to-brand-green/80 p-[1px] flex items-center justify-center shadow-lg shadow-purple-950/40">
              <div className="w-full h-full bg-charcoal-900 rounded-[7px] flex items-center justify-center">
                <span className="text-white font-black text-lg tracking-wider">S</span>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Seat<span className="text-brand-purple-light">Pick</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-charcoal-800 text-gray-400 border border-charcoal-700">
                Web3
              </span>
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide mt-0.5">
            Pick your spot. Make it yours.
          </p>
        </div>

        {/* Wallet Connection Controls */}
        <div className="flex items-center space-x-3">
          {isConnected && isWrongNetwork && (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              disabled={isSwitching}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
            </button>
          )}

          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-brand-purple to-purple-600 hover:from-brand-purple-hover hover:to-purple-700 shadow-md shadow-purple-950/50 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 bg-charcoal-800 border border-charcoal-700/80 rounded-xl px-3 py-1.5">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isWrongNetwork ? "bg-amber-400 animate-ping" : "bg-brand-green"
                  }`}
                  title={isWrongNetwork ? "Wrong Network" : "Connected to Botchain Testnet"}
                />
                <span className="text-xs font-mono font-medium text-gray-200">
                  {shortenAddress(address)}
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-charcoal-700 transition-colors ml-1"
                title="Disconnect Wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

