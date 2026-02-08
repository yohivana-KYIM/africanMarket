export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  image: string;
  description: string;
  featured: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

export interface SubcategoryConfig {
  label: string;
  slug: string;
}

export interface CategoryConfig {
  label: string;
  slug: string;
  image: string;
  subcategories: SubcategoryConfig[];
}

export interface Category {
  name: string;
  slug: string;
}

export interface NavLink {
  label: string;
  slug: string;
  submenu: string[];
}

export interface FooterSection {
  title: string;
  links: string[];
}