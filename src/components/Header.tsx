import { useState, useEffect, lazy, Suspense, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineChevronRight,
  HiOutlineArrowLeft,
  HiOutlineCamera,
} from "react-icons/hi";
import ContactPanel from "./ContactPanel";
import { categoriesConfig } from "../data/categories";
import { formatPrice } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../hooks/useSearch";
import type { CategoryConfig } from "../types";

const CameraSearch = lazy(() => import("./CameraSearch"));

interface HeaderProps {
  cartCount: number;
  toggleCart: () => void;
  wishlistCount: number;
  toggleWishlist: () => void;
}

const Header: FC<HeaderProps> = ({ cartCount, toggleCart, wishlistCount, toggleWishlist }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<CategoryConfig | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { results, loading: searchLoading, query, search, clearSearch } = useSearch();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen || searchOpen || cameraOpen ? "hidden" : "";
  }, [isMobileMenuOpen, searchOpen, cameraOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    clearSearch();
  };

  const goHome = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToCategory = (slug: string) => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    setMobileSubMenu(null);
    navigate(`/categorie/${slug}`);
  };

  const goToSubcategory = (catSlug: string, subSlug: string) => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    setMobileSubMenu(null);
    navigate(`/categorie/${catSlug}/${subSlug}`);
  };

  const activeCat = categoriesConfig.find((c) => c.slug === activeMenu);

  // Detect if on homepage (transparent header) vs inner pages (solid)
  const isHomePage = location.pathname === "/";
  const headerSolid = isScrolled || !isHomePage;

  return (
    <>
      {/* ═══════════════ HEADER ═══════════════ */}
      <header
        className="fixed top-0 left-0 w-full z-50"
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* ── TOP PROMO BANNER ── */}
        <motion.div
          initial={false}
          animate={{ height: isScrolled ? 0 : 32, opacity: isScrolled ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[#19110b] overflow-hidden"
        >
          <div className="h-8 flex items-center justify-center px-4">
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-white/90 font-light truncate"
            >
              Livraison offerte dès 50 000 FCFA &mdash; Retour sous 14 jours
            </motion.p>
          </div>
        </motion.div>

        {/* ── MAIN NAV BAR ── */}
        <motion.div
          initial={false}
          animate={{
            backgroundColor: headerSolid ? "rgba(255,255,255,0.98)" : "rgba(0,0,0,0)",
            backdropFilter: headerSolid ? "blur(20px)" : "blur(0px)",
            borderBottomColor: headerSolid ? "#e8e8e8" : "transparent",
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full border-b"
          style={{ WebkitBackdropFilter: headerSolid ? "blur(20px)" : "none" }}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between h-14 lg:h-16">
              {/* LEFT */}
              <div className="flex-1 flex items-center gap-2 sm:gap-4">
                {/* Mobile hamburger */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`lg:hidden flex items-center transition-colors duration-300 ${
                    headerSolid ? "text-[#19110b]" : "text-white"
                  }`}
                  aria-label="Menu"
                >
                  <HiOutlineMenu size={22} />
                </motion.button>
                {/* Desktop hamburger + "Menu" */}
                <motion.button
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(true)}
                  className={`hidden lg:flex items-center gap-2.5 transition-colors duration-300 ${
                    headerSolid ? "text-[#19110b] hover:text-[#c5a467]" : "text-white hover:text-white/70"
                  }`}
                >
                  <HiOutlineMenu size={18} />
                  <span className="text-[11px] font-medium tracking-[0.15em] uppercase">Menu</span>
                </motion.button>

                {/* Search */}
                <div className={`hidden sm:flex items-center gap-2 ml-2 ${
                  headerSolid ? "text-[#19110b]" : "text-white"
                }`}>
                  <HiOutlineSearch size={16} />
                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={() => setSearchOpen(true)}
                    className={`text-[11px] font-light tracking-[0.05em] transition-colors duration-300 ${
                      headerSolid ? "text-[#757575] hover:text-[#19110b]" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Que recherchez-vous ?
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCameraOpen(true)}
                    className={`ml-1 transition-colors duration-300 ${
                      headerSolid ? "text-[#757575] hover:text-[#c5a467]" : "text-white/50 hover:text-white"
                    }`}
                    aria-label="Recherche camera"
                  >
                    <HiOutlineCamera size={17} />
                  </motion.button>
                </div>

                {/* Mobile camera icon */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCameraOpen(true)}
                  className={`sm:hidden flex items-center transition-colors duration-300 ${
                    headerSolid ? "text-[#19110b]" : "text-white"
                  }`}
                  aria-label="Recherche camera"
                >
                  <HiOutlineCamera size={20} />
                </motion.button>
              </div>

              {/* CENTER — Logo */}
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <button onClick={goHome} className="block">
                  <motion.img
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    src="/africamarket-logo.jpg"
                    alt="Africa Market"
                    className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                  />
                </button>
              </motion.div>

              {/* RIGHT */}
              <div className="flex-1 flex items-center justify-end gap-3 sm:gap-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setContactOpen(true)}
                  className={`hidden lg:block text-[11px] font-light tracking-[0.08em] transition-colors duration-300 ${
                    headerSolid ? "text-[#757575] hover:text-[#c5a467]" : "text-white/60 hover:text-white"
                  }`}
                >
                  Contactez-nous
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.15, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={toggleWishlist}
                  className={`hidden sm:block relative transition-colors duration-300 ${
                    headerSolid ? "text-[#19110b] hover:text-[#c5a467]" : "text-white hover:text-[#c5a467]"
                  }`}
                  aria-label="Favoris"
                >
                  <HiOutlineHeart size={20} />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className="absolute -top-2 -right-2 bg-[#c5a467] text-white text-[8px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none shadow-sm"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Account */}
                <motion.button
                  whileHover={{ scale: 1.15, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={() => navigate(user ? "/admin" : "/login")}
                  className={`hidden sm:block transition-colors duration-300 ${
                    headerSolid ? "text-[#19110b] hover:text-[#c5a467]" : "text-white hover:text-[#c5a467]"
                  }`}
                  aria-label="Compte"
                >
                  <HiOutlineUser size={20} />
                </motion.button>

                {/* Logout (desktop, visible only when logged in) */}
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { logout(); navigate("/"); }}
                    className={`hidden sm:block text-[10px] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                      headerSolid ? "text-[#757575] hover:text-red-600" : "text-white/60 hover:text-red-400"
                    }`}
                  >
                    Déconnexion
                  </motion.button>
                )}

                {/* Cart */}
                <motion.button
                  whileHover={{ scale: 1.15, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  onClick={toggleCart}
                  className={`relative transition-colors duration-300 ${
                    headerSolid ? "text-[#19110b] hover:text-[#c5a467]" : "text-white hover:text-[#c5a467]"
                  }`}
                  aria-label="Panier"
                >
                  <HiOutlineShoppingBag size={20} />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        className="absolute -top-2 -right-2 bg-[#c5a467] text-white text-[8px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none shadow-sm"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CATEGORIES SUB-NAV BAR (fixed, scrollable) ── */}
        <motion.div
          initial={false}
          animate={{
            backgroundColor: headerSolid ? "rgba(250,249,247,0.98)" : "rgba(0,0,0,0.15)",
            backdropFilter: headerSolid ? "blur(12px)" : "blur(8px)",
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className={`w-full ${headerSolid ? "border-b border-[#e8e8e8]/60" : "border-b border-white/10"}`}
          style={{ WebkitBackdropFilter: "blur(12px)" }}
        >
          <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-10">
            <nav className="flex items-center justify-start lg:justify-center gap-0 overflow-x-auto scrollbar-hide">
              {categoriesConfig.map((cat) => (
                <motion.button
                  key={cat.slug}
                  whileHover={{ y: -1 }}
                  onClick={() => goToCategory(cat.slug)}
                  onMouseEnter={() => setActiveMenu(cat.slug)}
                  className={`group relative text-[9px] sm:text-[10px] lg:text-[11px] font-medium tracking-[0.14em] sm:tracking-[0.18em] uppercase transition-all duration-300 py-2.5 sm:py-3 px-2.5 sm:px-3 lg:px-4 whitespace-nowrap flex-shrink-0 ${
                    headerSolid
                      ? "text-[#19110b]/80 hover:text-[#19110b]"
                      : "text-white/80 hover:text-white"
                  } ${
                    activeMenu === cat.slug
                      ? headerSolid ? "!text-[#c5a467]" : "!text-[#c5a467]"
                      : ""
                  }`}
                >
                  {cat.label}
                  {/* Animated underline */}
                  <motion.span
                    className={`absolute bottom-1.5 left-3 right-3 h-[2px] rounded-full origin-left ${
                      headerSolid ? "bg-[#c5a467]" : "bg-[#c5a467]"
                    }`}
                    initial={false}
                    animate={{
                      scaleX: activeMenu === cat.slug ? 1 : 0,
                      opacity: activeMenu === cat.slug ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  />
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* ── MEGA MENU (desktop) ── */}
        <AnimatePresence>
          {activeMenu && activeCat && activeCat.subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="hidden lg:block absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border-t border-[#e8e8e8]/50 overflow-hidden"
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="max-w-[1400px] mx-auto px-10 py-10">
                <div className="grid grid-cols-3 gap-10">
                  {/* Subcategories list */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    <h3 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#c5a467] mb-6">
                      {activeCat.label}
                    </h3>
                    <ul className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                      {activeCat.subcategories.map((sub, i) => (
                        <motion.li
                          key={sub.slug}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * i + 0.15 }}
                        >
                          <button
                            onClick={() => goToSubcategory(activeCat.slug, sub.slug)}
                            className="group/link flex items-center gap-2 text-[13px] text-[#757575] hover:text-[#19110b] transition-all duration-300 font-light"
                          >
                            <span className="w-0 group-hover/link:w-3 h-[1px] bg-[#c5a467] transition-all duration-300" />
                            {sub.label}
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => goToCategory(activeCat.slug)}
                      className="mt-5 text-[10px] tracking-[0.15em] uppercase text-[#19110b] font-semibold hover:text-[#c5a467] transition-colors inline-flex items-center gap-2"
                    >
                      Voir tout
                      <HiOutlineChevronRight size={12} />
                    </motion.button>
                  </motion.div>

                  {/* Category image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="overflow-hidden rounded-sm"
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8 }}
                      src={activeCat.image}
                      alt={activeCat.label}
                      className="w-full h-[280px] object-cover"
                    />
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col justify-center"
                  >
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#c5a467] font-medium mb-3">
                      Nouveautés
                    </p>
                    <p className="text-[15px] text-[#19110b] font-light leading-relaxed mb-8">
                      Découvrez notre collection de{" "}
                      {activeCat.label.toLowerCase()} d'exception, alliant
                      savoir-faire africain et design contemporain.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => goToCategory(activeCat.slug)}
                      className="lv-btn self-start text-[10px]"
                    >
                      Voir la collection
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══ SEARCH OVERLAY ═══ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[110] bg-white flex flex-col"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="max-w-[800px] mx-auto w-full px-4 sm:px-6 pt-16 sm:pt-20"
            >
              <div className="flex items-center gap-4 border-b-2 border-[#19110b] pb-4">
                <HiOutlineSearch size={22} className="text-[#19110b]" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Que recherchez-vous ?"
                  className="flex-1 text-[18px] sm:text-[22px] text-[#19110b] font-light tracking-wide bg-transparent outline-none placeholder:text-[#c0c0c0]"
                />
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={closeSearch}
                  className="text-[#19110b] p-1"
                >
                  <HiOutlineX size={24} />
                </motion.button>
              </div>

              {/* Search results or popular searches */}
              <div className="mt-8">
                {!query.trim() ? (
                  <>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#757575] mb-4">
                      Recherches populaires
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["Africa Market Bags", "Accessoires", "Cadeaux", "Sandales", "Sac"].map((tag, i) => (
                        <motion.button
                          key={tag}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.06 }}
                          whileHover={{ scale: 1.05, backgroundColor: "#f6f5f3" }}
                          onClick={() => search(tag)}
                          className="text-[12px] text-[#19110b] border border-[#e8e8e8] px-5 py-2.5 transition-colors"
                        >
                          {tag}
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : searchLoading ? (
                  <div className="flex items-center gap-3 py-8">
                    <div className="w-5 h-5 border-2 border-[#e8e8e8] border-t-[#c5a467] rounded-full animate-spin" />
                    <span className="text-[12px] text-[#757575]">Recherche en cours...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#757575] mb-3">
                      {results.length} résultat{results.length !== 1 ? "s" : ""}
                    </p>
                    {results.map((product) => (
                      <motion.button
                        key={product.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          closeSearch();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-full flex items-center gap-4 py-3 px-2 hover:bg-[#f6f5f3] transition-colors"
                      >
                        <div className="w-12 h-16 sm:w-14 sm:h-18 bg-[#f6f5f3] overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575]">{product.category}</p>
                          <p className="text-[13px] text-[#19110b] font-normal truncate">{product.name}</p>
                          <p className="text-[12px] text-[#19110b] font-medium">{formatPrice(product.price)}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-[13px] text-[#757575] font-light">
                      Aucun résultat pour "<span className="text-[#19110b]">{query}</span>"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MOBILE MENU — multi-level ═══ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); }}
              className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[400px] z-[100] bg-white flex flex-col shadow-2xl"
            >
              {/* Menu header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#e8e8e8] shrink-0">
                {mobileSubMenu ? (
                  <motion.button
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    onClick={() => setMobileSubMenu(null)}
                    className="flex items-center gap-2 text-[13px] font-medium tracking-[0.15em] uppercase text-[#19110b]"
                  >
                    <HiOutlineArrowLeft size={18} />
                    Retour
                  </motion.button>
                ) : (
                  <span
                    className="text-[14px] font-medium tracking-[0.25em] uppercase text-[#19110b]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Menu
                  </span>
                )}
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); }}
                  className="p-1.5 text-[#19110b] hover:bg-[#f6f5f3] rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <HiOutlineX size={22} />
                </motion.button>
              </div>

              {/* Menu content */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {!mobileSubMenu ? (
                    <motion.nav
                      key="level1"
                      initial={{ x: 0, opacity: 1 }}
                      exit={{ x: -120, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 overflow-y-auto py-3"
                    >
                      {categoriesConfig.map((cat, i) => (
                        <motion.div
                          key={cat.slug}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <button
                            onClick={() => {
                              if (cat.subcategories.length > 0) {
                                setMobileSubMenu(cat);
                              } else {
                                goToCategory(cat.slug);
                              }
                            }}
                            className="w-full flex items-center justify-between px-5 py-4 text-[13px] font-medium tracking-[0.12em] uppercase text-[#19110b] border-b border-[#f0f0f0] hover:bg-[#faf9f7] hover:pl-6 transition-all duration-300"
                          >
                            {cat.label}
                            {cat.subcategories.length > 0 ? (
                              <HiOutlineChevronRight size={16} className="text-[#c5a467]" />
                            ) : (
                              <span className="text-[#c0c0c0] text-lg">&rsaquo;</span>
                            )}
                          </button>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <button
                          onClick={() => { setIsMobileMenuOpen(false); navigate("/admin"); }}
                          className="w-full flex items-center justify-between px-5 py-4 text-[13px] font-medium tracking-[0.12em] uppercase text-[#c5a467] border-b border-[#f0f0f0] hover:bg-[#faf9f7] hover:pl-6 transition-all duration-300"
                        >
                          Dashboard
                          <span className="text-[#c0c0c0] text-lg">&rsaquo;</span>
                        </button>
                      </motion.div>
                    </motion.nav>
                  ) : (
                    <motion.nav
                      key="level2"
                      initial={{ x: 120, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 120, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 overflow-y-auto py-3"
                    >
                      <div className="px-5 py-4 border-b border-[#f0f0f0]">
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="aspect-[16/9] overflow-hidden rounded-sm mb-3"
                        >
                          <img
                            src={mobileSubMenu.image}
                            alt={mobileSubMenu.label}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <h3
                          className="text-[14px] font-medium tracking-[0.15em] uppercase text-[#19110b]"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {mobileSubMenu.label}
                        </h3>
                      </div>

                      <button
                        onClick={() => goToCategory(mobileSubMenu.slug)}
                        className="w-full flex items-center justify-between px-5 py-4 text-[13px] font-medium tracking-[0.12em] uppercase text-[#c5a467] border-b border-[#f0f0f0] hover:bg-[#faf9f7] transition-colors"
                      >
                        Voir toute la collection
                        <HiOutlineChevronRight size={14} />
                      </button>

                      {mobileSubMenu.subcategories.map((sub, i) => (
                        <motion.div
                          key={sub.slug}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                        >
                          <button
                            onClick={() => goToSubcategory(mobileSubMenu.slug, sub.slug)}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-[13px] font-light tracking-[0.06em] text-[#19110b] border-b border-[#f0f0f0] hover:bg-[#faf9f7] hover:pl-6 transition-all duration-300"
                          >
                            {sub.label}
                            <span className="text-[#c0c0c0] text-lg">&rsaquo;</span>
                          </button>
                        </motion.div>
                      ))}
                    </motion.nav>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom */}
              <div className="border-t border-[#e8e8e8] px-5 py-5 space-y-3.5 shrink-0 bg-[#faf9f7]">
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); setSearchOpen(true); }}
                  className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] w-full transition-colors"
                >
                  <HiOutlineSearch size={17} /> Rechercher
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); setCameraOpen(true); }}
                  className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] w-full transition-colors"
                >
                  <HiOutlineCamera size={17} /> Recherche Camera
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); toggleWishlist(); }}
                  className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] w-full transition-colors"
                >
                  <HiOutlineHeart size={17} /> Favoris {wishlistCount > 0 && `(${wishlistCount})`}
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); navigate("/admin"); }}
                      className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] w-full transition-colors"
                    >
                      <HiOutlineUser size={17} /> {user.name}
                    </button>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); logout(); navigate("/"); }}
                      className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-red-500 hover:text-red-700 w-full transition-colors"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setMobileSubMenu(null); navigate("/login"); }}
                    className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] w-full transition-colors"
                  >
                    <HiOutlineUser size={17} /> Se connecter
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ CONTACT PANEL ═══ */}
      <ContactPanel isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      {/* ═══ CAMERA SEARCH ═══ */}
      <Suspense fallback={null}>
        <CameraSearch isOpen={cameraOpen} onClose={() => setCameraOpen(false)} />
      </Suspense>
    </>
  );
};

export default Header;
