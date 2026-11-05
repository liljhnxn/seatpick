# SeatPick — Web3 Seat Reservation

> **"Pick your spot. Make it yours."**

**SeatPick** is a decentralized, single-page Web3 application deployed on the **Botchain Mainnet**. It enables users to connect their MetaMask wallet, browse a live room of 20 reservable seats (numbered 1–20), book open spots, and manage or cancel their reservations directly on the blockchain.

---

## 🌐 Network Configuration (Botchain Mainnet)

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Native Token** | BOT (150 Million Total Supply) |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Verified Contract** | [`0x60640a4A8C335dffF0db4C7b7BAad8419187ef99`](https://scan.botchain.ai/address/0x60640a4A8C335dffF0db4C7b7BAad8419187ef99#code) |

---

## 🚀 Features

- **20 On-Chain Reservable Seats**: Numbered 1 to 20, recorded permanently on the blockchain.
- **Smart Contract Enforced**:
  - `reserveSeat(uint256 seatId)`: Reserving an available seat locks it to the caller's address.
  - `cancelReservation(uint256 seatId)`: Only the address that reserved a seat can cancel it.
  - `getSeatOwner(uint256 seatId)` & `isSeatAvailable(uint256 seatId)`: Direct on-chain verification.
  - Emits `SeatReserved` and `SeatCancelled` events for real-time reactivity.
- **Ultra-Low Gas Consumption**: Optimized Solidity `0.8.20` contract deployment costs only ~0.0069 BOT.
- **Clean Dark Charcoal UI**:
  - Dark charcoal aesthetic with muted purple and green accents.
  - Color-coded seats: **Green** = Available, **Purple** = Reserved, **Highlighted with Badge** = Your Seat.
  - Live statistics: Total seats (20), available seats, reserved seats, and personal seats.
  - Smooth hover effects, subtle animations, and responsive layout.
- **Direct Web3 Integration**:
  - Connects with **MetaMask** using **wagmi** and **viem**.
  - Listens for smart contract events to auto-refresh seats.
  - Transaction state modals: Signature request, Block confirmation, Success, and Error states with links to BotchainScan.

---

## 📦 Getting Started

### 1. Installation

```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

Create `.env.local`:

```env
# Botchain Mainnet Verified Contract Address
NEXT_PUBLIC_CONTRACT_ADDRESS="0x60640a4A8C335dffF0db4C7b7BAad8419187ef99"
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID="677"
NEXT_PUBLIC_BOTCHAIN_RPC_URL="https://rpc.botchain.ai"
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL="https://scan.botchain.ai"
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Contract Deployment & Verification

- **Deploy to Mainnet:**
  ```bash
  npm run deploy:mainnet
  ```
- **Verify on Mainnet Explorer:**
  ```bash
  npx hardhat verify --network botchainMainnet 0x60640a4A8C335dffF0db4C7b7BAad8419187ef99
  ```
- **Run Contract Tests:**
  ```bash
  npx hardhat test
  ```
