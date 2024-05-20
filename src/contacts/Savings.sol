// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SavingsAccount {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastTransactionTimestamp;
    uint256 public constant interestRatePerYear = 3;
    address public owner;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdrawal(address indexed withdrawer, uint256 amount);
    event InterestCredited(address indexed accountHolder, uint256 interestAmount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        lastTransactionTimestamp[msg.sender] = block.timestamp;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        uint256 interest = calculateInterest(msg.sender);
        balances[msg.sender] += interest;
        
        require(balances[msg.sender] >= amount, "Insufficient balance after interest calculation");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        lastTransactionTimestamp[msg.sender] = block.timestamp;
        emit Withdrawal(msg.sender, amount);
    }

    function calculateInterest(address account) internal view returns (uint256) {
        uint256 elapsedTime = block.timestamp - lastTransactionTimestamp[account];
        uint256 interest = (balances[account] * interestRatePerYear * elapsedTime) / (100 * 365 days);
        return interest;
    }

    function checkInterest(address account) external view returns (uint256) {
        uint256 interest = calculateInterest(account);
        return interest;
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    function withdrawInterest() external {
        uint256 interest = calculateInterest(msg.sender);
        require(interest > 0, "No interest available to withdraw");
        
        balances[msg.sender] += interest;
        lastTransactionTimestamp[msg.sender] = block.timestamp;
        emit InterestCredited(msg.sender, interest);
    }

    function transfer(address to, uint256 amount) external {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Transfer amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        lastTransactionTimestamp[msg.sender] = block.timestamp;
    }
}
