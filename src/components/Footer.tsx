export default async function Footer() {
  const blockChainData = await fetch("https://api.blockchair.com/stats").then(
    (res) => res.json()
  );
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <aside>
        <div className="carousel carousel-center gap-x-2">
          <div className="carousel-item">
            <p>
              Bitcoin: ${blockChainData.data.bitcoin.data.market_price_usd} /
            </p>
          </div>
          <div className="carousel-item">
            <p>
              Ethereum: ${blockChainData.data.ethereum.data.market_price_usd} /
            </p>
          </div>
          <div className="carousel-item">
            <p>
              Litecoin: ${blockChainData.data.litecoin.data.market_price_usd} /
            </p>
          </div>
          <div className="carousel-item">
            <p>
              Dogecoin: ${blockChainData.data.dogecoin.data.market_price_usd} /
            </p>
          </div>
          <div className="carousel-item">
            <p>Ripple: ${blockChainData.data.ripple.data.market_price_usd} </p>
          </div>
        </div>
      </aside>
    </footer>
  );
}
