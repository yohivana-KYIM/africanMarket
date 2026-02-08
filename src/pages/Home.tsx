import { type FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import HeroSlider from "../components/HeroSlider";
import ProductCard from "../components/ProductCard";
import { categoriesConfig } from "../data/categories";
import type { Product } from "../types";

interface HomeProps {
  addToCart: (product: Product) => void;
  products: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Home: FC<HomeProps> = ({ addToCart, products, toggleWishlist, isInWishlist }) => {
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

  const featured = products.filter((p) => p.featured);

  // Main product categories for grid display
  const displayCategories = categoriesConfig.filter(
    (c) => !["achat-programme", "services", "cadeaux"].includes(c.slug)
  );

  return (
    <main className="w-full">
      {/* ═══ HERO ═══ */}
      <HeroSlider />

      {/* ═══ EDITORIAL INTRO ═══ */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={fadeUp}
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#c5a467] font-medium mb-4">
              L'art de la maroquinerie africaine
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl text-[#19110b] font-light leading-snug tracking-wide mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              L'excellence artisanale au service du luxe
            </h2>
            <div className="w-10 h-px bg-[#19110b] mx-auto mb-5" />
            <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed">
              Chaque création Africa Market est le fruit d'un savoir-faire
              ancestral. Nos artisans perpétuent les techniques traditionnelles
              du wax, du bogolan et du cuir tanné pour donner vie à des pièces
              d'exception.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORIES GRID ═══ */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            className="mb-8 sm:mb-10"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#757575] mb-1">
              Explorer
            </p>
            <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
              Nos Collections
            </h2>
          </motion.div>

          {/* Top row — 2 large cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {displayCategories.slice(0, 2).map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
              >
                <Link to={`/categorie/${cat.slug}`} className="relative block overflow-hidden group">
                  <div className="aspect-[4/5] sm:aspect-[3/4]">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                    <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/70 mb-2">
                      {cat.subcategories.length} sous-catégorie{cat.subcategories.length !== 1 ? "s" : ""}
                    </p>
                    <h3
                      className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-tight mb-4"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {cat.label}
                    </h3>
                    <span className="lv-btn lv-btn-white text-[9px] sm:text-[10px]">
                      Découvrir
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Remaining categories — 3 per row */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCategories.slice(2).map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
              >
                <Link to={`/categorie/${cat.slug}`} className="relative block overflow-hidden group">
                  <div className="aspect-[3/4]">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition-all duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-[13px] sm:text-[16px] text-white font-medium tracking-[0.08em] uppercase">
                      {cat.label}
                    </h3>
                    {/* Hover line */}
                    <div className="w-0 group-hover:w-8 h-[2px] bg-[#c5a467] mt-2 transition-all duration-500" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══ */}
      {featured.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              variants={fadeUp}
              className="flex items-end justify-between mb-8 sm:mb-10 lg:mb-12"
            >
              <div>
                <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#757575] mb-1">
                  Sélection
                </p>
                <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
                  Produits en vedette
                </h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:gap-x-7">
              {featured.slice(0, 6).map((product, i) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} isInWishlist={isInWishlist(product.id)} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ EDITORIAL BANNER ═══ */}
      <section className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1600&q=80"
            alt="Lifestyle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35" />
        </motion.div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/70 mb-3">
              Savoir-faire
            </p>
            <h2
              className="text-[26px] sm:text-[36px] lg:text-[48px] text-white font-light leading-[1.1] tracking-wide mb-6 sm:mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              L'artisanat africain sublimé
            </h2>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/categorie/africa-market-bags" className="lv-btn lv-btn-white text-[10px]">
                Nos collections
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES & SPECIAL CATEGORIES ═══ */}
      <section className="py-14 sm:py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeUp}
            className="mb-8 sm:mb-10"
          >
            <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#757575] mb-1">
              Plus
            </p>
            <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
              Services & Programmes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Achat Programmé */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }} variants={fadeUp} whileHover={{ y: -5 }}>
              <Link to="/categorie/achat-programme" className="block bg-[#f6f5f3] p-6 sm:p-8 text-center hover:bg-[#f0eeea] transition-colors group">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#c5a467] mb-3">
                  Programme
                </p>
                <h3
                  className="text-[16px] sm:text-[18px] text-[#19110b] font-light mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Achat Programmé
                </h3>
                <p className="text-[12px] text-[#757575] font-light leading-relaxed mb-4">
                  Cotisez et obtenez le sac de vos rêves grâce à notre programme exclusif.
                </p>
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#19110b] font-medium group-hover:underline underline-offset-4">
                  En savoir plus
                </span>
              </Link>
            </motion.div>

            {/* Services */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} variants={fadeUp} whileHover={{ y: -5 }}>
              <Link to="/categorie/services" className="block bg-[#f6f5f3] p-6 sm:p-8 text-center hover:bg-[#f0eeea] transition-colors group">
                <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#c5a467] mb-3">
                  Service
                </p>
                <h3
                  className="text-[16px] sm:text-[18px] text-[#19110b] font-light mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Nos Services
                </h3>
                <p className="text-[12px] text-[#757575] font-light leading-relaxed mb-4">
                  Réparation, entretien et personnalisation par nos artisans qualifiés.
                </p>
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#19110b] font-medium group-hover:underline underline-offset-4">
                  Découvrir
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST / SERVICES ═══ */}
      <section className="py-14 sm:py-20 lg:py-24 border-t border-[#e8e8e8]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 sm:gap-x-6">
            {[
              { title: "Livraison offerte", desc: "Dès 50 000 FCFA d'achat" },
              { title: "Retour 14 jours", desc: "Satisfait ou remboursé" },
              { title: "Fait main", desc: "Artisans africains qualifiés" },
              { title: "Paiement sécurisé", desc: "WhatsApp ou à la livraison" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                variants={fadeUp}
                className="text-center px-2"
              >
                <h3 className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#19110b] font-medium mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-[#757575] font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;