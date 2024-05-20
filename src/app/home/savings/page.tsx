"use client";
import { savingsABI } from "@/lib/abi/savingsABI";
import { savingsContractAddress } from "@/lib/const";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export default function Savings() {
  const [depositForm, setDepositForm] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [latestTransaction, setLatestTransaction] = useState<any>();
  const account = useAccount();
  const { data: currentBalance } = useReadContract({
    abi: savingsABI,
    address: savingsContractAddress,
    functionName: "getBalance",
    account: account?.address,
  });
  const { writeContract } = useWriteContract();

  const onDepositClick = () => {
    setDepositForm(!depositForm);
  };

  const onWithdrawClick = () => {
    setWithdrawForm(!withdrawForm);
  };

  const onDepositSubmit = (e: any) => {
    e.preventDefault();
    writeContract({
      abi: savingsABI,
      address: savingsContractAddress,
      functionName: "deposit",
      account: account.address,
      value: e.target[0].value,
    });
    onDepositClick();
  };

  const onWithdrawSubmit = (e: any) => {
    e.preventDefault();
    writeContract({
      abi: savingsABI,
      address: savingsContractAddress,
      functionName: "withdraw",
      account: account.address,
      args: [e.target[0].value],
    });
    onWithdrawClick();
  };

  useEffect(() => {
    fetch(
      `https://api-sepolia.etherscan.io/api?module=logs&action=getLogs&address=${savingsContractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}&page=1&offset=10&sort=asc`
    )
      .then((response) => response.json())
      .then((data) => {
        setLatestTransaction(data.result);
      });
  }, []);

  return (
    <div className="my-5 min-h-[80dvh]">
      <h1 className="text-5xl font-bold text-center">Savings Account</h1>
      <div className="my-3">
        <p className="text-center">For Account: {account.address}</p>
        <p className="text-center font-bold">
          Current Balance: {currentBalance ? currentBalance.toString() : "0"}{" "}
          Wei
        </p>
      </div>
      <div className="flex flex-row justify-center gap-x-3">
        <div className="text-center">
          <button className="btn btn-primary" onClick={onDepositClick}>
            Deposit
          </button>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={onWithdrawClick}>
            Withdraw
          </button>
        </div>
      </div>
      {depositForm && (
        <form
          className="flex justify-center my-5 gap-x-2"
          onSubmit={onDepositSubmit}
        >
          <input
            type="text"
            placeholder="x Wei"
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            Deposit
          </button>
        </form>
      )}
      {withdrawForm && (
        <form
          className="flex justify-center my-5 gap-x-2"
          onSubmit={onWithdrawSubmit}
        >
          <input
            type="text"
            placeholder="x Wei"
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            Withdraw
          </button>
        </form>
      )}
      {latestTransaction && latestTransaction.length > 0 && (
        <div className="overflow-x-auto my-5 mx-[20%]">
          <span className="text-2xl font-bold text-center">
            Latest Transactions
          </span>
          <table className="table table-xs table-pin-rows table-pin-cols">
            <thead>
              <tr>
                <th></th>
                <td>Block Hash</td>
                <td>Data</td>
                <td>Gas Price</td>
                <td>Topic</td>
                <td>Transaction Hash</td>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {latestTransaction.map((transaction: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {transaction.blockHash.slice(0, 4) +
                      "..." +
                      transaction.blockHash.slice(
                        transaction.blockHash.length - 4,
                        transaction.blockHash.length
                      )}
                  </td>
                  <td>
                    {transaction.data.slice(0, 4) +
                      "..." +
                      transaction.data.slice(
                        transaction.data.length - 4,
                        transaction.data.length
                      )}
                  </td>
                  <td>{transaction.gasPrice}</td>
                  <td>
                    {transaction.topics[0].slice(0, 4) +
                      "..." +
                      transaction.topics[0].slice(
                        transaction.topics[0].length - 4,
                        transaction.topics[0].length
                      )}
                  </td>
                  <td>
                    {transaction.transactionHash.slice(0, 4) +
                      "..." +
                      transaction.transactionHash.slice(
                        transaction.transactionHash.length - 4,
                        transaction.transactionHash.length
                      )}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <td>Block Hash</td>
                <td>Data</td>
                <td>Gas Price</td>
                <td>Topic</td>
                <td>Transaction Hash</td>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
