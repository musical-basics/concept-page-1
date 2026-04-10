import Link from "next/link";
import { HomeIcon } from "./icons";

export default function ShopHero() {
  return (
    <section className="shop-hero">
      <div className="shop-hero-overlay">
        <div className="shop-hero-content container">
          <nav className="shop-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">
              <HomeIcon />
            </Link>
            <svg
              className="breadcrumb-chevron"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <Link href="/shop">Collections</Link>
            <svg
              className="breadcrumb-chevron"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span>All products</span>
          </nav>
          <h1>All products</h1>
        </div>
      </div>
    </section>
  );
}
