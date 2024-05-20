import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-[82dvh]">
      <div className="flex flex-row justify-around mt-5">
        <div className="card w-96 bg-base-300 shadow-xl">
          <figure className="px-10 pt-10">
            <Image
              src="/images/3percent.jpeg"
              alt="3% returns"
              className="rounded-xl"
              width={400}
              height={400}
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Savings</h2>
            <p>Create Savings account and get 3% returns!</p>
            <div className="card-actions">
              <button className="btn btn-primary">
                <Link href={"/home/savings"}>Go To Account</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="card w-96 bg-base-300 shadow-xl">
          <figure className="px-10 pt-10">
            <Image
              src="/images/15percent.jpeg"
              alt="15% returns"
              className="rounded-xl"
              width={400}
              height={400}
            />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Loan</h2>
            <p>Get Loand at only 15% interest rate!</p>
            <div className="card-actions">
              <button className="btn btn-primary">
                <Link href={"/home/loan"}>Go To Loan</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
