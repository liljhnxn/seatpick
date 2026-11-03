# SeatPick: Decentralized Seat Reservation Protocol
**A Minimalist, On-Chain Room Booking Architecture on Botchain**

**Author:** SeatPick Team  
**Network:** Botchain Testnet (Chain ID: 968)  
**Contract Address:** [`0xff28b5Fe0d5e200313E69C59a1B829D15771B85B`](https://scan.bohr.life/address/0xff28b5Fe0d5e200313E69C59a1B829D15771B85B)  
**Verified Source Code:** [BohrScan Explorer](https://scan.bohr.life/address/0xff28b5Fe0d5e200313E69C59a1B829D15771B85B#code)  
**GitHub Repository:** [https://github.com/liljhnxn/seatpick](https://github.com/liljhnxn/seatpick)  
**Version:** 1.0.0 — November 2026

---

## 1. Executive Summary

Traditional ticketing and physical space reservation systems rely heavily on centralized databases, intermediaries, and opaque booking engines. These platforms suffer from double bookings, database downtime, hidden surcharges, non-transparent inventory, and arbitrary cancellations.

**SeatPick** introduces a decentralized, trustless solution for reserving physical and virtual spaces directly on the blockchain. Built natively for the **Botchain** ecosystem, SeatPick eliminates off-chain backends and proprietary databases. Every reservation is verified, recorded, and enforced through an immutable Solidity smart contract, ensuring public transparency, zero double-booking, and cryptographically verified ownership.

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
- **Direct Web3 Connectivity**: The client interface connects directly to Botchain RPC (`https://rpc.bohr.life`) via Viem and Wagmi, bypassing intermediary backends.

---

## 4. Technical Architecture

### 4.1 Smart Contract Layer (`SeatPick.sol`)
The contract is written in Solidity `^0.8.20` with 200 optimizer runs, audited via automated test suites.

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

## 5. Network Specifications

| Parameter | Configuration |
| :--- | :--- |
| **Network** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Explorer** | `https://scan.bohr.life` |
| **Contract Address** | `0xff28b5Fe0d5e200313E69C59a1B829D15771B85B` |

---

## 6. Real-World Applications

- **Conference & Workshop Registration**: Cryptographically guaranteed workshop spots for attendees.
- **Exclusive Co-Working & Hot-Desking**: Autonomous check-in and spot allocation without human receptionists.
- **VIP Event & Gala Seating**: Transparent, tamper-proof seating allocation for decentralized communities and DAOs.
- **Gaming & Esports Tournaments**: Verifiable player stations and tournament seating brackets.

---

## 7. Roadmap

- **Phase 1 (Completed)**: Core smart contract implementation, unit testing (11/11 passing tests), Botchain Testnet deployment, contract verification, responsive Next.js dApp.
- **Phase 2 (Current)**: Ecosystem integration with Botchain community, social showcase, and mobile wallet optimizations.
- **Phase 3 (Next)**: ERC-721 ticket integration (turning active reservations into tradable pass NFTs), dynamic multi-room layouts, time-based expiration slots.
- **Phase 4**: Deployment on Botchain Mainnet.

---

## 8. Conclusion

SeatPick demonstrates how lightweight smart contracts and reactive Web3 frontends can replace monolithic, rent-seeking reservation architectures. By leveraging Botchain's high throughput and low fees, SeatPick provides users with a fast, transparent, and immutable booking experience.
