"use client";

import React from "react";
import { CheckCircle2, Bookmark, Armchair, UserCheck } from "lucide-react";

interface StatsCardProps {
  totalSeats: number;
  availableSeats: number;
  reservedSeats: number;
  userReservedCount: number;
}

export function StatsCard({
  totalSeats,
  availableSeats,
  reservedSeats,
  userReservedCount,
}: StatsCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full">
      {/* Total Seats */}
      <div className="bg-charcoal-850/70 border border-charcoal-700/60 rounded-2xl p-4 flex items-center space-x-3.5 backdrop-blur-sm shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-gray-400">
          <Armchair className="w-5 h-5 text-gray-300" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Total Seats
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-mono">
            {totalSeats}
          </p>
        </div>
      </div>

      {/* Available Seats */}
      <div className="bg-charcoal-850/70 border border-brand-green/20 rounded-2xl p-4 flex items-center space-x-3.5 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-brand-green/5 rounded-full blur-xl pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-center text-brand-green">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-brand-green-light uppercase tracking-wider">
            Available
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-mono">
            {availableSeats}
          </p>
        </div>
      </div>

      {/* Reserved Seats */}
      <div className="bg-charcoal-850/70 border border-brand-purple/20 rounded-2xl p-4 flex items-center space-x-3.5 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-brand-purple/5 rounded-full blur-xl pointer-events-none" />
        <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-brand-purple-light uppercase tracking-wider">
            Reserved
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-mono">
            {reservedSeats}
          </p>
        </div>
      </div>

      {/* Your Reservations */}
      <div className="bg-charcoal-850/70 border border-charcoal-700/60 rounded-2xl p-4 flex items-center space-x-3.5 backdrop-blur-sm shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-indigo-400">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Your Seats
          </p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 font-mono">
            {userReservedCount}
          </p>
        </div>
      </div>
    </div>
  );
}

