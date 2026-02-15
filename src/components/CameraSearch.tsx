import { useEffect, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineX, HiOutlineRefresh } from "react-icons/hi";
import { useCameraSearch } from "../hooks/useCameraSearch";
import { formatPrice } from "../data/products";

interface CameraSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CameraSearch: FC<CameraSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    state,
    error,
    detectedCategories,
    activeSearchTerm,
    results,
    searchLoading,
    capturedImage,
    videoRef,
    canvasRef,
    open,
    capture,
    retake,
    close,
    searchProducts,
  } = useCameraSearch();

  useEffect(() => {
    if (isOpen && state === "idle") {
      open();
    }
    if (!isOpen && state !== "idle") {
      close();
    }
  }, [isOpen, state, open, close]);

  const handleClose = () => {
    close();
    onClose();
  };

  const handleProductClick = (productId: string) => {
    handleClose();
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[120] bg-[#19110b] flex flex-col"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 shrink-0 bg-black/30 backdrop-blur-sm z-10">
          <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/80">
            Recherche Camera
          </span>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="text-white p-1.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <HiOutlineX size={24} />
          </motion.button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto relative">
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* ── LOADING MODEL ── */}
          {state === "loading-model" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full px-6 text-center"
            >
              <div className="w-12 h-12 border-3 border-white/20 border-t-[#c5a467] rounded-full animate-spin mb-6" />
              <p className="text-[14px] text-white font-light tracking-wide mb-2">
                Chargement du modele de reconnaissance...
              </p>
              <p className="text-[11px] text-white/40">
                Premiere utilisation : environ 10 secondes
              </p>
            </motion.div>
          )}

          {/* ── VIEWFINDER ── */}
          {state === "viewfinder" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-full max-w-[480px] mx-auto aspect-[3/4] sm:aspect-[4/3]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder frame overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Darkened edges */}
                  <div className="absolute inset-0 border-[40px] sm:border-[60px] border-black/40" />
                  {/* Corner decorations */}
                  <div className="absolute top-8 left-8 sm:top-12 sm:left-12 w-8 h-8 border-t-2 border-l-2 border-[#c5a467]" />
                  <div className="absolute top-8 right-8 sm:top-12 sm:right-12 w-8 h-8 border-t-2 border-r-2 border-[#c5a467]" />
                  <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 w-8 h-8 border-b-2 border-l-2 border-[#c5a467]" />
                  <div className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 w-8 h-8 border-b-2 border-r-2 border-[#c5a467]" />
                </div>
                {/* Guide text */}
                <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 text-center">
                  <p className="text-[11px] text-white/80 tracking-[0.1em] font-light drop-shadow-md">
                    Centrez l'objet dans le cadre
                  </p>
                </div>
              </div>

              {/* Capture button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={capture}
                className="mt-6 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
                aria-label="Capturer"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </motion.button>
            </div>
          )}

          {/* ── CAPTURING ── */}
          {state === "capturing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full px-6"
            >
              {capturedImage && (
                <div className="w-32 h-32 rounded-lg overflow-hidden mb-6 border-2 border-white/20">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="w-8 h-8 border-3 border-white/20 border-t-[#c5a467] rounded-full animate-spin mb-4" />
              <p className="text-[13px] text-white font-light tracking-wide">
                Analyse en cours...
              </p>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {state === "results" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="px-4 sm:px-6 py-6 max-w-[800px] mx-auto w-full"
            >
              {/* Captured image + retake */}
              <div className="flex items-center gap-4 mb-5">
                {capturedImage && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20 shrink-0">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1">
                    Objets detectes
                  </p>
                  <p className="text-[13px] text-white font-light truncate">
                    {detectedCategories.map((c) => c.searchTerm).join(", ")}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={retake}
                  className="flex items-center gap-1.5 text-[10px] tracking-[0.1em] uppercase text-[#c5a467] border border-[#c5a467]/40 px-3 py-2 hover:bg-[#c5a467]/10 transition-colors shrink-0"
                >
                  <HiOutlineRefresh size={14} />
                  Reprendre
                </motion.button>
              </div>

              {/* Category chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {detectedCategories.map((cat) => (
                  <motion.button
                    key={cat.searchTerm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => searchProducts(cat.searchTerm)}
                    className={`text-[11px] px-3 py-1.5 border transition-all duration-200 ${
                      activeSearchTerm === cat.searchTerm
                        ? "bg-[#c5a467] border-[#c5a467] text-white"
                        : "border-white/20 text-white/70 hover:border-white/40"
                    }`}
                  >
                    {cat.searchTerm}{" "}
                    <span className="opacity-50">{cat.confidence}%</span>
                  </motion.button>
                ))}
              </div>

              {/* Results list */}
              {searchLoading ? (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-[#c5a467] rounded-full animate-spin" />
                  <span className="text-[12px] text-white/60">
                    Recherche en cours...
                  </span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3">
                    {results.length} resultat{results.length !== 1 ? "s" : ""}{" "}
                    pour "{activeSearchTerm}"
                  </p>
                  {results.map((product) => (
                    <motion.button
                      key={product.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full flex items-center gap-4 py-3 px-2 hover:bg-white/5 transition-colors rounded"
                    >
                      <div className="w-12 h-16 sm:w-14 sm:h-18 bg-white/10 overflow-hidden shrink-0 rounded">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[#c5a467]">
                          {product.category}
                        </p>
                        <p className="text-[13px] text-white font-light truncate">
                          {product.name}
                        </p>
                        <p className="text-[12px] text-white/80 font-medium">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[13px] text-white/60 font-light mb-4">
                    Aucun produit trouve pour "
                    <span className="text-white">{activeSearchTerm}</span>"
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retake}
                    className="text-[11px] tracking-[0.1em] uppercase text-[#c5a467] border border-[#c5a467]/40 px-4 py-2.5 hover:bg-[#c5a467]/10 transition-colors"
                  >
                    Reessayer
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── ERROR ── */}
          {state === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full px-6 text-center"
            >
              {capturedImage && (
                <div className="w-24 h-24 rounded-lg overflow-hidden mb-6 border-2 border-white/10">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-5 py-4 mb-6 max-w-[400px]">
                <p className="text-[13px] text-red-300 font-light">{error}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retake}
                className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#c5a467] border border-[#c5a467]/40 px-5 py-2.5 hover:bg-[#c5a467]/10 transition-colors"
              >
                <HiOutlineRefresh size={14} />
                Reessayer
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraSearch;
