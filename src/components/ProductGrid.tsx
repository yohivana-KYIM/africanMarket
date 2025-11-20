import { useState } from 'react';
import { Star, Heart, ShoppingCart, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import iphone12Img from '@/assets/image/smartphones/apple_iphone-12.jpg';
import galaxyImg from '@/assets/image/smartphones/samsung-galaxy.jpg';
import pixel10Img from '@/assets/image/smartphones/google-pixel-10.jpg';
import tecnoImg from '@/assets/image/smartphones/tecno_phantom.jpg';
import airpodImg from '@/assets/image/casques/airpod.jpg';
import casqueImg from '@/assets/image/casques/casque.jpg';
import ecouteurImg from '@/assets/image/casques/ecouteur.jpg';
import ecran1 from '@/assets/image/ecran/ecran1.jpg';
import ecran2 from '@/assets/image/ecran/ecran2.jpg';
import ecran3 from '@/assets/image/ecran/ecran3.jpg';
import pcDell from '@/assets/image/ordinateur/del.jpg';
import pcHp from '@/assets/image/ordinateur/hp.jpg';
import pcMac from '@/assets/image/ordinateur/macbook.jpg';
import tablet1 from '@/assets/image/tablette/table1.jpg';
import tablet2 from '@/assets/image/tablette/table2.jpg';
import tablet3 from '@/assets/image/tablette/table3.jpg';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Smartphone Samsung Galaxy A54",
    price: 180000,
    originalPrice: 220000,
    rating: 4.5,
    reviews: 127,
    image: galaxyImg,
    category: "Électronique",
    subcategory: "Smartphones",
    inStock: true,
    isNew: true
  },
  {
    id: 13,
    name: "Samsung Galaxy S24",
    price: 520000,
    originalPrice: 560000,
    rating: 4.6,
    reviews: 431,
    image: galaxyImg,
    category: "Électronique",
    subcategory: "Smartphones",
    inStock: true,
    isNew: true
  },
  {
    id: 14,
    name: "google pixel 10",
    price: 150000,
    originalPrice: 180000,
    rating: 4.3,
    reviews: 220,
    image: pixel10Img,
    category: "Électronique",
    subcategory: "Smartphones",
    inStock: true,
    isNew: false
  },
  {
    id: 15,
    name: "ecouteurs",
    price: 250000,
    originalPrice: 280000,
    rating: 4.8,
    reviews: 980,
    image: ecouteurImg,
    category: "Électronique",
    subcategory: "Casques",
    inStock: true,
    isNew: false
  },
  {
    id: 16,
    name: "LG OLED C3 65\"",
    price: 1200000,
    originalPrice: 1350000,
    rating: 4.9,
    reviews: 310,
    image: ecran1,
    category: "Électronique",
    subcategory: "TV",
    inStock: true,
    isNew: false
  },
  {
    id: 17,
    name: "MacBook Air M2 13\"",
    price: 950000,
    originalPrice: 1050000,
    rating: 4.7,
    reviews: 540,
    image: pcMac,
    category: "Électronique",
    subcategory: "Ordinateurs",
    inStock: true,
    isNew: false
  },

  {
    id: 19,
    name: "Casque Bluetooth Over-Ear",
    price: 85000,
    originalPrice: 110000,
    rating: 4.3,
    reviews: 145,
    image: airpodImg,
    category: "Électronique",
    subcategory: "Casques",
    inStock: true,
    isNew: false
  },
  {
    id: 20,
    name: "TV Samsung 50'' Crystal UHD",
    price: 310000,
    originalPrice: 360000,
    rating: 4.4,
    reviews: 201,
    image: ecran2,
    category: "Électronique",
    subcategory: "TV",
    inStock: true,
    isNew: false
  },
  {
    id: 21,
    name: "PC Portable i5 16Go/512Go",
    price: 430000,
    originalPrice: 480000,
    rating: 4.1,
    reviews: 88,
    image: pcDell,
    category: "Électronique",
    subcategory: "Ordinateurs",
    inStock: true,
    isNew: false
  },

  {
    id: 23,
    name: "Batterie Externe 20 000 mAh",
    price: 25000,
    originalPrice: 35000,
    rating: 4.2,
    reviews: 310,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
    category: "Électronique",
    subcategory: "Accessoires",
    inStock: true,
    isNew: false
  },
  {
    id: 2,
    name: "Robe Traditionnelle Wax",
    price: 35000,
    originalPrice: 45000,
    rating: 4.8,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    category: "Mode",
    inStock: true,
    isNew: false
  },
  {
    id: 3,
    name: "Casque Audio JBL",
    price: 95000,
    originalPrice: 120000,
    rating: 4.3,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
    category: "Électronique",
    subcategory: "Casques",
    inStock: true,
    isNew: false
  },
  {
    id: 7,
    name: "iPhone 13 128 Go",
    price: 420000,
    originalPrice: 480000,
    rating: 4.7,
    reviews: 512,
    image: iphone12Img,
    category: "Électronique",
    subcategory: "Smartphones",
    inStock: true,
    isNew: false
  },
  {
    id: 8,
    name: "Téléviseur 55'' 4K UHD",
    price: 390000,
    originalPrice: 450000,
    rating: 4.4,
    reviews: 188,
    image: ecran3,
    category: "Électronique",
    subcategory: "TV",
    inStock: true,
    isNew: true
  },
  {
    id: 9,
    name: "Ordinateur Portable 15\"",
    price: 520000,
    originalPrice: 570000,
    rating: 4.2,
    reviews: 96,
    image: pcHp,
    category: "Électronique",
    subcategory: "Ordinateurs",
    inStock: true,
    isNew: false
  },
  {
    id: 10,
    name: "Tablette Android 10''",
    price: 150000,
    originalPrice: 180000,
    rating: 4.1,
    reviews: 73,
    image: tablet1,
    category: "Électronique",
    subcategory: "Tablettes",
    inStock: true,
    isNew: false
  },
  {
    id: 26,
    name: "iPad Air 5ème génération",
    price: 380000,
    originalPrice: 420000,
    rating: 4.6,
    reviews: 320,
    image: tablet2,
    category: "Électronique",
    subcategory: "Tablettes",
    inStock: true,
    isNew: false
  },
  {
    id: 27,
    name: "Samsung Galaxy Tab S9",
    price: 450000,
    originalPrice: 490000,
    rating: 4.5,
    reviews: 280,
    image: tablet3,
    category: "Électronique",
    subcategory: "Tablettes",
    inStock: true,
    isNew: false
  },
  {
    id: 11,
    name: "Écouteurs Bluetooth",
    price: 25000,
    originalPrice: 35000,
    rating: 4.0,
    reviews: 210,
    image: ecouteurImg,
    category: "Électronique",
    subcategory: "Accessoires",
    inStock: true,
    isNew: true
  },
  {
    id: 12,
    name: "Montre Connectée Sport",
    price: 60000,
    originalPrice: 80000,
    rating: 4.2,
    reviews: 154,
    image: "https://images.unsplash.com/photo-1511732351157-1865efcb7b7b?auto=format&fit=crop&w=800&q=60",
    category: "Électronique",
    subcategory: "Accessoires",
    inStock: true,
    isNew: false
  },
  {
    id: 24,
    name: "Tecno Phantom X",
    price: 220000,
    originalPrice: 260000,
    rating: 4.2,
    reviews: 175,
    image: tecnoImg,
    category: "Électronique",
    subcategory: "Smartphones",
    inStock: true,
    isNew: false
  },
  {
    id: 4,
    name: "Parfum Luxury Essence",
    price: 65000,
    originalPrice: 80000,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    category: "Beauté",
    inStock: false,
    isNew: true
  },
  {
    id: 5,
    name: "Chaussures Nike Air Max",
    price: 120000,
    originalPrice: 150000,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Sport",
    inStock: true,
    isNew: false
  },
  {
    id: 6,
    name: "Sac à Main Cuir",
    price: 85000,
    originalPrice: 110000,
    rating: 4.4,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Mode",
    inStock: true,
    isNew: true
  }
];

const categories = ["Tous", "Électronique", "Mode", "Beauté", "Sport", "Maison", "Livres"];
const electronicSubcategories = [
  "Tous",
  "Smartphones",
  "Casques",
  "TV",
  "Ordinateurs",
  "Tablettes",
  "Accessoires",
];

import { useCart } from '@/context/CartContext';

type ProductGridProps = {
  forceCategory?: string | undefined;
  forceSubcategory?: string | undefined;
  hideHeader?: boolean;
  hideFilters?: boolean;
  title?: string;
  renderCarousel?: boolean;
  limit?: number;
};

const ProductGrid = ({ forceCategory, forceSubcategory, hideHeader = false, hideFilters = false, title, renderCarousel = false, limit }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSub, setSelectedSub] = useState("Tous");
  const [favorites, setFavorites] = useState<number[]>([]);
  const { addItem } = useCart();

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const effectiveCategory = forceCategory ? forceCategory : selectedCategory;
  const effectiveSub = forceSubcategory ? forceSubcategory : selectedSub;

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = effectiveCategory === "Tous" || !effectiveCategory || product.category === effectiveCategory;
    const matchesSub = !forceCategory || effectiveSub === "Tous" || product.subcategory === effectiveSub;
    const matchesPrice = hideFilters ? true : (product.price >= priceRange.min && product.price <= priceRange.max);
    return matchesCategory && matchesSub && matchesPrice;
  }).slice(0, limit ?? undefined);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const fallbackBySub: Record<string, string> = {
    Smartphones: 'https://picsum.photos/seed/fallback-phone/800/600',
    Casques: 'https://picsum.photos/seed/fallback-headphones/800/600',
    TV: 'https://picsum.photos/seed/fallback-tv/1200/800',
    Ordinateurs: 'https://picsum.photos/seed/fallback-laptop/1200/800',
    Tablettes: 'https://picsum.photos/seed/fallback-tablet/1000/700',
    Accessoires: 'https://picsum.photos/seed/fallback-accessory/800/600',
  };

  const getFallback = (subcategory?: string) => {
    if (subcategory && fallbackBySub[subcategory]) return fallbackBySub[subcategory];
    return 'https://picsum.photos/seed/fallback-generic/1000/700';
  };

  const getImageClass = (subcategory?: string) => {
    if (subcategory === 'Smartphones' || subcategory === 'Casques' || subcategory === 'TV' || subcategory === 'Ordinateurs' || subcategory === 'Tablettes') {
      return 'w-full h-64 object-contain bg-white p-4 transition-transform duration-300 group-hover:scale-105';
    }
    return 'w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105';
  };

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Header */}
      {!hideHeader && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {title ?? (<>
              Nos Produits <span className="text-primary">Vedettes</span>
            </>)}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité premium à des prix exceptionnels
          </p>
        </div>
      )}

      {/* Filters */}
      {!hideFilters && (
        <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Filtres</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie</label>
              <Select value={effectiveCategory} onValueChange={setSelectedCategory} disabled={!!forceCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter for electronics */}
            {forceCategory === 'Électronique' && (
              <div>
                <label className="block text-sm font-medium mb-2">Sous-catégorie</label>
                <Select value={effectiveSub} onValueChange={setSelectedSub} disabled={!!forceSubcategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {electronicSubcategories.map(sub => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Prix minimum</label>
              <Input
                type="number"
                placeholder="0 FCFA"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prix maximum</label>
              <Input
                type="number"
                placeholder="500,000 FCFA"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Trier par</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Mis en avant</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="rating">Meilleures notes</SelectItem>
                  <SelectItem value="newest">Plus récents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      {renderCarousel ? (
        <div className="relative">
          <Carousel className="w-full" opts={{ loop: true, align: 'start' }} plugins={[Autoplay({ delay: 2500 })]}>
            <CarouselContent>
              {filteredProducts.map((product, index) => (
                <CarouselItem key={product.id} className="basis-4/5 sm:basis-1/2 lg:basis-1/3 px-2">
                  <Card className="product-card group" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className={getImageClass(product.subcategory)}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = getFallback(product.subcategory);
                        }}
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-semibold">Nouveau</span>
                        )}
                        {product.originalPrice > product.price && (
                          <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-card text-foreground px-4 py-2 rounded-lg font-semibold">Rupture de stock</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-2">
                        <span className="text-sm text-primary font-medium">{product.category}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                        disabled={!product.inStock}
                        onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 bg-card/80 backdrop-blur-sm" />
            <CarouselNext className="right-0 bg-card/80 backdrop-blur-sm" />
          </Carousel>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="product-card group h-full"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={getImageClass(product.subcategory)}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = getFallback(product.subcategory);
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        Nouveau
                      </span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute top-4 right-4 rounded-full p-2 ${favorites.includes(product.id)
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-card/80 text-foreground hover:bg-card'
                      }`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                  </Button>

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-card text-foreground px-4 py-2 rounded-lg font-semibold">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-primary font-medium">{product.category}</span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                    disabled={!product.inStock}
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-semibold mb-2">Aucun produit trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres pour voir plus de produits.
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;