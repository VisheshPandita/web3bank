"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function NavBar() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">
          Web3Bank
        </Link>
      </div>
      <div className="flex-1">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button className="btn btn-ghost">
              <Link href={"/home"}>Home</Link>
            </button>
          </li>
          <li>
            <button className="btn btn-ghost">
              <Link href={"/home/loan"}>Loan</Link>
            </button>
          </li>
          <li>
            <button className="btn btn-ghost">
              <Link href={"/home/savings"}>Savings</Link>
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            {account.status === "connected" ? (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => disconnect()}
              >
                Disconnect {account.address.slice(0, 6)}...
              </button>
            ) : (
              <>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    type="button"
                    className="btn btn-primary"
                  >
                    Connect with {connector.name}
                  </button>
                ))}
              </>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
