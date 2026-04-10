"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { COLLECTIONS, collectionHref } from "@/app/collections/collections-data";

const FEATURED_COLLECTION_SLUGS = ["all", "digital", "new-arrivals", "lionels-picks"];
const SECONDARY_COLLECTION_SLUGS = ["grand", "upright", "on-sale"];

interface CollectionsMegamenuProps {
  onOpenChange?: (isOpen: boolean) => void;
}

export default function CollectionsMegamenu({ onOpenChange }: CollectionsMegamenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  }, []);

  const primaryCollections = FEATURED_COLLECTION_SLUGS.map(
    (slug) => COLLECTIONS.find((collection) => collection.slug === slug)!
  );
  const secondaryCollections = SECONDARY_COLLECTION_SLUGS.map(
    (slug) => COLLECTIONS.find((collection) => collection.slug === slug)!
  );
  const featuredCollection = COLLECTIONS.find((collection) => collection.slug === "all")!;

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <div
      className={`nav-dropdown nav-dropdown-collections${isOpen ? " is-active" : ""}`}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <Link href="/collections" className="nav-link">
        Collections
        <span className={`nav-arrow${isOpen ? " flipped" : ""}`}>
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>

      <div className={`collections-megamenu${isOpen ? " is-open" : ""}`}>
        <div className="collections-megamenu-inner">
          <div className="collections-megamenu-copy">
            <span className="collections-megamenu-label">Browse by collection</span>
            <h3>Explore DreamPlay&apos;s most-shopped collections.</h3>
            <p>
              Quick paths into the families, bundles, and founder favorites customers browse most.
            </p>
            <Link href="/collections" className="collections-megamenu-all-link">
              View all collections
            </Link>
          </div>

          <div className="collections-megamenu-links">
            <div className="collections-megamenu-column">
              {primaryCollections.map((collection, idx) => (
                <Link
                  key={collection.slug}
                  href={collectionHref(collection.slug)}
                  className="collections-megamenu-link"
                  style={{ transitionDelay: isOpen ? `${0.12 + idx * 0.06}s` : "0s" }}
                >
                  <span className="collections-megamenu-link-title">{collection.name}</span>
                  <span className="collections-megamenu-link-meta">
                    {collection.productCount} {collection.productCount === 1 ? "product" : "products"}
                  </span>
                </Link>
              ))}
            </div>

            <div className="collections-megamenu-column collections-megamenu-column-secondary">
              {secondaryCollections.map((collection, idx) => (
                <Link
                  key={collection.slug}
                  href={collectionHref(collection.slug)}
                  className="collections-megamenu-link"
                  style={{ transitionDelay: isOpen ? `${0.18 + idx * 0.06}s` : "0s" }}
                >
                  <span className="collections-megamenu-link-title">{collection.name}</span>
                  <span className="collections-megamenu-link-meta">
                    {collection.productCount} {collection.productCount === 1 ? "product" : "products"}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Link href="/collections" className="collections-megamenu-featured">
            <div className="collections-megamenu-featured-image">
              <Image
                src={featuredCollection.image}
                alt={featuredCollection.name}
                fill
                sizes="320px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="collections-megamenu-featured-copy">
              <span className="collections-megamenu-featured-kicker">Curated</span>
              <strong>{featuredCollection.name}</strong>
              <p>{featuredCollection.description}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
