// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SeatPick
 * @dev Simple Web3 seat reservation smart contract for 20 seats.
 */
contract SeatPick {
    // Total number of seats available
    uint256 public constant TOTAL_SEATS = 20;

    // Mapping from seatId (1-20) to the reserver's wallet address
    // An address of address(0) indicates the seat is available
    mapping(uint256 => address) private _seatOwners;

    // Events emitted for reservation actions
    event SeatReserved(uint256 indexed seatId, address indexed reserver);
    event SeatCancelled(uint256 indexed seatId, address indexed reserver);

    // Modifier to validate seat ID range
    modifier validSeat(uint256 seatId) {
        require(seatId >= 1 && seatId <= TOTAL_SEATS, "Seat number must be between 1 and 20");
        _;
    }

    /**
     * @notice Reserves an available seat
     * @param seatId The seat number to reserve (1 to 20)
     */
    function reserveSeat(uint256 seatId) external validSeat(seatId) {
        require(_seatOwners[seatId] == address(0), "Seat is already reserved");
        
        _seatOwners[seatId] = msg.sender;
        emit SeatReserved(seatId, msg.sender);
    }

    /**
     * @notice Cancels a reservation. Only the wallet that reserved the seat can cancel it.
     * @param seatId The seat number to cancel (1 to 20)
     */
    function cancelReservation(uint256 seatId) external validSeat(seatId) {
        require(_seatOwners[seatId] == msg.sender, "Only the reservation owner can cancel this seat");
        
        delete _seatOwners[seatId];
        emit SeatCancelled(seatId, msg.sender);
    }

    /**
     * @notice Returns the wallet address that owns a reservation
     * @param seatId The seat number (1 to 20)
     * @return The wallet address of the owner, or address(0) if available
     */
    function getSeatOwner(uint256 seatId) external view validSeat(seatId) returns (address) {
        return _seatOwners[seatId];
    }

    /**
     * @notice Checks whether a seat is available
     * @param seatId The seat number (1 to 20)
     * @return True if available, false if reserved
     */
    function isSeatAvailable(uint256 seatId) external view validSeat(seatId) returns (bool) {
        return _seatOwners[seatId] == address(0);
    }

    /**
     * @notice Helper to fetch the status of all 20 seats in a single call
     * @return owners Array of 20 addresses corresponding to seats 1 through 20
     */
    function getAllSeats() external view returns (address[20] memory owners) {
        for (uint256 i = 1; i <= TOTAL_SEATS; i++) {
            owners[i - 1] = _seatOwners[i];
        }
        return owners;
    }
}

