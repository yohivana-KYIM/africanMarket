import { type FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi";
import SEO from "../components/SEO";
import { categoriesConfig } from "../data/categories";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const Collections: FC = () => {
  const mainCollections = categoriesConfig.filter(
    (c) => !["achat-programme", "services"].includes(c.slug)
  );
  const specialCollections = categoriesConfig.filter(
    (c) => ["achat-programme", "services"].includes(c.slug)
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <SEO
        title="Nos Collections"
        description="Découvrez toutes les collections Africa Market : sacs wax, accessoires bogolan, chaussures cuir, cadeaux événementiels. Artisanat africain de luxe."
        canonical="/collections"
      />

      {/* Hero Banner */}
      <section className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=75"
            alt="Nos Collections"
            className="w-full h-full object-cover"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </motion.div>
        <div className="relative z-10 h-full flex items-end pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <nav className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.1em] uppercase text-white/60 mb-4">
                <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
                <HiOutlineChevronRight size={12} />
                <span className="text-white">Collections</span>
              </nav>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Nos Collections
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-16 h-[2px] bg-[#c5a467] mt-5 origin-left"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro text */}
      <section className="py-14 sm:py-18 lg:py-24">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            variants={fadeUp}
          >
            <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed">
              Chaque collection Africa Market est le fruit d'un savoir-faire
              ancestral. Découvrez nos univers, de la maroquinerie d'exception
              aux accessoires raffinés, en passant par nos cadeaux événementiels.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Collections Grid */}
      <section className="pb-10 sm:pb-16">
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
              Univers
            </p>
            <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.2em] uppercase text-[#19110b]">
              Collections principales
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* First row - 2 large featured cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {mainCollections.slice(0, 2).map((cat) => (
                <motion.div key={cat.slug} variants={staggerItem}>
                  <Link
                    to={`/categorie/${cat.slug}`}
                    className="relative block overflow-hidden group"
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="aspect-[4/5] sm:aspect-[3/4]">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent group-hover:from-black/70 transition-all duration-700" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#c5a467] mb-2">
                          {cat.subcategories.length} sous-catégorie{cat.subcategories.length !== 1 ? "s" : ""}
                        </p>
                        <h3
                          className="text-xl sm:text-2xl lg:text-3xl text-white font-light leading-tight mb-3"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {cat.label}
                        </h3>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
                          {cat.subcategories.slice(0, 4).map((sub) => (
                            <span
                              key={sub.slug}
                              className="text-[10px] sm:text-[11px] text-white/60 font-light"
                            >
                              {sub.label}
                            </span>
                          ))}
                          {cat.subcategories.length > 4 && (
                            <span className="text-[10px] sm:text-[11px] text-white/40 font-light">
                              +{cat.subcategories.length - 4} autres
                            </span>
                          )}
                        </div>
                        <span className="lv-btn lv-btn-white text-[9px] sm:text-[10px]">
                          Découvrir la collection
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Remaining collections */}
            {mainCollections.length > 2 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {mainCollections.slice(2).map((cat) => (
                  <motion.div key={cat.slug} variants={staggerItem}>
                    <Link
                      to={`/categorie/${cat.slug}`}
                      className="relative block overflow-hidden group"
                    >
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="aspect-[3/4]">
                          <img
                            src={cat.image}
                            alt={cat.label}
                            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent group-hover:from-black/65 transition-all duration-700" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <p className="text-[9px] tracking-[0.2em] uppercase text-[#c5a467] mb-1.5">
                            {cat.subcategories.length} sous-catégorie{cat.subcategories.length !== 1 ? "s" : ""}
                          </p>
                          <h3
                            className="text-[14px] sm:text-[18px] text-white font-light tracking-wide mb-3"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            {cat.label}
                          </h3>
                          <div className="w-0 group-hover:w-10 h-[2px] bg-[#c5a467] transition-all duration-500" />
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Special Collections */}
      {specialCollections.length > 0 && (
        <section className="py-14 sm:py-20 lg:py-24 bg-[#faf9f7]">
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
              {specialCollections.map((cat, i) => (
                <motion.div
                  key={cat.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  variants={fadeUp}
                >
                  <Link
                    to={`/categorie/${cat.slug}`}
                    className="block bg-white p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-500 group"
                  >
                    <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#c5a467] mb-3">
                      {cat.slug === "services" ? "Service" : "Programme"}
                    </p>
                    <h3
                      className="text-[16px] sm:text-[18px] text-[#19110b] font-light mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {cat.label}
                    </h3>
                    <p className="text-[12px] text-[#757575] font-light leading-relaxed mb-4">
                      {cat.slug === "services"
                        ? "Réparation, entretien et personnalisation par nos artisans qualifiés."
                        : "Cotisez et obtenez le sac de vos rêves grâce à notre programme exclusif."
                      }
                    </p>
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#19110b] font-medium group-hover:underline underline-offset-4">
                      En savoir plus
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </motion.main>
  );
};

export default Collections;