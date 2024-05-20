"use client";

import { lendingABI } from "@/lib/abi/lendingABI";
import { lendingContractAddress } from "@/lib/const";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConfig,
  useReadContract,
  useWriteContract,
} from "wagmi";

export default function Loan() {
  const [applyForm, setApplyForm] = useState<boolean>(false);
  const [repayForm, setRepayForm] = useState<boolean>(false);
  const [withdrawForm, setWithdrawForm] = useState<boolean>(false);
  const [addFundsForm, setAddFundsForm] = useState<boolean>(false);
  const [latestTransaction, setLatestTransaction] = useState<any>();
  const account = useAccount();
  const config = useConfig();
  const { data: outstandingLoan }: { data: any } = useReadContract({
    abi: lendingABI,
    address: lendingContractAddress,
    functionName: "loans",
    account: account?.address,
    args: [account?.address],
  });
  const { data: contractOwner }: { data: any } = useReadContract({
    abi: lendingABI,
    address: lendingContractAddress,
    functionName: "owner",
    account: account?.address,
  });
  const { writeContract } = useWriteContract();

  const onApplyClick = () => {
    setApplyForm(!applyForm);
  };

  const onRepayClick = () => {
    setRepayForm(!repayForm);
  };

  const onAddFundsClick = () => {
    setAddFundsForm(!addFundsForm);
  };

  const onWithdrawClick = () => {
    setWithdrawForm(!withdrawForm);
  };

  const onApplySubmit = (e: any) => {
    e.preventDefault();
    writeContract({
      abi: lendingABI,
      address: lendingContractAddress,
      functionName: "requestLoan",
      account: account.address,
      args: [e.target[0].value],
    });
    onApplyClick();
  };

  const onRepaySubmit = (e: any) => {
    e.preventDefault();
    writeContract({
      abi: lendingABI,
      address: lendingContractAddress,
      functionName: "repayLoan",
      account: account.address,
      value: e.target[0].value,
    });
    onRepayClick();
  };

  const onAddFundsSubmit = (e: any) => {
    e.preventDefault();
    writeContract({
      abi: lendingABI,
      address: lendingContractAddress,
      functionName: "addBalance",
      account: account.address,
      value: e.target[0].value,
    });
    onAddFundsClick();
  };

  const onWithdrawSubmit = (e: any) => {
    e.preventDefault();
    writeContract({
      abi: lendingABI,
      address: lendingContractAddress,
      functionName: "withdrawBalance",
      account: account.address,
      args: [e.target[0].value],
    });
    onWithdrawClick();
  };

  useEffect(() => {
    fetch(
      `https://api-sepolia.etherscan.io/api?module=logs&action=getLogs&address=${lendingContractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}&page=1&offset=10&sort=asc`
    )
      .then((response) => response.json())
      .then((data) => {
        setLatestTransaction(data.result);
      });
  }, []);

  return (
    <div className="my-5 min-h-[80dvh]">
      <h1 className="text-5xl font-bold text-center">Loan Account</h1>
      <div className="my-3">
        <p className="text-center">For Account: {account.address}</p>
        <p className="text-center font-bold">
          Outstanding Loan:{" "}
          {outstandingLoan && outstandingLoan[0] === account.address
            ? outstandingLoan[1].toString()
            : "0"}{" "}
          Wei
        </p>
      </div>
      <div className="flex flex-row justify-center gap-x-3">
        <div className="text-center">
          <button className="btn btn-primary" onClick={onApplyClick}>
            Apply
          </button>
        </div>
        <div className="text-center">
          <button className="btn btn-primary" onClick={onRepayClick}>
            Repay
          </button>
        </div>
        {contractOwner === account.address && (
          <>
            <div className="text-center">
              <button className="btn btn-primary" onClick={onAddFundsClick}>
                Add Funds
              </button>
            </div>
            <div className="text-center">
              <button className="btn btn-primary" onClick={onWithdrawClick}>
                Withdraw Funds
              </button>
            </div>
          </>
        )}
      </div>
      {applyForm && (
        <form
          className="flex justify-center my-5 gap-x-2"
          onSubmit={onApplySubmit}
        >
          <input
            type="text"
            placeholder="x Wei"
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            Apply
          </button>
        </form>
      )}
      {repayForm && (
        <form
          className="flex justify-center my-5 gap-x-2"
          onSubmit={onRepaySubmit}
        >
          <input
            type="text"
            placeholder="x Wei"
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            Repay
          </button>
        </form>
      )}
      {addFundsForm && (
        <form
          className="flex justify-center my-5 gap-x-2"
          onSubmit={onAddFundsSubmit}
        >
          <input
            type="text"
            placeholder="x Wei"
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            Add Funds
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
            Withdraw Funds
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
