import Image from "next/image";
import Link from "next/link";

async function App() {
  const news = await fetch(
    "https://api.blockchair.com/news?q=language(en),title(~eth)&sort=time_desc"
  ).then((res) => res.json());
  return (
    <>
      <div className="hero min-h-[85dvh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Welcome to <span className="text-secondary">Web3Bank</span>!
            </h1>
            <p className="py-6">
              Do you let your sapolia test ether sit in your wallet? Why not put
              it to work and earn some interest?
            </p>
            <button className="btn btn-primary">
              <Link href={"/home"}>Get Started</Link>
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Latest ETH News</h2>
            <div className="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
              {news.data.map((article: any) => (
                <div className="carousel-item card w-96 bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">{article.title}</h2>
                    <p>{article.source}</p>
                    <p>{article.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
