export default function BrandIntro() {
  return (
    <section className="brand-intro">
      <div className="container">
        <div className="brand-intro-top">
          <div className="brand-intro-left">
            <h2>
              We believe in the
              <br />
              power of sound
            </h2>
            <a href="#" className="story-btn">
              Our Story &rarr;
            </a>
          </div>
          <div className="brand-intro-right">
            <p>
              At DreamPlay, we craft audio experiences that transcend the ordinary.
              Every product is meticulously engineered to deliver pristine clarity, deep
              bass, and an immersive soundscape that brings your music to life. Founded by
              audiophiles, for audiophiles — we&apos;re on a mission to make premium sound
              accessible to everyone.
            </p>
          </div>
        </div>
        <div className="category-cards">
          {[
            { seed: "catall", label: "All Products" },
            { seed: "catheadphones", label: "Headphones" },
            { seed: "catearphones", label: "Earphones" },
            { seed: "catspeakers", label: "Speakers" },
          ].map((cat) => (
            <div className="category-card" key={cat.seed}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${cat.seed}/600/800`}
                alt={cat.label}
              />
              <div className="category-card-overlay">
                <span>{cat.label}</span>
                <span className="arrow">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
