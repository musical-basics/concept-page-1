export default function BlogGrid() {
  return (
    <section className="blog-section">
      <div className="container">
        <h2 className="section-heading">From the Journal</h2>
        <div className="blog-grid">
          <div className="blog-card blog-large">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/blog1/800/600"
              alt="Blog 1"
            />
            <div className="blog-card-content">
              <div className="blog-tag">Sound Design</div>
              <h3>The Art of Crafting Perfect Audio Drivers</h3>
              <div className="meta">March 15, 2026 &middot; 8 min read</div>
              <span className="read-more">Read More &rarr;</span>
            </div>
          </div>
          <div className="blog-stack">
            <div className="blog-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/blog2/600/400"
                alt="Blog 2"
              />
              <div className="blog-card-content">
                <div className="blog-tag">Lifestyle</div>
                <h3>How Music Shapes Your Daily Routine</h3>
                <div className="meta">March 10, 2026</div>
                <span className="read-more">Read More &rarr;</span>
              </div>
            </div>
            <div className="blog-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/blog3/600/400"
                alt="Blog 3"
              />
              <div className="blog-card-content">
                <div className="blog-tag">Technology</div>
                <h3>Active Noise Cancellation Explained</h3>
                <div className="meta">March 5, 2026</div>
                <span className="read-more">Read More &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
