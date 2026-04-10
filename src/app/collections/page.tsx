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

      {/* Page Title */}
      <section className="collections-title-section">
        <div className="container">
          <h1 className="collections-heading">Collections</h1>
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
