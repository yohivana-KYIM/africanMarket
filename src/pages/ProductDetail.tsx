import { type FC, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronRight, HiOutlineChevronLeft, HiOutlineShoppingBag, HiOutlineHeart, HiHeart } from "react-icons/hi";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { fetchProductById } from "../hooks/useProducts";
import { formatPrice } from "../data/products";
import type { Product } from "../types";

interface ProductDetailProps {
  addToCart: (product: Product) => void;
  products: Product[];
  toggleWishlist?: (product: Product) => void;
  isInWishlist?: (productId: string) => boolean;
}

const ProductDetail: FC<ProductDetailProps> = ({ addToCart, products, toggleWishlist, isInWishlist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    toast(
      <span className="text-[12px] tracking-[0.03em]">
        <strong>{product.name}</strong> — ajouté au panier
      </span>,
      { icon: "✓", style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } }
    );
  };

  const handleToggleWishlist = () => {
    if (!product || !toggleWishlist) return;
    const wasIn = isInWishlist?.(product.id);
    toggleWishlist(product);
    toast(
      <span className="text-[12px] tracking-[0.03em]">
        <strong>{product.name}</strong> — {wasIn ? "retiré des favoris" : "ajouté aux favoris"}
      </span>,
      { icon: wasIn ? "♡" : "♥", style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } }
    );
  };

  const similarProducts = product
    ? products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4)
    : [];

  if (loading) {
    return (
      <main className="w-full pt-28 sm:pt-32 lg:pt-36 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
            <div className="aspect-[3/4] bg-[#f6f5f3] animate-pulse" />
            <div className="space-y-4 py-4">
              <div className="h-3 w-24 bg-[#f6f5f3] animate-pulse" />
              <div className="h-8 w-3/4 bg-[#f6f5f3] animate-pulse" />
              <div className="h-[2px] w-8 bg-[#f6f5f3]" />
              <div className="h-5 w-32 bg-[#f6f5f3] animate-pulse" />
              <div className="h-20 w-full bg-[#f6f5f3] animate-pulse mt-6" />
              <div className="h-12 w-full bg-[#f6f5f3] animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-center justify-center pt-32"
      >
        <div className="text-center">
          <h1
            className="text-2xl sm:text-3xl text-[#19110b] font-light mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Produit introuvable
          </h1>
          <p className="text-[13px] text-[#757575] mb-8">
            Ce produit n'existe pas ou a été supprimé.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
            className="lv-btn text-[10px]"
          >
            Retour à l'accueil
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const inWishlist = isInWishlist?.(product.id) ?? false;
  const productImages = product.images.length > 0 ? product.images : product.image ? [product.image] : [];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28 sm:pt-32 lg:pt-36"
    >
      <SEO
        title={product.name}
        description={product.description || `${product.name} — ${product.category}. Artisanat africain de luxe. Livraison au Cameroun.`}
        canonical={`/produit/${product.id}`}
        image={product.image}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.image,
            "description": product.description,
            "category": product.category,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "XAF",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "url": `https://africamarket.store/produit/${product.id}`,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://africamarket.store/" },
              ...(product.categorySlug
                ? [{ "@type": "ListItem", "position": 2, "name": product.category, "item": `https://africamarket.store/categorie/${product.categorySlug}` }]
                : []),
              { "@type": "ListItem", "position": product.categorySlug ? 3 : 2, "name": product.name, "item": `https://africamarket.store/produit/${product.id}` },
            ],
          },
        ]}
      />

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8"
      >
        <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-[#757575] flex-wrap">
          <Link to="/" className="hover:text-[#19110b] transition-colors">Accueil</Link>
          <HiOutlineChevronRight size={12} />
          {product.categorySlug && (
            <>
              <Link to={`/categorie/${product.categorySlug}`} className="hover:text-[#19110b] transition-colors">
                {product.category}
              </Link>
              <HiOutlineChevronRight size={12} />
            </>
          )}
          <span className="text-[#19110b] truncate max-w-[200px]">{product.name}</span>
        </nav>
      </motion.div>

      {/* Product layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:sticky md:top-32 md:self-start space-y-3"
          >
            <div className="relative overflow-hidden bg-[#f6f5f3] aspect-[3/4] group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={productImages[activeImageIndex] || product.image}
                  alt={`${product.name} - Photo ${activeImageIndex + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                />
              </AnimatePresence>
              {product.discount && (
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.15em] uppercase font-medium text-[#19110b] bg-white/90 backdrop-blur-sm px-3 py-1.5">
                  -{product.discount}%
                </span>
              )}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => prev === 0 ? productImages.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#19110b] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <HiOutlineChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => prev === productImages.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#19110b] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <HiOutlineChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-20 sm:w-[72px] sm:h-[90px] overflow-hidden transition-all duration-300 ${
                      index === activeImageIndex
                        ? "ring-2 ring-[#c5a467] opacity-100"
                        : "ring-1 ring-[#e8e8e8] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} - Miniature ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="py-2 sm:py-4"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#757575] font-light mb-2">
              {product.category} {product.subcategory ? `— ${product.subcategory}` : ""}
            </p>

            <h1
              className="text-2xl sm:text-3xl lg:text-[36px] text-[#19110b] font-light leading-tight tracking-wide mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-8 h-[2px] bg-[#c5a467] origin-left mb-5"
            />

            <div className="flex items-center gap-3 mb-6">
              <span className="text-[18px] sm:text-[20px] text-[#19110b] font-normal tracking-[0.03em]">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-[14px] text-[#757575] line-through font-light">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount && (
                <span className="text-[11px] tracking-[0.1em] text-[#c5a467] font-medium">
                  -{product.discount}%
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-[13px] text-[#757575] font-light leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#19110b] text-white text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase py-4 flex items-center justify-center gap-2.5 hover:bg-[#2a1f14] transition-colors"
              >
                <HiOutlineShoppingBag size={16} />
                Ajouter au panier
              </motion.button>

              {toggleWishlist && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  className="w-14 border border-[#e0ded9] flex items-center justify-center hover:border-[#c5a467] transition-colors"
                  aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <AnimatePresence mode="wait">
                    {inWishlist ? (
                      <motion.div key="filled" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <HiHeart size={20} className="text-[#c5a467]" />
                      </motion.div>
                    ) : (
                      <motion.div key="outline" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <HiOutlineHeart size={20} className="text-[#19110b]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}
            </div>

            {/* Details */}
            <div className="border-t border-[#e0ded9] pt-6 space-y-3">
              <div className="flex items-center gap-2 text-[11px] text-[#757575]">
                <span className="w-1 h-1 bg-[#c5a467] rounded-full" />
                Livraison offerte dès 50 000 FCFA
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#757575]">
                <span className="w-1 h-1 bg-[#c5a467] rounded-full" />
                Retour sous 14 jours
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#757575]">
                <span className="w-1 h-1 bg-[#c5a467] rounded-full" />
                Fait main par nos artisans
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="py-14 sm:py-20 border-t border-[#e8e8e8]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 sm:mb-10"
            >
              <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#757575] mb-1">
                Découvrir aussi
              </p>
              <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
                Produits similaires
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-7">
              {similarProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => {
                    addToCart(prod);
                    toast(
                      <span className="text-[12px] tracking-[0.03em]">
                        <strong>{prod.name}</strong> — ajouté au panier
                      </span>,
                      { icon: "✓", style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } }
                    );
                  }}
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist?.(p.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.main>
  );
};

export default ProductDetail;
