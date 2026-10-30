import { expect } from "chai";
import hre from "hardhat";
import { SeatPick } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("SeatPick", function () {
  let seatPick: SeatPick;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const SeatPickFactory = await ethers.getContractFactory("SeatPick");
    seatPick = (await SeatPickFactory.deploy()) as SeatPick;
    await seatPick.waitForDeployment();
  });

  describe("Initialization", function () {
    it("should have total seats constant equal to 20", async function () {
      expect(await seatPick.TOTAL_SEATS()).to.equal(20n);
    });

    it("should report all 20 seats as initially available", async function () {
      for (let i = 1; i <= 20; i++) {
        expect(await seatPick.isSeatAvailable(i)).to.be.true;
        expect(await seatPick.getSeatOwner(i)).to.equal(ethers.ZeroAddress);
      }
    });

    it("getAllSeats should return 20 zero addresses initially", async function () {
      const seats = await seatPick.getAllSeats();
      expect(seats.length).to.equal(20);
      for (const seatOwner of seats) {
        expect(seatOwner).to.equal(ethers.ZeroAddress);
      }
    });
  });

  describe("reserveSeat", function () {
    it("should allow a user to reserve an available seat and emit SeatReserved event", async function () {
      await expect(seatPick.connect(alice).reserveSeat(5))
        .to.emit(seatPick, "SeatReserved")
        .withArgs(5, alice.address);

      expect(await seatPick.isSeatAvailable(5)).to.be.false;
      expect(await seatPick.getSeatOwner(5)).to.equal(alice.address);
    });

    it("should prevent reserving an already reserved seat", async function () {
      await seatPick.connect(alice).reserveSeat(7);
      await expect(
        seatPick.connect(bob).reserveSeat(7)
      ).to.be.revertedWith("Seat is already reserved");
    });

    it("should reject invalid seat numbers", async function () {
      await expect(seatPick.connect(alice).reserveSeat(0)).to.be.revertedWith(
        "Seat number must be between 1 and 20"
      );
      await expect(seatPick.connect(alice).reserveSeat(21)).to.be.revertedWith(
        "Seat number must be between 1 and 20"
      );
    });
  });

  describe("cancelReservation", function () {
    beforeEach(async function () {
      await seatPick.connect(alice).reserveSeat(10);
    });

    it("should allow the reservation owner to cancel and emit SeatCancelled", async function () {
      await expect(seatPick.connect(alice).cancelReservation(10))
        .to.emit(seatPick, "SeatCancelled")
        .withArgs(10, alice.address);

      expect(await seatPick.isSeatAvailable(10)).to.be.true;
      expect(await seatPick.getSeatOwner(10)).to.equal(ethers.ZeroAddress);
    });

    it("should prevent a non-owner from cancelling someone else's reservation", async function () {
      await expect(
        seatPick.connect(bob).cancelReservation(10)
      ).to.be.revertedWith("Only the reservation owner can cancel this seat");
    });

    it("should prevent cancelling an unreserved seat", async function () {
      await expect(
        seatPick.connect(alice).cancelReservation(11)
      ).to.be.revertedWith("Only the reservation owner can cancel this seat");
    });

    it("should reject invalid seat numbers on cancellation", async function () {
      await expect(seatPick.connect(alice).cancelReservation(0)).to.be.revertedWith(
        "Seat number must be between 1 and 20"
      );
      await expect(seatPick.connect(alice).cancelReservation(25)).to.be.revertedWith(
        "Seat number must be between 1 and 20"
      );
    });
  });

  describe("getAllSeats after reservations", function () {
    it("should reflect reservations in getAllSeats", async function () {
      await seatPick.connect(alice).reserveSeat(1);
      await seatPick.connect(bob).reserveSeat(20);

      const seats = await seatPick.getAllSeats();
      expect(seats[0]).to.equal(alice.address);
      expect(seats[19]).to.equal(bob.address);
      expect(seats[1]).to.equal(ethers.ZeroAddress);
    });
  });
});
