export type VariantOption = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: string;
  variants?: VariantOption[];
  bestSeller: boolean;
  featured: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
};

export type ThemePreset = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
};
