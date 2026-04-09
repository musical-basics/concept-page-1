export default function SocialFeed() {
  return (
    <section className="social-feed">
      <div className="container">
        <div className="social-feed-header">
          <h2>Shop the Feed</h2>
          <div className="handle">
            <span>@Harmony</span>
            <button className="follow-btn">Follow</button>
          </div>
        </div>
        <div className="social-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="social-item" key={n}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/social${n}/400/400`}
                alt={`Social ${n}`}
              />
              <div className="social-item-overlay">
                <span className="bag-icon">&#128717;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
