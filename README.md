# SeatPick — Web3 Seat Reservation

> **"Pick your spot. Make it yours."**

**SeatPick** is a decentralized, single-page Web3 application built on the **Botchain Testnet**. It enables users to connect their MetaMask wallet, browse a live room of 20 reservable seats (numbered 1–20), book open spots, and manage or cancel their reservations directly on the blockchain.

---

## 🚀 Features

- **20 On-Chain Reservable Seats**: Numbered 1 to 20, recorded permanently on the blockchain.
- **Smart Contract Enforced**:
  - `reserveSeat(uint256 seatId)`: Reserving an available seat locks it to the caller's address.
  - `cancelReservation(uint256 seatId)`: Only the address that reserved a seat can cancel it.
  - `getSeatOwner(uint256 seatId)` & `isSeatAvailable(uint256 seatId)`: Direct on-chain verification.
  - Emits `SeatReserved` and `SeatCancelled` events for real-time reactivity.
- **Clean Dark Charcoal UI**:
  - Dark charcoal aesthetic with muted purple and green accents.
  - Color-coded seats: **Green** = Available, **Purple** = Reserved, **Highlighted with Badge** = Your Seat.
  - Live statistics: Total seats (20), available seats, reserved seats, and personal seats.
  - Smooth hover effects, subtle animations, and responsive layout.
- **Direct Web3 Integration**:
  - Connects with **MetaMask** using **wagmi** and **viem**.
  - Listens for smart contract events to auto-refresh seats.
  - Transaction state modals: Signature request, Block confirmation, Success, and Error states with links to BohrScan.

---

## 🌐 Network Configuration (Botchain Testnet)

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Web3 / Blockchain**: wagmi v2, viem v2, MetaMask injected provider
- **Smart Contracts**: Solidity 0.8.20, Hardhat, Ethers v6, Chai / Mocha

---

## 📦 Getting Started

### 1. Installation

Clone or open the repository in your terminal and install dependencies:

```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env.local` file in the project root (or copy from `.env.example`):

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```env
# Deployed SeatPick Smart Contract Address on Botchain Testnet
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."

# (Optional) Private key for deploying the contract using Hardhat
PRIVATE_KEY="your-private-key-with-testnet-funds"
```

---

## 📜 Smart Contract Deployment & Testing

### Compile Contract

```bash
npx hardhat compile
```

### Run Unit Tests

Execute the comprehensive automated test suite:

```bash
npx hardhat test
```

### Deploy to Botchain Testnet

1. Ensure your `PRIVATE_KEY` in `.env.local` or `.env` has testnet funds on Botchain.
2. Run the deployment script:

```bash
npm run deploy:testnet
```

3. Copy the printed contract address and set it as `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

---

## 💻 Running the Frontend

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

---

## 🔒 Security & Verification

- **No Off-Chain Intermediaries**: No database or backend server. All states are queried live from the RPC endpoint (`https://rpc.bohr.life`).
- **Owner-Only Cancellations**: Only the address matching `getSeatOwner(seatId)` is permitted to call `cancelReservation`.
- **Range Boundaries**: Seat IDs outside the 1–20 range are rejected at the contract level.

