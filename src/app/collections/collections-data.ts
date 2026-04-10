import { PRODUCTS } from "../shop/_lib/shop-constants";

export interface CollectionMeta {
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: string;
}

function countByCategory(category: string): number {
  return PRODUCTS.filter((p) => p.category === category).length;
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    slug: "all",
    name: "All Products",
    description: "Browse the complete DreamPlay piano collection.",
    productCount: PRODUCTS.length,
    image: "/assets/dreamplay/starred/dreamplay-hero-2-4.jpg",
  },
  {
    slug: "grand",
    name: "Grand Pianos",
    description:
      "Concert-inspired silhouettes and statement finishes for premium spaces.",
    productCount: countByCategory("Grand"),
    image: "/assets/dreamplay/starred/gold-ds-6.0-full.png",
  },
  {
    slug: "upright",
    name: "Upright Pianos",
    description:
      "Clean studio-ready forms designed to fit beautifully into modern rooms.",
    productCount: countByCategory("Upright"),
    image: "/assets/dreamplay/starred/piano-front-2.jpg",
  },
  {
    slug: "digital",
    name: "Digital Pianos",
    description:
      "Interactive instruments with light-guided keys, apps, and modern connectivity.",
    productCount: countByCategory("Digital"),
    image: "/assets/dreamplay/starred/dreamplay-piano-with-midi-app-copy.png",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The newest DreamPlay releases and latest product drops.",
    productCount: PRODUCTS.filter((p) => p.badge === "new").length,
    image: "/assets/dreamplay/starred/1775208361276_0_3714669420931421.jpg",
  },
  {
    slug: "on-sale",
    name: "On Sale",
    description: "Bundles and special-value offers on our most giftable setups.",
    productCount: PRODUCTS.filter((p) => p.badge === "sale").length,
    image: "/assets/dreamplay/starred/piano-bench-frontal-bundle.png",
  },
  {
    slug: "lionels-picks",
    name: "Lionel's Picks",
    description:
      "A founder-led shortlist of DreamPlay favorites chosen for feel and finish.",
    productCount: PRODUCTS.filter((p) => p.badge === "lionels-pick").length,
    image: "/assets/dreamplay/starred/gold-ds-6.jpg",
  },
];

/**
 * Map collection slug to a shop URL with appropriate filter.
 * Until individual collection routes exist, route into /shop with query params.
 */
export function collectionHref(slug: string): string {
  switch (slug) {
    case "all":
      return "/shop";
    case "grand":
    case "upright":
    case "digital":
      return `/shop?category=${slug.charAt(0).toUpperCase() + slug.slice(1)}`;
    case "new-arrivals":
      return "/shop?badge=new";
    case "on-sale":
      return "/shop?badge=sale";
    case "lionels-picks":
      return "/shop?badge=lionels-pick";
    default:
      return "/shop";
  }
}
