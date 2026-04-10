export interface Product {
  id: number;
  name: string;
  category: "Grand" | "Upright" | "Digital";
  finish: "Ebony" | "White" | "Walnut";
  price: number;
  comparePrice?: number;
  image: string;
  hoverImage: string;
  badge?: "lionels-pick" | "sale" | "new";
  stock: number;
  rating: number;
  colors: string[];
}

export type SortOption =
  | "featured"
  | "best-selling"
  | "alpha-az"
  | "alpha-za"
  | "price-asc"
  | "price-desc"
  | "date-old"
  | "date-new";
