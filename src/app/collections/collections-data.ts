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
    image: "https://picsum.photos/seed/coll-all/800/600",
  },
  {
    slug: "grand",
    name: "Grand Pianos",
    description:
      "Concert and salon grands crafted for uncompromising tone and projection.",
    productCount: countByCategory("Grand"),
    image: "https://picsum.photos/seed/coll-grand/800/600",
  },
  {
    slug: "upright",
    name: "Upright Pianos",
    description:
      "Space-efficient uprights with rich acoustic character for home and studio.",
    productCount: countByCategory("Upright"),
    image: "https://picsum.photos/seed/coll-upright/800/600",
  },
  {
    slug: "digital",
    name: "Digital Pianos",
    description:
      "Advanced digital instruments with authentic touch and modern connectivity.",
    productCount: countByCategory("Digital"),
    image: "https://picsum.photos/seed/coll-digital/800/600",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The latest additions to the DreamPlay lineup.",
    productCount: PRODUCTS.filter((p) => p.badge === "new").length,
    image: "https://picsum.photos/seed/coll-new/800/600",
  },
  {
    slug: "on-sale",
    name: "On Sale",
    description: "Premium instruments at exceptional value.",
    productCount: PRODUCTS.filter((p) => p.badge === "sale").length,
    image: "https://picsum.photos/seed/coll-sale/800/600",
  },
  {
    slug: "lionels-picks",
    name: "Lionel's Picks",
    description:
      "Hand-selected favorites from our founder for discerning players.",
    productCount: PRODUCTS.filter((p) => p.badge === "lionels-pick").length,
    image: "https://picsum.photos/seed/coll-picks/800/600",
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
