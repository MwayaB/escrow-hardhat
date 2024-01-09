// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EscrowStore {
    mapping(uint256 => address) public escrows;
    uint256 public escrowCount;

    event EscrowCreated(uint256 indexed id, address indexed depositor, address escrowAddress);

    function createEscrow(address _escrow) external payable {
        escrows[escrowCount] = _escrow;
        escrowCount++;
        emit EscrowCreated(escrowCount - 1, msg.sender,  _escrow);
    }
}