import { Address } from "viem";

export const CONTRACT_ADDRESS: Address = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as Address;

export const SEATPICK_ABI = [
  {
    inputs: [],
    name: "TOTAL_SEATS",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "seatId",
        type: "uint256",
      },
    ],
    name: "reserveSeat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "seatId",
        type: "uint256",
      },
    ],
    name: "cancelReservation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "seatId",
        type: "uint256",
      },
    ],
    name: "getSeatOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "seatId",
        type: "uint256",
      },
    ],
    name: "isSeatAvailable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllSeats",
    outputs: [
      {
        internalType: "address[20]",
        name: "owners",
        type: "address[20]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "seatId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserver",
        type: "address",
      },
    ],
    name: "SeatReserved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "seatId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserver",
        type: "address",
      },
    ],
    name: "SeatCancelled",
    type: "event",
  },
] as const;

