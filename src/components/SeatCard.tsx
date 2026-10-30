"use client";

import React from "react";
import { shortenAddress } from "@/utils/format";
import { Armchair, User, Check, XCircle } from "lucide-react";

export interface SeatData {
  id: number;
  owner: string;
  isAvailable: boolean;
}

interface SeatCardProps {
  seat: SeatData;
  userAddress?: string;
  onSelect: (seat: SeatData) => void;
  disabled?: boolean;
}

export function SeatCard({ seat, userAddress, onSelect, disabled }: SeatCardProps) {
  const isUserOwner =
    Boolean(userAddress) &&
    seat.owner.toLowerCase() === userAddress?.toLowerCase();

  const isReserved = !seat.isAvailable;

  // Visual classes based on status
  let cardStyles = "";
  let iconColor = "";
  let badge = null;

  if (seat.isAvailable) {
    cardStyles =
      "bg-charcoal-850/80 border-charcoal-700/80 hover:border-brand-green/70 hover:bg-brand-green/5 hover:shadow-lg hover:shadow-brand-green/10 text-gray-200 cursor-pointer active:scale-95";
    iconColor = "text-brand-green/80 group-hover:text-brand-green";
    badge = (
      <span className="text-[10px] font-semibold tracking-wider text-brand-green-light bg-brand-green/10 border border-brand-green/30 px-2 py-0.5 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
        Available
      </span>
    );
  } else if (isUserOwner) {
    cardStyles =
      "bg-brand-purple/15 border-brand-purple hover:border-brand-purple-light hover:bg-brand-purple/20 shadow-md shadow-brand-purple/20 text-white cursor-pointer active:scale-95 ring-1 ring-brand-purple/50";
    iconColor = "text-brand-purple-light";
    badge = (
      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-brand-purple border border-brand-purple-light/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
        <User className="w-2.5 h-2.5" />
        Yours
      </span>
    );
  } else {
    // Reserved by someone else
    cardStyles =
      "bg-charcoal-850/40 border-brand-purple/20 text-gray-400 cursor-default opacity-85 hover:border-brand-purple/40";
    iconColor = "text-brand-purple/60";
    badge = (
      <span className="text-[10px] font-mono text-brand-purple-light/90 bg-brand-purple/10 border border-brand-purple/20 px-1.5 py-0.5 rounded-md">
        {shortenAddress(seat.owner, 3)}
      </span>
    );
  }

  return (
    <div
      onClick={() => {
        if (!disabled && (seat.isAvailable || isUserOwner)) {
          onSelect(seat);
        }
      }}
      className={`group relative rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between h-36 ${cardStyles} ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Top row: Seat Number & Status Badge */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            SEAT
          </span>
          <span className="text-base font-bold font-mono text-white">
            #{seat.id < 10 ? `0${seat.id}` : seat.id}
          </span>
        </div>
        <div>{badge}</div>
      </div>

      {/* Middle: Seat Icon */}
      <div className="flex items-center justify-center my-1">
        <Armchair
          className={`w-10 h-10 transition-transform duration-200 group-hover:scale-110 ${iconColor}`}
        />
      </div>

      {/* Bottom row: Action label or Owner text */}
      <div className="text-center text-[11px] font-medium">
        {seat.isAvailable && (
          <span className="text-gray-400 group-hover:text-brand-green-light transition-colors">
            Click to Reserve
          </span>
        )}
        {isUserOwner && (
          <span className="text-brand-purple-light flex items-center justify-center gap-1 font-semibold">
            Click to Cancel
          </span>
        )}
        {isReserved && !isUserOwner && (
          <span className="text-gray-500">
            Reserved
          </span>
        )}
      </div>
    </div>
  );
}

