import { type FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineChevronRight } from "react-icons/hi";
import toast from "react-hot-toast";
import { categoriesConfig, getCategoryBySlug, getSubcategory } from "../data/categories";
import { formatPrice } from "../data/products";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

interface CategoryProps {
  addToCart: (product: Product) => void;
  products: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Category: FC<CategoryProps> = ({ addToCart, products, toggleWishlist, isInWishlist }) => {
  const { slug, sub } = useParams<{ slug: string; sub?: string }>();
  const navigate = useNavigate();

  const category = slug ? getCategoryBySlug(slug) : undefined;

  if (!category) {
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
            Catégorie introuvable
          </h1>
          <p className="text-[13px] text-[#757575] mb-8">
            Cette catégorie n'existe pas ou a été déplacée.
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

  const subcategory = sub ? getSubcategory(category.slug, sub) : undefined;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast(
      <span className="text-[12px] tracking-[0.03em]">
        <strong>{product.name}</strong> — ajouté au panier
      </span>,
      {
        icon: "✓",
        style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" },
      }
    );
  };

  const handleToggleWishlist = (product: Product) => {
    const wasIn = isInWishlist(product.id);
    toggleWishlist(product);
    toast(
      <span className="text-[12px] tracking-[0.03em]">
        <strong>{product.name}</strong> — {wasIn ? "retiré des favoris" : "ajouté aux favoris"}
      </span>,
      { icon: wasIn ? "♡" : "♥", style: { background: "#19110b", color: "#fff", borderRadius: "0", fontSize: "12px" } }
    );
  };

  // If we have a sub, show products filtered by subcategory
  if (sub && subcategory) {
    const filteredProducts = products.filter(
      (p) => p.categorySlug === category.slug && p.subcategorySlug === subcategory.slug
    );

    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full pt-28 sm:pt-32 lg:pt-36"
      >
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8"
        >
          <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-[#757575]">
            <Link to="/" className="hover:text-[#19110b] transition-colors">Accueil</Link>
            <HiOutlineChevronRight size={12} />
            <Link to={`/categorie/${category.slug}`} className="hover:text-[#19110b] transition-colors">
              {category.label}
            </Link>
            <HiOutlineChevronRight size={12} />
            <span className="text-[#19110b]">{subcategory.label}</span>
          </nav>
        </motion.div>

        {/* Page header */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl text-[#19110b] font-light tracking-wide mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {subcategory.label}
            </h1>
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-8 h-[2px] bg-[#c5a467] origin-left"
              />
              <p className="text-[12px] sm:text-[13px] text-[#757575] font-light">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Products grid */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-7">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isInWishlist={isInWishlist(product.id)} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="py-20 text-center"
            >
              <p className="text-[13px] text-[#757575] font-light mb-6">
                Aucun produit disponible dans cette sous-catégorie pour le moment.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/categorie/${category.slug}`)}
                className="lv-btn text-[10px]"
              >
                Voir toute la collection {category.label}
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.main>
    );
  }

  // Show subcategories grid (or products if no subcategories)
  const categoryProducts = products.filter((p) => p.categorySlug === category.slug);

  // Special editorial content for certain categories
  const isEditorial = ["achat-programme", "services"].includes(category.slug);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28 sm:pt-32 lg:pt-36"
    >
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8"
      >
        <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-[#757575]">
          <Link to="/" className="hover:text-[#19110b] transition-colors">Accueil</Link>
          <HiOutlineChevronRight size={12} />
          <span className="text-[#19110b]">{category.label}</span>
        </nav>
      </motion.div>

      {/* Hero banner */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden aspect-[21/9] sm:aspect-[3/1]"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            src={category.image}
            alt={category.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/70 mb-2"
            >
              Collection
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl sm:text-3xl lg:text-4xl text-white font-light tracking-wide"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {category.label}
            </motion.h1>
          </div>
        </motion.div>
      </div>

      {/* Editorial content for Achat Programmé */}
      {category.slug === "achat-programme" && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-14 sm:mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.8 }} variants={fadeUp}>
              <h2
                className="text-xl sm:text-2xl text-[#19110b] font-light leading-snug tracking-wide mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Programmez vos achats, réalisez vos envies
              </h2>
              <div className="w-10 h-px bg-[#19110b] mx-auto mb-5" />
              <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed mb-8">
                Notre programme de cotisations vous permet d'acquérir le sac de vos rêves
                en étalant votre investissement. Rejoignez notre communauté et bénéficiez
                d'avantages exclusifs sur nos collections.
              </p>
              <a
                href="https://wa.me/237671178991?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20le%20programme%20d'achat%20programmé."
                target="_blank"
                rel="noopener noreferrer"
                className="lv-btn text-[10px]"
              >
                Nous contacter sur WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Editorial content for Services */}
      {category.slug === "services" && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-14 sm:mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.8 }} variants={fadeUp}>
              <h2
                className="text-xl sm:text-2xl text-[#19110b] font-light leading-snug tracking-wide mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Nos services de réparation
              </h2>
              <div className="w-10 h-px bg-[#19110b] mx-auto mb-5" />
              <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed mb-4">
                Nos artisans experts redonnent vie à vos pièces favorites. Réparation de
                fermetures, coutures, remplacement de bandoulières — nous prenons soin de
                vos accessoires avec le même savoir-faire qui les a vus naître.
              </p>
              <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed mb-8">
                Contactez-nous pour un devis gratuit et personnalisé.
              </p>
              <a
                href="https://wa.me/237671178991?text=Bonjour%2C%20j'aimerais%20obtenir%20un%20devis%20pour%20une%20réparation."
                target="_blank"
                rel="noopener noreferrer"
                className="lv-btn text-[10px]"
              >
                Demander un devis
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Subcategories grid */}
      {category.subcategories.length > 0 && !isEditorial && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-14 sm:mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            className="mb-8"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#757575] mb-1">
              Explorer
            </p>
            <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
              Sous-catégories
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {category.subcategories.map((subcat) => {
              const subProducts = products.filter(
                (p) => p.categorySlug === category.slug && p.subcategorySlug === subcat.slug
              );
              const previewImage = subProducts[0]?.image || category.image;

              return (
                <motion.div
                  key={subcat.slug}
                  variants={staggerItem}
                >
                  <Link
                    to={`/categorie/${category.slug}/${subcat.slug}`}
                    className="group block"
                  >
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative overflow-hidden aspect-[3/4] bg-[#f6f5f3]"
                    >
                      <img
                        src={previewImage}
                        alt={subcat.label}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h3 className="text-[12px] sm:text-[14px] text-white font-medium tracking-[0.1em] uppercase">
                          {subcat.label}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-white/60 mt-1">
                          {subProducts.length} produit{subProducts.length !== 1 ? "s" : ""}
                        </p>
                        {/* Hover line indicator */}
                        <div className="w-0 group-hover:w-8 h-[2px] bg-[#c5a467] mt-2 transition-all duration-500" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* All products in this category */}
      {categoryProducts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            className="mb-8 sm:mb-10"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#757575] mb-1">
              Collection
            </p>
            <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
              Tous les produits — {category.label}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-7">
            {categoryProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {categoryProducts.length === 0 && !isEditorial && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24"
        >
          <div className="py-20 text-center">
            <p className="text-[13px] text-[#757575] font-light mb-6">
              Aucun produit disponible dans cette catégorie pour le moment.
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
      )}
    </motion.main>
  );
};

export default Category;