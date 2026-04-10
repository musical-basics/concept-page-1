import type { Product, SortOption } from "./shop-types";

export const PRODUCTS: Product[] = [
  { id: 1, name: "Concert Grand S7", category: "Grand", finish: "Ebony", price: 12999, image: "https://picsum.photos/seed/piano-g1/600/750", hoverImage: "https://picsum.photos/seed/piano-g1d/600/750", badge: "lionels-pick", stock: 2, rating: 5, colors: ["#1a1a1a", "#f5f0e8", "#6b4226"] },
  { id: 2, name: "Parlour Grand P5", category: "Grand", finish: "Walnut", price: 9499, image: "https://picsum.photos/seed/piano-g2/600/750", hoverImage: "https://picsum.photos/seed/piano-g2d/600/750", stock: 5, rating: 5, colors: ["#6b4226", "#1a1a1a"] },
  { id: 3, name: "Studio Upright U3", category: "Upright", finish: "Ebony", price: 4299, image: "https://picsum.photos/seed/piano-u1/600/750", hoverImage: "https://picsum.photos/seed/piano-u1d/600/750", badge: "new", stock: 8, rating: 4, colors: ["#1a1a1a", "#f5f0e8"] },
  { id: 4, name: "Classic Upright U1", category: "Upright", finish: "White", price: 3499, image: "https://picsum.photos/seed/piano-u2/600/750", hoverImage: "https://picsum.photos/seed/piano-u2d/600/750", stock: 3, rating: 4, colors: ["#f5f0e8", "#1a1a1a", "#6b4226"] },
  { id: 5, name: "Virtuoso Digital V9", category: "Digital", finish: "Ebony", price: 2199, comparePrice: 2799, image: "https://picsum.photos/seed/piano-d1/600/750", hoverImage: "https://picsum.photos/seed/piano-d1d/600/750", badge: "sale", stock: 12, rating: 5, colors: ["#1a1a1a", "#f5f0e8"] },
  { id: 6, name: "Ensemble Grand E7", category: "Grand", finish: "White", price: 15999, image: "https://picsum.photos/seed/piano-g3/600/750", hoverImage: "https://picsum.photos/seed/piano-g3d/600/750", badge: "lionels-pick", stock: 1, rating: 5, colors: ["#f5f0e8", "#1a1a1a"] },
  { id: 7, name: "Heritage Upright H4", category: "Upright", finish: "Walnut", price: 5199, image: "https://picsum.photos/seed/piano-u3/600/750", hoverImage: "https://picsum.photos/seed/piano-u3d/600/750", stock: 6, rating: 4, colors: ["#6b4226", "#1a1a1a", "#f5f0e8"] },
  { id: 8, name: "Stage Digital SD5", category: "Digital", finish: "Ebony", price: 1599, image: "https://picsum.photos/seed/piano-d2/600/750", hoverImage: "https://picsum.photos/seed/piano-d2d/600/750", badge: "new", stock: 15, rating: 4, colors: ["#1a1a1a"] },
  { id: 9, name: "Salon Grand SL9", category: "Grand", finish: "Ebony", price: 18999, image: "https://picsum.photos/seed/piano-g4/600/750", hoverImage: "https://picsum.photos/seed/piano-g4d/600/750", badge: "lionels-pick", stock: 1, rating: 5, colors: ["#1a1a1a", "#6b4226"] },
  { id: 10, name: "Portable Digital PD3", category: "Digital", finish: "White", price: 899, image: "https://picsum.photos/seed/piano-d3/600/750", hoverImage: "https://picsum.photos/seed/piano-d3d/600/750", stock: 20, rating: 3, colors: ["#f5f0e8", "#1a1a1a"] },
  { id: 11, name: "Conservatory Upright C5", category: "Upright", finish: "Ebony", price: 6799, image: "https://picsum.photos/seed/piano-u4/600/750", hoverImage: "https://picsum.photos/seed/piano-u4d/600/750", stock: 4, rating: 5, colors: ["#1a1a1a", "#f5f0e8", "#6b4226"] },
  { id: 12, name: "Hybrid Digital HX7", category: "Digital", finish: "Walnut", price: 3299, image: "https://picsum.photos/seed/piano-d4/600/750", hoverImage: "https://picsum.photos/seed/piano-d4d/600/750", badge: "new", stock: 7, rating: 4, colors: ["#6b4226", "#1a1a1a"] },
];

export const CATEGORIES = ["Grand", "Upright", "Digital"] as const;
export const FINISHES = ["Ebony", "White", "Walnut"] as const;

export const PRICE_RANGES = [
  { label: "Under $2,000", min: 0, max: 2000 },
  { label: "$2,000 – $5,000", min: 2000, max: 5000 },
  { label: "$5,000 – $10,000", min: 5000, max: 10000 },
  { label: "$10,000+", min: 10000, max: Infinity },
] as const;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "alpha-az", label: "Alphabetically, A-Z" },
  { value: "alpha-za", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-old", label: "Date, old to new" },
  { value: "date-new", label: "Date, new to old" },
];

export const ITEMS_PER_PAGE = 8;
