# SeatPick: Decentralized Seat Reservation Protocol
**A Minimalist, On-Chain Room Booking Architecture on Botchain Mainnet**

**Author:** SeatPick Team  
**Network:** Botchain Mainnet (Chain ID: 677)  
**Contract Address:** [`0x60640a4A8C335dffF0db4C7b7BAad8419187ef99`](https://scan.botchain.ai/address/0x60640a4A8C335dffF0db4C7b7BAad8419187ef99)  
**Verified Source Code:** [BotchainScan Explorer](https://scan.botchain.ai/address/0x60640a4A8C335dffF0db4C7b7BAad8419187ef99#code)  
**GitHub Repository:** [https://github.com/liljhnxn/seatpick](https://github.com/liljhnxn/seatpick)  
**Native Token:** BOT (150 Million Total Supply)  
**Version:** 2.0.0 — November 2026

---

## 1. Executive Summary

Traditional ticketing and physical space reservation systems rely heavily on centralized databases, intermediaries, and opaque booking engines. These platforms suffer from double bookings, database downtime, hidden surcharges, non-transparent inventory, and arbitrary cancellations.

**SeatPick** introduces a decentralized, trustless solution for reserving physical and virtual spaces directly on the blockchain. Deployed natively on **Botchain Mainnet**, SeatPick eliminates off-chain backends and proprietary databases. Every reservation is verified, recorded, and enforced through an immutable Solidity smart contract, ensuring public transparency, zero double-booking, and cryptographically verified ownership.

---

## 2. Problem Statement

Modern reservation architectures present key structural vulnerabilities:

1. **Centralized Single Point of Failure**: Outages, database desynchronizations, and server bottlenecks during high-traffic drops lead to transaction failures and user frustration.
2. **Lack of Verifiable Scarcity & Inventory Manipulation**: Users have no mathematical guarantee that available seats are genuine or whether ticket brokers are withholding inventory.
3. **Double Reservations & Data Inconsistencies**: Asynchronous database writes across distributed servers often cause conflicting reservations for identical spots.
4. **Arbitrary Revocation**: Centralized coordinators possess administrative authority to alter, transfer, or cancel user bookings without consent.

---

## 3. The SeatPick Solution

SeatPick addresses these challenges by making the blockchain the single source of truth:

- **Immutable On-Chain State**: Seat ownership is stored in a public contract state mapping. Once claimed, a seat cannot be reallocated or overwritten.
- **Trustless Ownership Rights**: Only the private key corresponding to the reserver's address can initiate a cancellation (`cancelReservation`).
- **Mathematical Scarcity**: The smart contract hardcodes a strict bound of 20 seats (numbered 1–20). Requests outside this boundary are rejected at the EVM opcode level.
- **Ultra-Low Cost Overhead**: The contract deployment cost on Botchain Mainnet was only **0.0069 BOT**, guaranteeing accessible, micro-fraction gas costs for end users.
- **Direct Web3 Connectivity**: The client interface connects directly to Botchain Mainnet RPC (`https://rpc.botchain.ai`) via Viem and Wagmi, bypassing intermediary backends.

---

## 4. Technical Architecture

### 4.1 Smart Contract Layer (`SeatPick.sol`)
The contract is written in Solidity `^0.8.20` with 200 optimizer runs, verified on-chain.

```solidity
contract SeatPick {
    uint256 public constant TOTAL_SEATS = 20;
    mapping(uint256 => address) private _seatOwners;

    event SeatReserved(uint256 indexed seatId, address indexed reserver);
    event SeatCancelled(uint256 indexed seatId, address indexed reserver);

    modifier validSeat(uint256 seatId) {
        require(seatId >= 1 && seatId <= TOTAL_SEATS, "Seat number must be between 1 and 20");
        _;
    }

    function reserveSeat(uint256 seatId) external validSeat(seatId);
    function cancelReservation(uint256 seatId) external validSeat(seatId);
    function getSeatOwner(uint256 seatId) external view returns (address);
    function isSeatAvailable(uint256 seatId) external view returns (bool);
    function getAllSeats() external view returns (address[20] memory);
}
```

#### Core Invariants:
- **Zero Address Equivalence**: An unreserved seat evaluates to `address(0)`.
- **Double-Booking Prevention**: `reserveSeat` requires `_seatOwners[seatId] == address(0)`.
- **Authorized Release**: `cancelReservation` enforces `_seatOwners[seatId] == msg.sender`.

### 4.2 Frontend & Client Interaction
- **Framework**: Next.js 14 (App Router) + TypeScript.
- **Style System**: Tailwind CSS utilizing a minimal dark charcoal canvas (`#0b0c0e`) with muted purple and emerald green indicators.
- **State Synchronization**: Uses Wagmi event listeners (`useWatchContractEvent`) listening for `SeatReserved` and `SeatCancelled` events to achieve instantaneous UI state updates across concurrent users without polling.

---

## 5. Mainnet Specifications

| Parameter | Configuration |
| :--- | :--- |
| **Network** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Native Token** | BOT (150M Total Supply) |
| **Explorer** | `https://scan.botchain.ai` |
| **Contract Address** | `0x60640a4A8C335dffF0db4C7b7BAad8419187ef99` |
| **Deployment TX** | `0xbac8eedbbdb8ecb97d97575b6d8a6ee5b57c2d824715f3d1632ec33a06f00012` |
| **Gas Cost** | `0.0069088 BOT` |

---

## 6. Real-World Applications

- **Conference & Workshop Registration**: Cryptographically guaranteed workshop spots for attendees.
- **Exclusive Co-Working & Hot-Desking**: Autonomous check-in and spot allocation without human receptionists.
- **VIP Event & Gala Seating**: Transparent, tamper-proof seating allocation for decentralized communities and DAOs.
- **Gaming & Esports Tournaments**: Verifiable player stations and tournament seating brackets.

---

## 7. Roadmap

- **Phase 1 (Completed)**: Core smart contract implementation, unit testing (11/11 passing tests), initial contract verification.
- **Phase 2 (Completed)**: **Botchain Mainnet Deployment & Verification** (Chain ID 677, address `0x60640a4A8C335dffF0db4C7b7BAad8419187ef99`).
- **Phase 3 (Next)**: ERC-721 ticket integration (turning active reservations into tradable pass NFTs), dynamic multi-room layouts, time-based expiration slots.
- **Phase 4**: Native Botchain ecosystem partnership integrations.

---

## 8. Conclusion

SeatPick demonstrates how lightweight smart contracts and reactive Web3 frontends can replace monolithic, rent-seeking reservation architectures. By leveraging Botchain's high throughput and low fees, SeatPick provides users with a fast, transparent, and immutable booking experience on mainnet.
