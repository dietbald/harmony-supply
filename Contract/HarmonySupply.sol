// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.4/contracts/math/SafeMath.sol";
contract HarmonySupplier is Ownable {
    using SafeMath for uint256;

    //Only the distributor can send ONE to other addresses
    address private _distributor;
    uint256 private _donationAmount = 0.01 ether;
    uint32 private _runway = 365; //minimum number of days for available stock

    mapping(address => uint256) private lastDonation;
    //initially set to 8 hours
    uint256 private timeToNextDonation = 60 * 60 * 8;

    mapping(uint32 => uint256) public totalDonationsPerDay;

    constructor() public {
        _distributor = msg.sender;
    }

    /**
     * @dev Returns the address of the current distributor.
     */
    function distributor() public view virtual returns (address) {
        return _distributor;
    }

    /**
     * @dev Throws if called by any account other than the distributor.
     */
    modifier onlyDistributor() {
        require(distributor() == _msgSender(), "caller is not the distributor");
        _;
    }

    /**
     * @dev Change distributor of the contract to a new account (`newDistributor`).
     * Can only be called by the current owner.
     */
    function changeDistributor(address newDistributor)
        public
        virtual
        onlyOwner
    {
        require(
            newDistributor != address(0),
            "Ownable: new distributor is the zero address"
        );
        _distributor = newDistributor;
    }

    event DonationSent(address, uint256);

    function distributeTo(address payable receiver) public onlyDistributor {
        require(
            lastDonation[receiver] - timeToNextDonation > block.timestamp,
            "It is too early to ask another donation"
        );
        require(
            getRemainingDailyDistributionBalance() >= _donationAmount,
            "Total amount of available donations for today exceeded"
        );

        lastDonation[receiver] = block.timestamp;
        totalDonationsPerDay[getday()] += _donationAmount;
        receiver.transfer(_donationAmount);
        emit DonationSent(receiver, _donationAmount);
    }

    function getRemainingDailyDistributionBalance()
        public
        view
        returns (uint256)
    {
        if((address(this).balance / _runway) < totalDonationsPerDay[getday()]){ 
            return 0;   
        }
        
        return
            (address(this).balance / _runway) - totalDonationsPerDay[getday()];
    }

    function numberOfDonationsRemaining() public view returns (uint256) {
        return getRemainingDailyDistributionBalance() / _donationAmount;
    }

    function getday() public view returns (uint32) {
        return uint32(block.timestamp / (60 * 60 * 24));
    }

    event ReceivedDonation(address, uint256);

    receive() external payable {
        emit ReceivedDonation(msg.sender, msg.value);
    }

    function changeDonationAmount(uint256 newAmount) public onlyOwner {
        _donationAmount = newAmount;
    }

    function changeTimeToNextDonation(uint256 newTime) public onlyOwner {
        timeToNextDonation = newTime;
    }

    function changeRunway(uint32 newRunway) public onlyOwner {
        _runway = newRunway;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFunds() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
