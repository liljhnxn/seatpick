"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { SeatCard, SeatData } from "@/components/SeatCard";
import { SeatModal } from "@/components/SeatModal";
import { CONTRACT_ADDRESS, SEATPICK_ABI } from "@/config/contract";
import {
  RefreshCw,
  ExternalLink,
  Info,
  ShieldCheck,
  HelpCircle,
  Globe,
} from "lucide-react";
import { zeroAddress } from "viem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Read all 20 seats directly from blockchain
  const {
    data: seatOwnersData,
    refetch: refetchSeats,
    isRefetching,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SEATPICK_ABI,
    functionName: "getAllSeats",
    query: {
      refetchInterval: 10_000, // Background refresh every 10s
    },
  });

  // Watch for SeatReserved events on-chain
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: SEATPICK_ABI,
    eventName: "SeatReserved",
    onLogs() {
      refetchSeats();
    },
  });

  // Watch for SeatCancelled events on-chain
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: SEATPICK_ABI,
    eventName: "SeatCancelled",
    onLogs() {
      refetchSeats();
    },
  });

  // Write contract hook
  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for tx confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Refresh seats when transaction completes
  useEffect(() => {
    if (isConfirmed) {
      refetchSeats();
    }
  }, [isConfirmed, refetchSeats]);

  // Construct 20 seats representation
  const seats: SeatData[] = Array.from({ length: 20 }, (_, index) => {
    const seatId = index + 1;
    const owner =
      seatOwnersData && Array.isArray(seatOwnersData) && seatOwnersData[index]
        ? (seatOwnersData[index] as string)
        : zeroAddress;
    const isAvailable = !owner || owner.toLowerCase() === zeroAddress.toLowerCase();

    return {
      id: seatId,
      owner,
      isAvailable,
    };
  });

  // Calculate statistics
  const totalSeats = 20;
  const availableSeats = seats.filter((s) => s.isAvailable).length;
  const reservedSeats = totalSeats - availableSeats;
  const userReservedCount = address
    ? seats.filter(
        (s) =>
          !s.isAvailable && s.owner.toLowerCase() === address.toLowerCase()
      ).length
    : 0;

  // Handle seat click
  const handleSelectSeat = (seat: SeatData) => {
    if (!isConnected) {
      alert("Please connect your MetaMask wallet first to interact with seats.");
      return;
    }
    resetWrite();
    setSelectedSeat(seat);
    setIsModalOpen(true);
  };

  // Confirm reservation or cancellation
  const handleConfirmAction = () => {
    if (!selectedSeat) return;

    const isOwner =
      Boolean(address) &&
      selectedSeat.owner.toLowerCase() === address?.toLowerCase();

    if (isOwner) {
      // Cancel reservation
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: SEATPICK_ABI,
        functionName: "cancelReservation",
        args: [BigInt(selectedSeat.id)],
      });
    } else {
      // Reserve seat
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: SEATPICK_ABI,
        functionName: "reserveSeat",
        args: [BigInt(selectedSeat.id)],
      });
    }
  };

  const isSelectedSeatOwner =
    Boolean(address) &&
    Boolean(selectedSeat) &&
    selectedSeat?.owner.toLowerCase() === address?.toLowerCase();

  return (
    <div className="flex flex-col min-h-screen bg-charcoal-950">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Top Hero / Intro Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-xs text-gray-300 mb-3">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="w-4 h-4 rounded object-cover"
              />
              <span className="font-semibold text-white">Live on BOT Chain</span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-gray-400">Chain ID: 677</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Room Reservation
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1 max-w-xl">
              Select any open seat to record your reservation directly onto the
              blockchain. Verified and secured by immutable smart contracts.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={() => refetchSeats()}
              disabled={isRefetching}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-charcoal-850 border border-charcoal-700 hover:border-charcoal-600 text-gray-300 hover:text-white transition-all disabled:opacity-50"
              title="Refresh seat availability"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-brand-green" : ""}`}
              />
              <span>{isRefetching ? "Refreshing..." : "Refresh Status"}</span>
            </button>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-charcoal-850 hover:bg-charcoal-800 border border-charcoal-700 hover:border-brand-green/60 text-brand-green-light hover:text-white transition-all shadow-sm"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain Logo"
                className="w-4 h-4 rounded object-cover"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Statistics Component */}
        <StatsCard
          totalSeats={totalSeats}
          availableSeats={availableSeats}
          reservedSeats={reservedSeats}
          userReservedCount={userReservedCount}
        />

        {/* Legend / Key */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-charcoal-900/60 border border-charcoal-800 text-xs text-gray-400">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-brand-green/20 border border-brand-green/50 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              </span>
              <span className="text-gray-300 font-medium">Available (Green)</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-charcoal-800 border border-brand-purple/40" />
              <span className="text-gray-300 font-medium">Reserved (Purple)</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 rounded-md bg-brand-purple border border-brand-purple-light" />
              <span className="text-gray-300 font-medium">Your Seat (Highlighted)</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-mono">
            Numbered 01 — 20
          </div>
        </div>

        {/* Stage / Front of Room Indicator */}
        <div className="space-y-3">
          <div className="w-full max-w-xl mx-auto">
            <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-brand-purple/40 to-transparent" />
            <p className="text-center text-[10px] font-mono tracking-widest text-gray-500 uppercase mt-1">
              FRONT / SCREEN AREA
            </p>
          </div>

          {/* 20 Seats Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 sm:gap-4 pt-2">
            {seats.map((seat) => (
              <SeatCard
                key={seat.id}
                seat={seat}
                userAddress={address}
                onSelect={handleSelectSeat}
                disabled={isRefetching}
              />
            ))}
          </div>
        </div>

        {/* BOT Chain Ecosystem Section */}
        <section className="border border-charcoal-700/80 bg-charcoal-900/60 rounded-3xl p-6 sm:p-8 backdrop-blur-sm mt-12 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-gradient-to-br from-brand-purple/10 to-brand-green/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-charcoal-800 pb-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-charcoal-800 border border-charcoal-700 p-1 flex items-center justify-center shadow-lg shadow-black/60">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Powered by BOT Chain
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green-light border border-brand-green/30">
                    Mainnet
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Decentralized, high-throughput smart contract infrastructure for Web3 applications
                </p>
              </div>
            </div>

            {/* Official Ecosystem Links with Logo at Front */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 hover:border-gray-500 text-white transition-all shadow-sm group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-4 h-4 rounded object-cover"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 hover:border-brand-green/50 text-white transition-all shadow-sm group"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-4 h-4 rounded object-cover"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Key Architecture Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-400">
            <div className="space-y-1.5">
              <p className="font-semibold text-gray-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                Decentralized Ownership
              </p>
              <p className="leading-relaxed">
                Every seat is governed by an immutable Solidity smart contract.
                Reservations can only be cancelled by the address that made them.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-semibold text-gray-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-brand-purple-light" />
                BOT Chain Specs
              </p>
              <p className="leading-relaxed">
                Operating on RPC <span className="text-gray-300 font-mono">https://rpc.botchain.ai</span> with
                Chain ID 677. Native token BOT with 150 Million total supply.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-semibold text-gray-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Public Transparency
              </p>
              <p className="leading-relaxed">
                All reservation statuses and wallet ownerships are queried live
                from the blockchain in real-time without database intermediaries.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Confirmation & Status Modal */}
      <SeatModal
        seat={selectedSeat}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        isOwner={isSelectedSeatOwner}
        isPending={isWritePending}
        isConfirming={isConfirming}
        isSuccess={isConfirmed}
        error={(writeError || confirmError) as Error | null}
        txHash={hash}
        resetTx={() => {
          resetWrite();
        }}
      />

      {/* Footer with BOT Chain Ecosystem Links & Logo at Front */}
      <footer className="w-full border-t border-charcoal-800 py-8 mt-auto bg-charcoal-900/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-purple to-brand-green p-[1px] flex items-center justify-center">
                <div className="w-full h-full bg-charcoal-900 rounded-[5px] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
              </div>
              <span className="text-sm font-bold text-white">SeatPick</span>
              <span className="text-gray-500 text-xs">|</span>
              <span className="text-xs text-gray-400">Decentralized Seat Reservations</span>
            </div>

            {/* Ecosystem Links with BOT Chain Logo at Front */}
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 font-medium"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-3.5 h-3.5 rounded object-cover"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="text-brand-green-light hover:text-white transition-colors flex items-center gap-1.5 font-medium"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-3.5 h-3.5 rounded object-cover"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>

              <a
                href={`https://scan.botchain.ai/address/${CONTRACT_ADDRESS}#code`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-purple-light hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Contract</span>
                <ExternalLink className="w-3 h-3 text-gray-500" />
              </a>
            </div>
          </div>

          <div className="border-t border-charcoal-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
            <p>© 2026 SeatPick. Built natively on BOT Chain (Chain ID: 677).</p>
            <p className="font-mono text-[11px] text-gray-400">
              Contract: {CONTRACT_ADDRESS}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
