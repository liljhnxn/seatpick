# SeatPick — Pitch Deck

> **"Pick your spot. Make it yours."**  
> *A decentralized, transparent seat reservation protocol on Botchain.*

---

## Slide 1: Cover & Vision
- **Project Name:** SeatPick
- **Tagline:** Pick your spot. Make it yours.
- **Mission:** Replacing opaque, centralized reservation platforms with trustless, on-chain seat booking.
- **Network:** Botchain Testnet (Chain ID 968)
- **Live Contract:** `0xff28b5Fe0d5e200313E69C59a1B829D15771B85B`
- **GitHub:** [https://github.com/liljhnxn/seatpick](https://github.com/liljhnxn/seatpick)

---

## Slide 2: The Problem
- **Centralized Vulnerabilities:** Traditional booking engines suffer from system outages, database collisions, and double-booking during peak traffic.
- **Lack of Transparency:** Customers cannot verify actual inventory or whether middle-men are hoarding prime seats.
- **Arbitrary Cancellations:** Users lack true ownership—centralized operators can cancel or transfer spots without user approval.
- **Overcomplicated Architectures:** Heavy backend databases, auth layers, and payment bloat slow down simple reservation tasks.

---

## Slide 3: The Solution — SeatPick
- **100% On-Chain Logic:** Every reservation is immutably recorded directly on Botchain Testnet.
- **Cryptographic Ownership:** Only the wallet that reserved a seat holds the key to cancel it.
- **Guaranteed Scarcity:** Mathematically bounded 20 seats (1–20) governed by EVM smart contract logic.
- **Zero-Backend Stack:** Pure client-to-blockchain dApp—zero server downtime, zero database costs.

---

## Slide 4: Product Experience & Design
- **Dark Charcoal Minimalist UI:** Premium, distraction-free aesthetic with muted purple & emerald accents.
- **Interactive Room Layout:** Visual 20-seat interactive room displaying real-time availability.
- **Color-Coded Status:**
  - 🟢 **Available (Green):** One-click MetaMask reservation prompt.
  - 🟣 **Reserved (Purple):** Displays shortened on-chain owner address.
  - ✨ **Yours (Highlighted Badge):** Instant cancellation privilege for the reserving wallet.
- **Live On-Chain Sync:** Contract event listeners trigger real-time updates across all users without page refresh.

---

## Slide 5: Technical Stack & Validation
- **Smart Contracts:** Solidity 0.8.20, Hardhat, Ethers v6, TypeChain.
- **Quality Assurance:** 100% automated test coverage (11 unit tests covering edge cases, boundaries, and unauthorized cancellations).
- **Web3 Layer:** Viem & Wagmi v2 for injected MetaMask connectivity.
- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons.
- **Security:** Verified on [BohrScan Explorer](https://scan.bohr.life/address/0xff28b5Fe0d5e200313E69C59a1B829D15771B85B#code).

---

## Slide 6: Market & Use Cases
1. **Web3 Conferences & Hackathons:** Direct crypto-native check-in and seat claims.
2. **Autonomous Co-Working Spaces:** Decentralized hot-desk allocation without administrative overhead.
3. **VIP & Private Event Seating:** Provably fair seating for DAO governance assemblies and community galas.
4. **Esports & Gaming Lounges:** Verifiable player pod reservation on-chain.

---

## Slide 7: Roadmap
- **Q4 2026 (Completed):**
  - Smart contract architecture & 11/11 automated tests passed.
  - Contract deployed & verified on Botchain Testnet.
  - Next.js responsive dApp with real-time event updates.
- **Q1 2027 (Upcoming):**
  - NFT Pass Generation: Mint reservations as ERC-721 digital collectibles/tickets.
  - Time-locked booking slots & automated seat release timers.
  - Expansion to multiple custom rooms and auditoriums.
- **Q2 2027:**
  - Botchain Mainnet deployment and ecosystem cross-integrations.

---

## Slide 8: The Ask & Ecosystem Collaboration
- **Ecosystem Integration:** Official listing in the Botchain dApp directory.
- **Co-Marketing:** Social media amplification on Botchain X/Twitter and Discord.
- **Community Engagement:** Participation in Botchain developer AMAs and ecosystem showcases.

---

### Contact & Links
- **GitHub:** [https://github.com/liljhnxn/seatpick](https://github.com/liljhnxn/seatpick)
- **Explorer:** [https://scan.bohr.life/address/0xff28b5Fe0d5e200313E69C59a1B829D15771B85B#code](https://scan.bohr.life/address/0xff28b5Fe0d5e200313E69C59a1B829D15771B85B#code)
- **Network:** Botchain Testnet (Chain ID 968)
