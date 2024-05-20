// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoanContract {
  address payable public owner;

  struct Loan {
    address payable borrower;
    uint amount;
    uint startTime;
  }
  mapping(address => Loan) public loans;

  event LoanCreated(address borrower, uint amount, uint startTime);
  event LoanRepaid(address borrower, uint amount, uint interest);
  event BalanceAdded(uint amount);
  event BalanceWithdrawn(uint amount);

  constructor() {
    owner = payable(msg.sender);
  }

  function addBalance() public payable {
    require(msg.value > 0, "Balance amount must be greater than zero");
    emit BalanceAdded(msg.value);
  }

  function withdrawBalance(uint amount) public {
    require(msg.sender == owner, "Only owner can withdraw balance");
    require(address(this).balance >= amount, "Insufficient funds in contract");
    owner.transfer(amount);
    emit BalanceWithdrawn(amount);
  }

  function requestLoan(uint amount) public {
    require(loans[msg.sender].amount == 0, "Only one active loan allowed per borrower");
    require(address(this).balance >= amount, "Insufficient funds in contract");
    loans[msg.sender] = Loan(payable(msg.sender), amount, block.timestamp);
    payable(msg.sender).transfer(amount);
    emit LoanCreated(msg.sender, amount, block.timestamp);
  }

  function repayLoan() public payable {
    Loan storage borrowerLoan = loans[msg.sender];
    require(borrowerLoan.amount > 0, "No active loan found for borrower");

    uint timeElapsed = block.timestamp - borrowerLoan.startTime;
    uint interest = (borrowerLoan.amount * 15 * timeElapsed) / (365 days);

    require(msg.value >= borrowerLoan.amount + interest, "Insufficient repayment amount");

    emit BalanceAdded(msg.value);

    delete loans[msg.sender];

    emit LoanRepaid(msg.sender, borrowerLoan.amount, interest);
  }
}
