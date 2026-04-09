export default function ValueProps() {
  return (
    <section className="value-props">
      <div className="container">
        <div className="value-grid">
          <div className="value-item">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h4>Customer Service</h4>
            <p>24/7 expert support for all your audio needs</p>
          </div>
          <div className="value-item">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <h4>Free Shipping</h4>
            <p>Complimentary shipping on orders over $75</p>
          </div>
          <div className="value-item">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h4>Refer a Friend</h4>
            <p>Give $20, get $20 with our referral program</p>
          </div>
          <div className="value-item">
            <div className="icon-circle">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h4>Secure Payment</h4>
            <p>SSL encrypted checkout with multiple payment options</p>
          </div>
        </div>
      </div>
    </section>
  );
}
