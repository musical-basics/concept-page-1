"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">Harmony Sound</div>
            <p>
              Premium audio equipment crafted for those who demand excellence.
              Redefining the way you experience sound since 2018.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Shop All</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping &amp; Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="#">support@harmonysound.com</a></li>
              <li><a href="#">1-800-HARMONY</a></li>
              <li><a href="#">123 Audio Lane, Sound City</a></li>
              <li><a href="#">Mon&ndash;Fri: 9am &ndash; 6pm EST</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Subscribe for exclusive offers and new releases.</p>
            <form
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                (e.target as HTMLFormElement).reset();
                alert("Subscribed!");
              }}
            >
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Harmony Sound. All rights reserved.</p>
          <div className="payment-icons">
            <span className="payment-icon">VISA</span>
            <span className="payment-icon">MC</span>
            <span className="payment-icon">AMEX</span>
            <span className="payment-icon">PAYPAL</span>
            <span className="payment-icon">APPLE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
