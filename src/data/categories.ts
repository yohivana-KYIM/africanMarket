import type { CategoryConfig } from "../types";

export const categoriesConfig: CategoryConfig[] = [
  {
    label: "Africa Market Bags",
    slug: "africa-market-bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    subcategories: [
      { label: "Sac Monsieur", slug: "sac-monsieur" },
      { label: "Sac à dos Sport", slug: "sac-dos-sport" },
      { label: "Sac à dos LV", slug: "sac-dos-lv" },
      { label: "Sac à dos Incognito", slug: "sac-dos-incognito" },
      { label: "Sac à main", slug: "sac-a-main" },
      { label: "Sac bandoulière", slug: "sac-bandouliere" },
      { label: "Pochette", slug: "pochette" },
      { label: "Colis léger", slug: "colis-leger" },
      { label: "Personnalisé", slug: "personnalise" },
      { label: "Valise trio", slug: "valise-trio" },
      { label: "Valise unique", slug: "valise-unique" },
      { label: "Couplet voyage", slug: "couplet-voyage" },
    ],
  },
  {
    label: "Accessoires",
    slug: "accessoires",
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=80",
    subcategories: [
      { label: "Cadeau petits", slug: "cadeau-petits" },
      { label: "Cadeau grands", slug: "cadeau-grands" },
      { label: "Chaussures Hommes", slug: "chaussures-hommes" },
      { label: "Ceinture Hommes", slug: "ceinture-hommes" },
      { label: "Vêtements Hommes", slug: "vetements-hommes" },
      { label: "Babouches Hommes", slug: "babouches-hommes" },
      { label: "Montres Hommes", slug: "montres-hommes" },
      { label: "Lunettes Hommes", slug: "lunettes-hommes" },
      { label: "Foulard Hommes", slug: "foulard-hommes" },
      { label: "Chaussures Femmes", slug: "chaussures-femmes" },
      { label: "Ceinture Femmes", slug: "ceinture-femmes" },
      { label: "Babouches Femmes", slug: "babouches-femmes" },
      { label: "Montres Femmes", slug: "montres-femmes" },
      { label: "Lunettes Femmes", slug: "lunettes-femmes" },
      { label: "Foulard Femmes", slug: "foulard-femmes" },
      { label: "Ballerines", slug: "ballerines-femmes" },
      { label: "Porte-feuille Hommes", slug: "portefeuille-hommes" },
      { label: "Porte-feuille Femmes", slug: "portefeuille-femmes" },
    ],
  },
  {
    label: "Achat Programmé",
    slug: "achat-programme",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    subcategories: [
      { label: "Cotisations sacs", slug: "cotisations-sacs" },
    ],
  },
  {
    label: "Nos Services",
    slug: "services",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=80",
    subcategories: [
      { label: "Réparation", slug: "reparation" },
    ],
  },
  {
    label: "Cadeaux Événement",
    slug: "cadeaux",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238f796?w=800&q=80",
    subcategories: [
      { label: "Cadeau pour elle", slug: "cadeau-pour-elle" },
      { label: "Cadeau pour lui", slug: "cadeau-pour-lui" },
    ],
  },
];

export const getCategoryBySlug = (slug: string): CategoryConfig | undefined =>
  categoriesConfig.find((c) => c.slug === slug);

export const getSubcategory = (catSlug: string, subSlug: string) => {
  const cat = getCategoryBySlug(catSlug);
  if (!cat) return undefined;
  return cat.subcategories.find((s) => s.slug === subSlug);
};