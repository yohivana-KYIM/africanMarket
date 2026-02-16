import { type FC } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineChevronRight } from "react-icons/hi";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import { categoriesConfig, getCategoryBySlug, getSubcategory } from "../data/categories";
import { formatPrice } from "../data/products";
import ProductCard from "../components/ProductCard";
import ImageMarquee from "../components/ImageMarquee";
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
        <SEO
          title={`${subcategory.label} - ${category.label}`}
          description={`Découvrez notre sélection ${subcategory.label} dans la collection ${category.label}. Artisanat africain de luxe, livraison au Cameroun.`}
          canonical={`/categorie/${category.slug}/${subcategory.slug}`}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://africamarket.store/" },
              { "@type": "ListItem", "position": 2, "name": category.label, "item": `https://africamarket.store/categorie/${category.slug}` },
              { "@type": "ListItem", "position": 3, "name": subcategory.label, "item": `https://africamarket.store/categorie/${category.slug}/${subcategory.slug}` },
            ],
          }}
        />

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
      <SEO
        title={category.label}
        description={`Collection ${category.label} — Africa Market. Découvrez nos ${category.subcategories.length} sous-catégories d'artisanat africain de luxe.`}
        canonical={`/categorie/${category.slug}`}
        image={category.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://africamarket.store/" },
            { "@type": "ListItem", "position": 2, "name": category.label, "item": `https://africamarket.store/categorie/${category.slug}` },
          ],
        }}
      />

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
            decoding="async"
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

      {/* Promo banner */}
      {category.banner && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-10 sm:mb-14">
          <Link to={category.banner.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="relative overflow-hidden aspect-[21/9] sm:aspect-[4/1] group cursor-pointer"
            >
              <img
                src={category.banner.image}
                alt={category.banner.title}
                className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 lg:px-12">
                <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#c5a467] font-medium mb-1.5 sm:mb-2">
                  Offre spéciale
                </p>
                <h3
                  className="text-lg sm:text-xl lg:text-2xl text-white font-light tracking-wide mb-1 sm:mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {category.banner.title}
                </h3>
                <p className="text-[11px] sm:text-[12px] text-white/70 font-light">
                  {category.banner.subtitle}
                </p>
                <div className="w-0 group-hover:w-10 h-[2px] bg-[#c5a467] mt-3 transition-all duration-500" />
              </div>
            </motion.div>
          </Link>
        </section>
      )}

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
                href="https://wa.me/237651711545?text=Bonjour%2C%20je%20suis%20intéressé(e)%20par%20le%20programme%20d'achat%20programmé."
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
        <>
          {/* Intro */}
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-14 sm:mb-20">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.8 }} variants={fadeUp}>
                <h2
                  className="text-xl sm:text-2xl text-[#19110b] font-light leading-snug tracking-wide mb-5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  L'excellence au service de vos pièces
                </h2>
                <div className="w-10 h-px bg-[#c5a467] mx-auto mb-5" />
                <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed">
                  Chez Africa Market, nous ne nous contentons pas de créer. Nous prenons soin
                  de vos accessoires avec le même savoir-faire artisanal qui les a vus naître.
                  Découvrez nos services dédiés à la longévité de vos pièces.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Services Cards — LV style with full images */}
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-14 sm:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[
                {
                  title: "Réparation",
                  desc: "Fermetures éclair, coutures défaites, anses cassées — nos artisans redonnent vie à vos pièces.",
                  image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600&q=80",
                },
                {
                  title: "Personnalisation",
                  desc: "Gravure d'initiales, choix des couleurs, motifs wax — créez une pièce unique.",
                  image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
                },
                {
                  title: "Entretien",
                  desc: "Nettoyage professionnel, traitement du cuir — prolongez la beauté de vos accessoires.",
                  image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
                },
              ].map((service, i) => (
                <motion.div
                  key={service.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  variants={fadeUp}
                >
                  <div className="group relative overflow-hidden aspect-[4/5] cursor-pointer">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                      <h3
                        className="text-[16px] sm:text-[18px] text-white font-light tracking-wide mb-2"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-[11px] sm:text-[12px] text-white/70 font-light leading-relaxed">
                        {service.desc}
                      </p>
                      <div className="w-0 group-hover:w-10 h-[2px] bg-[#c5a467] mt-3 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ═══ Marquee Section : Voyage ═══ */}
          <section className="mb-14 sm:mb-20">
            {/* Section announcement image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative overflow-hidden aspect-[21/9] sm:aspect-[3/1] mb-8 sm:mb-12"
            >
              <img
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=80"
                alt="Service Voyage"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#c5a467] font-medium mb-2">
                    Service
                  </p>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-wide"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Voyage
                  </h2>
                  <div className="w-10 h-[2px] bg-[#c5a467] mx-auto mt-3" />
                </div>
              </div>
            </motion.div>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8 text-center">
              <p className="text-[12px] sm:text-[13px] text-[#757575] font-light max-w-lg mx-auto">
                Voyagez avec élégance. Découvrez nos bagages, trousses et accessoires conçus pour sublimer chaque déplacement.
              </p>
            </div>
            <ImageMarquee
              direction="left"
              speed={35}
              images={[
                { src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", alt: "Bagage voyage cuir" },
                { src: "https://images.unsplash.com/photo-1581553680321-4fffae0cb598?w=500&q=80", alt: "Valise voyage" },
                { src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80", alt: "Trousse voyage" },
                { src: "https://images.unsplash.com/photo-1473188588951-bf003f56e226?w=500&q=80", alt: "Accessoire voyage" },
                { src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=80", alt: "Destination voyage" },
                { src: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=500&q=80", alt: "Voyage luxe" },
              ]}
            />
          </section>

          {/* ═══ Marquee Section : Achat Programmé ═══ */}
          <section className="mb-14 sm:mb-20">
            {/* Section announcement image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative overflow-hidden aspect-[21/9] sm:aspect-[3/1] mb-8 sm:mb-12"
            >
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1400&q=80"
                alt="Achat Programmé"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#c5a467] font-medium mb-2">
                    Service
                  </p>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-wide"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Achat Programmé
                  </h2>
                  <div className="w-10 h-[2px] bg-[#c5a467] mx-auto mt-3" />
                </div>
              </div>
            </motion.div>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8 text-center">
              <p className="text-[12px] sm:text-[13px] text-[#757575] font-light max-w-lg mx-auto">
                Acquérez le sac de vos rêves grâce à notre programme de cotisations. Étalez votre investissement en toute sérénité.
              </p>
            </div>
            <ImageMarquee
              direction="right"
              speed={40}
              images={[
                { src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80", alt: "Sac cuir artisanal" },
                { src: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80", alt: "Maroquinerie luxe" },
                { src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", alt: "Sac à main cuir" },
                { src: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80", alt: "Collection sacs" },
                { src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=500&q=80", alt: "Accessoire maroquinerie" },
                { src: "https://images.unsplash.com/photo-1575032617751-6ddec2089882?w=500&q=80", alt: "Sac designer" },
              ]}
            />
          </section>

          {/* ═══ Marquee Section : Cadeau Personnalisé / Événements ═══ */}
          <section className="mb-14 sm:mb-20">
            {/* Section announcement image */}
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative overflow-hidden aspect-[21/9] sm:aspect-[3/1] mb-8 sm:mb-12"
            >
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=1400&q=80"
                alt="Cadeau Personnalisé & Événements"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                <div>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#c5a467] font-medium mb-2">
                    Service
                  </p>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-wide"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Cadeau Personnalisé & Événements
                  </h2>
                  <div className="w-10 h-[2px] bg-[#c5a467] mx-auto mt-3" />
                </div>
              </div>
            </motion.div>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-6 sm:mb-8 text-center">
              <p className="text-[12px] sm:text-[13px] text-[#757575] font-light max-w-lg mx-auto">
                Offrez un cadeau unique pour chaque occasion. Mariages, anniversaires, fêtes — nous créons sur mesure.
              </p>
            </div>
            <ImageMarquee
              direction="left"
              speed={35}
              images={[
                { src: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=500&q=80", alt: "Cadeau emballé luxe" },
                { src: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&q=80", alt: "Paquet cadeau" },
                { src: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80", alt: "Événement spécial" },
                { src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&q=80", alt: "Cadeau personnalisé" },
                { src: "https://images.unsplash.com/photo-1607469256872-48b27137ab55?w=500&q=80", alt: "Coffret cadeau" },
                { src: "https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?w=500&q=80", alt: "Célébration événement" },
              ]}
            />
          </section>

          {/* How it works */}
          <section className="bg-[#faf9f7] py-14 sm:py-20">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                variants={fadeUp}
                className="text-center mb-10 sm:mb-14"
              >
                <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#c5a467] font-medium mb-2">
                  Simple & rapide
                </p>
                <h2
                  className="text-xl sm:text-2xl text-[#19110b] font-light tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Comment ça marche ?
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-10 max-w-4xl mx-auto">
                {[
                  { step: "01", title: "Contactez-nous", desc: "Envoyez-nous des photos de votre article via WhatsApp avec une description du problème." },
                  { step: "02", title: "Devis gratuit", desc: "Nous analysons votre demande et vous envoyons un devis détaillé sous 24h." },
                  { step: "03", title: "Intervention", desc: "Après validation, nos artisans prennent en charge votre pièce. Récupération ou livraison à domicile." },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                    variants={fadeUp}
                    className="text-center"
                  >
                    <span className="text-[28px] sm:text-[32px] font-light text-[#c5a467]/30 tracking-wider mb-2 block"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {item.step}
                    </span>
                    <h3 className="text-[12px] sm:text-[13px] font-medium tracking-[0.15em] uppercase text-[#19110b] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-[#757575] font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Guarantees */}
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { title: "Devis gratuit", desc: "Sans engagement" },
                { title: "Artisans qualifiés", desc: "Savoir-faire local" },
                { title: "Garantie 30 jours", desc: "Sur chaque réparation" },
                { title: "Suivi WhatsApp", desc: "Étape par étape" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  variants={fadeUp}
                  className="text-center"
                >
                  <h3 className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#19110b] font-medium mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-[#757575] font-light">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-14 sm:mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              variants={fadeUp}
              className="relative overflow-hidden bg-[#19110b] p-8 sm:p-12 lg:p-16 text-center"
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&q=30')] bg-cover bg-center" />
              </div>
              <div className="relative z-10">
                <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#c5a467] font-medium mb-3">
                  Besoin d'un service ?
                </p>
                <h2
                  className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-snug tracking-wide mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Contactez-nous dès maintenant
                </h2>
                <p className="text-[12px] sm:text-[13px] text-white/60 font-light leading-relaxed mb-8 max-w-xl mx-auto">
                  Envoyez-nous des photos de votre article et décrivez le service souhaité.
                  Notre équipe vous répondra sous 24h avec un devis gratuit et personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <a
                    href="https://wa.me/237651711545?text=Bonjour%2C%20j'aimerais%20obtenir%20un%20devis%20pour%20un%20service%20(réparation%2C%20personnalisation%20ou%20entretien)."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lv-btn lv-btn-white text-[10px] inline-flex items-center gap-2"
                  >
                    Demander un devis via WhatsApp
                  </a>
                  <a
                    href="tel:+237651711545"
                    className="text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors font-medium"
                  >
                    ou appelez le +237 651 711 545
                  </a>
                </div>
              </div>
            </motion.div>
          </section>
        </>
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