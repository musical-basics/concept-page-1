export default function ProductGrid({
  onAddToCart,
}: {
  onAddToCart: () => void;
}) {
  return (
    <section className="product-grid-section">
      <div className="container">
        <h2 className="section-heading">Premium Speakers</h2>
        <div className="product-grid">
          <div className="product-card">
            <div className="product-card-image">
              <span className="product-badge sale">Sale</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="product-img-primary"
                src="https://picsum.photos/seed/speaker1/600/800"
                alt="Speaker 1"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="product-img-hover"
                src="https://picsum.photos/seed/speaker1b/600/800"
                alt="Speaker 1 alternate"
              />
              <button className="quick-add" onClick={onAddToCart}>
                Quick Add
              </button>
            </div>
            <div className="product-card-info">
              <h3>Arena Pro Speaker</h3>
              <p className="price">
                <span className="sale-price">$199</span> <s>$349</s>
              </p>
              <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
          </div>
          <div className="product-card">
            <div className="product-card-image">
              <span className="product-badge new">New</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="product-img-primary"
                src="https://picsum.photos/seed/speaker2/600/800"
                alt="Speaker 2"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="product-img-hover"
                src="https://picsum.photos/seed/speaker2b/600/800"
                alt="Speaker 2 alternate"
              />
              <button className="quick-add" onClick={onAddToCart}>
                Quick Add
              </button>
            </div>
            <div className="product-card-info">
              <h3>Pulse Mini</h3>
              <p className="price">$129</p>
              <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
            </div>
          </div>
          <div className="product-card">
            <div className="product-card-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="product-img-primary"
                src="https://picsum.photos/seed/speaker3/600/800"
                alt="Speaker 3"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="product-img-hover"
                src="https://picsum.photos/seed/speaker3b/600/800"
                alt="Speaker 3 alternate"
              />
              <button className="quick-add" onClick={onAddToCart}>
                Quick Add
              </button>
            </div>
            <div className="product-card-info">
              <h3>Horizon Tower</h3>
              <p className="price">$499</p>
              <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
