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

      {/* Collections Banner */}
      <section className="collections-hero">
        <div className="collections-hero-overlay">
          <div className="container collections-hero-content">
            <nav className="collections-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Collections</span>
            </nav>
            <h1>Collections</h1>
            <p className="collections-hero-sub">
              Explore DreamPlay&rsquo;s full range of concert grands, studio uprights, and digital instruments.
            </p>
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
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="collection-card-overlay" />
                  <div className="collection-card-info">
                    <span className="collection-card-name">{collection.name}</span>
                    <span className="collection-card-count">
                      {collection.productCount} {collection.productCount === 1 ? "product" : "products"}
                    </span>
                  </div>
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
