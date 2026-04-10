"use client";

import Link from "next/link";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { COLLECTIONS, collectionHref } from "./collections-data";

export default function CollectionsPage() {
  return (
    <>
      <AnnouncementBar />
      <Header cartCount={0} />

      {/* Hero / Page Title */}
      <section className="collections-hero">
        <div className="collections-hero-overlay">
          <div className="collections-hero-content container">
            <nav className="shop-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
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
              <span>Collections</span>
            </nav>
            <h1>Collections</h1>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="collections-section">
        <div className="container">
          <div className="collections-grid">
            {COLLECTIONS.map((collection) => (
              <Link
                key={collection.slug}
                href={collectionHref(collection.slug)}
                className="collection-card"
              >
                <div className="collection-card-image">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="collection-card-overlay" />
                </div>
                <div className="collection-card-info">
                  <h2 className="collection-card-name">{collection.name}</h2>
                  <p className="collection-card-count">
                    {collection.productCount}{" "}
                    {collection.productCount === 1 ? "product" : "products"}
                  </p>
                  <p className="collection-card-desc">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
