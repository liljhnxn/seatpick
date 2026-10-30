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
import { botchainTestnet } from "@/config/chain";
import {
  Armchair,
  RefreshCw,
  ExternalLink,
  Info,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { zeroAddress } from "viem";

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isContractConfigured =
    CONTRACT_ADDRESS &&
    CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";

  // Read all 20 seats directly from blockchain
  const {
    data: seatOwnersData,
    isLoading: isLoadingSeats,
    refetch: refetchSeats,
    isRefetching,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SEATPICK_ABI,
    functionName: "getAllSeats",
    query: {
      enabled: isContractConfigured,
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
        {/* Banner if Contract Address is placeholder */}
        {!isContractConfigured && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-amber-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-white">
                Contract Address Not Configured
              </p>
              <p className="text-amber-200/90">
                Deploy the SeatPick contract to Botchain Testnet using{" "}
                <code className="bg-charcoal-850 px-1.5 py-0.5 rounded text-amber-300 font-mono">
                  npm run deploy:testnet
                </code>{" "}
                and set <code className="bg-charcoal-850 px-1.5 py-0.5 rounded text-amber-300 font-mono">NEXT_PUBLIC_CONTRACT_ADDRESS</code> in <code className="bg-charcoal-850 px-1.5 py-0.5 rounded text-amber-300 font-mono">.env.local</code>.
              </p>
            </div>
          </div>
        )}

        {/* Top Hero / Intro Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 text-xs text-gray-300 mb-3">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span>Live on Botchain Testnet</span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-gray-400">Chain ID: 968</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Room Reservation
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-1 max-w-xl">
              Select any open seat to record your reservation directly onto the
              blockchain. Verified and secured by smart contracts.
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
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-charcoal-850 border border-charcoal-700 hover:border-charcoal-600 text-gray-400 hover:text-gray-200 transition-all"
            >
              <span>Explorer</span>
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

          {/* 20 Seats Grid Layout (4 rows x 5 columns or responsive) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3.5 sm:gap-4 pt-2">
            {seats.map((seat) => (
              <SeatCard
                key={seat.id}
                seat={seat}
                userAddress={address}
                onSelect={handleSelectSeat}
                disabled={!isContractConfigured || isRefetching}
              />
            ))}
          </div>
        </div>

        {/* Bottom Help / Contract info */}
        <div className="border-t border-charcoal-800 pt-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-400">
          <div className="space-y-1.5">
            <p className="font-semibold text-gray-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              Decentralized Ownership
            </p>
            <p className="leading-relaxed">
              Every seat is enforced by an immutable Solidity smart contract.
              Reservations can only be cancelled by the address that made them.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-semibold text-gray-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-brand-purple-light" />
              Botchain Testnet
            </p>
            <p className="leading-relaxed">
              Operating on RPC <span className="text-gray-300 font-mono">https://rpc.bohr.life</span> with
              Chain ID 968. Explorer accessible at{" "}
              <a
                href="https://scan.bohr.life"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                scan.bohr.life
              </a>.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="font-semibold text-gray-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Public Transparency
            </p>
            <p className="leading-relaxed">
              All reservation statuses and wallet ownerships are read directly
              from the blockchain in real-time without database intermediaries.
            </p>
          </div>
        </div>
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

      {/* Footer */}
      <footer className="w-full border-t border-charcoal-800 py-6 mt-auto bg-charcoal-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 SeatPick. Built with Next.js, Wagmi & Solidity.</p>
          <p className="font-mono text-[11px]">
            Contract: {isContractConfigured ? CONTRACT_ADDRESS : "Not deployed"}
          </p>
        </div>
      </footer>
    </div>
  );
}

