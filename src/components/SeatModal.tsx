"use client";

import React from "react";
import { SeatData } from "./SeatCard";
import { shortenAddress } from "@/utils/format";
import {
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Armchair,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface SeatModalProps {
  seat: SeatData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isOwner: boolean;
  isPending: boolean; // waiting for wallet signature
  isConfirming: boolean; // transaction broadcasted and confirming
  isSuccess: boolean;
  error: Error | null;
  txHash?: string;
  resetTx: () => void;
}

export function SeatModal({
  seat,
  isOpen,
  onClose,
  onConfirm,
  isOwner,
  isPending,
  isConfirming,
  isSuccess,
  error,
  txHash,
  resetTx,
}: SeatModalProps) {
  if (!isOpen || !seat) return null;

  const isProcessing = isPending || isConfirming;

  const handleClose = () => {
    if (!isProcessing) {
      resetTx();
      onClose();
    }
  };

  const actionText = isOwner ? "Cancel Reservation" : "Reserve Seat";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-charcoal-900 border border-charcoal-700 rounded-3xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle accent glow in background */}
        <div
          className={`absolute -right-16 -top-16 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
            isOwner ? "bg-brand-purple/20" : "bg-brand-green/20"
          }`}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-charcoal-800 transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center space-x-3 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isOwner
                ? "bg-brand-purple/10 border-brand-purple/30 text-brand-purple"
                : "bg-brand-green/10 border-brand-green/30 text-brand-green"
            }`}
          >
            <Armchair className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Seat #{seat.id < 10 ? `0${seat.id}` : seat.id}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                  isOwner
                    ? "bg-brand-purple/20 text-brand-purple-light border-brand-purple/40"
                    : "bg-brand-green/20 text-brand-green-light border-brand-green/40"
                }`}
              >
                {isOwner ? "Your Reservation" : "Available"}
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Botchain Mainnet (Chain ID 677)
            </p>
          </div>
        </div>

        {/* Content based on transaction state */}
        <div className="space-y-4">
          {isSuccess ? (
            <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-5 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-brand-green mx-auto" />
              <div>
                <p className="font-semibold text-white text-base">
                  {isOwner ? "Reservation Cancelled!" : "Seat Successfully Reserved!"}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  The on-chain transaction has been successfully confirmed on Botchain.
                </p>
              </div>

              {txHash && (
                <a
                  href={`https://scan.botchain.ai/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs text-brand-green-light hover:underline font-mono"
                >
                  <span>Tx: {shortenAddress(txHash, 6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                onClick={handleClose}
                className="w-full mt-2 py-2.5 px-4 bg-brand-green hover:bg-brand-green-hover text-charcoal-950 font-semibold rounded-xl text-sm transition-all"
              >
                Done
              </button>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-red-300">Transaction Failed</p>
                  <p className="text-gray-300 mt-1 break-words">
                    {error.message.includes("User rejected")
                      ? "User rejected the transaction request in MetaMask."
                      : error.message.slice(0, 150) + "..."}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetTx}
                  className="flex-1 py-2 px-3 bg-charcoal-800 hover:bg-charcoal-700 text-gray-200 text-xs font-medium rounded-xl transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="py-2 px-4 bg-charcoal-800 hover:bg-charcoal-700 text-gray-400 text-xs font-medium rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="bg-charcoal-800/80 border border-charcoal-700 rounded-2xl p-5 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-purple animate-spin mx-auto" />
              <div>
                <p className="font-semibold text-white text-sm">
                  {isPending
                    ? "Confirm in MetaMask..."
                    : "Confirming on Botchain..."}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isPending
                    ? "Please sign the transaction prompt in your wallet."
                    : "Waiting for block confirmation on Botchain Mainnet."}
                </p>
              </div>

              {txHash && (
                <a
                  href={`https://scan.botchain.ai/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-brand-purple-light hover:underline font-mono"
                >
                  <span>Tx: {shortenAddress(txHash, 6)}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-charcoal-800/60 border border-charcoal-700/60 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Selected Spot</span>
                  <span className="font-mono text-white font-semibold">
                    Seat #{seat.id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Status</span>
                  <span className="text-white capitalize">
                    {seat.isAvailable ? "Available" : "Reserved"}
                  </span>
                </div>
                {!seat.isAvailable && (
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Reserved By</span>
                    <span className="font-mono text-white font-semibold">
                      {shortenAddress(seat.owner, 4)}
                    </span>
                  </div>
                )}
                <div className="border-t border-charcoal-700/60 pt-2 flex justify-between items-center text-gray-400">
                  <span>Blockchain Fee</span>
                  <span className="text-brand-green-light font-mono">Standard Gas</span>
                </div>
              </div>

              {isOwner ? (
                <div className="flex items-start space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Cancelling will release Seat #{seat.id} immediately and make it
                    available for other users to reserve.
                  </span>
                </div>
              ) : (
                <div className="flex items-start space-x-2 bg-brand-green/10 border border-brand-green/20 rounded-xl p-3 text-xs text-brand-green-light">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Confirming will permanently link Seat #{seat.id} to your wallet address
                    on Botchain Mainnet until cancelled.
                  </span>
                </div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-sm text-gray-300 bg-charcoal-800 hover:bg-charcoal-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all transform active:scale-95 ${
                    isOwner
                      ? "bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-950/40"
                      : "bg-brand-green hover:bg-brand-green-hover text-charcoal-950 shadow-lg shadow-green-950/40"
                  }`}
                >
                  {actionText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

