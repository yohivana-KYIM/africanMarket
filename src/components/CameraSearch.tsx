import { useEffect, useState, type FC } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiOutlineX, HiOutlineRefresh } from "react-icons/hi";
import { useCameraSearch } from "../hooks/useCameraSearch";
import type { LoadingStage, AnalyzingStage } from "../hooks/useCameraSearch";
import { formatPrice } from "../data/products";

/* ─────────────────── CONSTANTS ─────────────────── */

const LV_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const GOLD = "#c5a467";

const LOADING_STAGE_LABELS: Record<LoadingStage, string> = {
  init: "Initialisation...",
  tensorflow: "Chargement TensorFlow...",
  model: "Telechargement du modele IA...",
  camera: "Activation de la camera...",
  ready: "Pret !",
};

const ANALYZING_STAGE_LABELS: Record<AnalyzingStage, string> = {
  capturing: "Capture de l'image...",
  detecting: "Detection des objets...",
  classifying: "Classification en cours...",
  searching: "Recherche de produits...",
};

/* ─────────────────── VARIANTS ─────────────────── */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: LV_EASE } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: LV_EASE } },
};

const stateVariants: Variants = {
  enter: { opacity: 0, scale: 0.96, y: 20 },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: LV_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -10,
    transition: { duration: 0.3, ease: LV_EASE },
  },
};

const ringVariants = (delay: number): Variants => ({
  animate: {
    scale: [1, 1.8, 2.2],
    opacity: [0.6, 0.2, 0],
    transition: {
      duration: 2.4,
      repeat: Infinity,
      delay,
      ease: LV_EASE,
    },
  },
});

const scanLineVariants: Variants = {
  animate: {
    y: ["0%", "100%", "0%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const cornerVariants: Variants = {
  animate: {
    boxShadow: [
      `0 0 4px ${GOLD}40`,
      `0 0 12px ${GOLD}80`,
      `0 0 4px ${GOLD}40`,
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: LV_EASE,
    },
  },
};

const captureRingVariants: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.8, 0.4, 0.8],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      ease: LV_EASE,
    },
  },
};

const shutterFlashVariants: Variants = {
  initial: { opacity: 0 },
  flash: {
    opacity: [0, 1, 0],
    transition: { duration: 0.4, times: [0, 0.15, 1], ease: LV_EASE },
  },
};

const capturedImageVariants: Variants = {
  initial: { scale: 1.4, opacity: 0, borderRadius: "0px" },
  animate: {
    scale: 1,
    opacity: 1,
    borderRadius: "12px",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const analyzingRingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const resultsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.08,
    },
  },
};

const resultItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: LV_EASE },
  },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 15 },
  },
};

const errorShakeVariants: Variants = {
  initial: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

const errorPulseVariants: Variants = {
  animate: {
    borderColor: ["rgba(239,68,68,0.3)", "rgba(239,68,68,0.7)", "rgba(239,68,68,0.3)"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: LV_EASE,
    },
  },
};

const particleBurstVariants = (i: number): Variants => {
  const angle = (i / 8) * Math.PI * 2;
  const x = Math.cos(angle) * 60;
  const y = Math.sin(angle) * 60;
  return {
    initial: { x: 0, y: 0, opacity: 1, scale: 1 },
    animate: {
      x,
      y,
      opacity: 0,
      scale: 0,
      transition: { duration: 0.7, ease: LV_EASE },
    },
  };
};

/* ─────────────────── COMPONENT ─────────────────── */

interface CameraSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const CameraSearch: FC<CameraSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    state,
    error,
    loadingStage,
    analyzingStage,
    detectedCategories,
    activeSearchTerm,
    results,
    searchLoading,
    capturedImage,
    videoRef,
    connectVideoRef,
    canvasRef,
    open,
    capture,
    retake,
    close,
    searchProducts,
  } = useCameraSearch();

  const [showFlash, setShowFlash] = useState(false);
  const [showParticleBurst, setShowParticleBurst] = useState(false);

  useEffect(() => {
    if (isOpen && state === "idle") {
      open();
    }
    if (!isOpen && state !== "idle") {
      close();
    }
  }, [isOpen, state, open, close]);

  // Trigger flash on capture
  useEffect(() => {
    if (state === "capturing") {
      setShowFlash(true);
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(50);
      const t = setTimeout(() => setShowFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [state]);

  // Trigger particle burst on results
  useEffect(() => {
    if (state === "results" && detectedCategories.length > 0) {
      setShowParticleBurst(true);
      const t = setTimeout(() => setShowParticleBurst(false), 800);
      return () => clearTimeout(t);
    }
  }, [state, detectedCategories]);

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
        key="camera-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[120] bg-[#19110b] flex flex-col"
      >
        {/* Shutter flash overlay */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              key="shutter-flash"
              variants={shutterFlashVariants}
              initial="initial"
              animate="flash"
              className="fixed inset-0 z-[130] bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

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

          <AnimatePresence mode="wait">
            {/* ── LOADING MODEL ── */}
            {state === "loading-model" && (
              <motion.div
                key="loading"
                variants={stateVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center justify-center h-full px-6 text-center"
                style={{
                  backgroundImage: `radial-gradient(${GOLD}15 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              >
                {/* Concentric pulsing rings */}
                <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                  {[0, 0.5, 1, 1.5].map((delay, i) => (
                    <motion.div
                      key={i}
                      variants={ringVariants(delay)}
                      animate="animate"
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: GOLD }}
                    />
                  ))}
                  {/* Central pulsing dot */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: LV_EASE }}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: GOLD }}
                  />
                </div>

                {/* Animated stage text */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: LV_EASE }}
                    className="text-[14px] text-white font-light tracking-wide mb-2"
                  >
                    {LOADING_STAGE_LABELS[loadingStage]}
                  </motion.p>
                </AnimatePresence>

                <p className="text-[11px] text-white/40">
                  Premiere utilisation : chargement du modele IA
                </p>
              </motion.div>
            )}

            {/* ── VIEWFINDER ── */}
            {state === "viewfinder" && (
              <motion.div
                key="viewfinder"
                variants={stateVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="relative w-full max-w-[480px] mx-auto aspect-[3/4] sm:aspect-[4/3]">
                  <video
                    ref={connectVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Radial vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
                    }}
                  />

                  {/* Viewfinder frame overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Darkened edges */}
                    <div className="absolute inset-0 border-[40px] sm:border-[60px] border-black/40" />

                    {/* Animated gold corners with glow */}
                    <motion.div
                      variants={cornerVariants}
                      animate="animate"
                      className="absolute top-8 left-8 sm:top-12 sm:left-12 w-8 h-8 border-t-2 border-l-2"
                      style={{ borderColor: GOLD }}
                    />
                    <motion.div
                      variants={cornerVariants}
                      animate="animate"
                      className="absolute top-8 right-8 sm:top-12 sm:right-12 w-8 h-8 border-t-2 border-r-2"
                      style={{ borderColor: GOLD }}
                    />
                    <motion.div
                      variants={cornerVariants}
                      animate="animate"
                      className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 w-8 h-8 border-b-2 border-l-2"
                      style={{ borderColor: GOLD }}
                    />
                    <motion.div
                      variants={cornerVariants}
                      animate="animate"
                      className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 w-8 h-8 border-b-2 border-r-2"
                      style={{ borderColor: GOLD }}
                    />

                    {/* Horizontal scan line */}
                    <motion.div
                      variants={scanLineVariants}
                      animate="animate"
                      className="absolute left-10 right-10 sm:left-14 sm:right-14 h-[1px]"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${GOLD}80, transparent)`,
                        top: "10%",
                      }}
                    />
                  </div>

                  {/* Ready indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                    className="absolute top-12 sm:top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-white/90 tracking-[0.1em] uppercase font-medium">
                      Pret
                    </span>
                  </motion.div>

                  {/* Guide text */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute bottom-16 sm:bottom-20 left-0 right-0 text-center"
                  >
                    <p className="text-[11px] text-white/80 tracking-[0.1em] font-light drop-shadow-md">
                      Centrez l'objet dans le cadre
                    </p>
                  </motion.div>
                </div>

                {/* Capture button with pulsing ring */}
                <div className="relative mt-6">
                  <motion.div
                    variants={captureRingVariants}
                    animate="animate"
                    className="absolute inset-[-6px] rounded-full border-2"
                    style={{ borderColor: GOLD }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={capture}
                    className="relative w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
                    aria-label="Capturer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── CAPTURING / ANALYZING ── */}
            {state === "capturing" && (
              <motion.div
                key="capturing"
                variants={stateVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col items-center justify-center h-full px-6"
              >
                {capturedImage && (
                  <div className="relative mb-8">
                    {/* Rotating gold ring */}
                    <motion.div
                      variants={analyzingRingVariants}
                      animate="animate"
                      className="absolute inset-[-6px] rounded-xl border-2 border-transparent"
                      style={{
                        borderImage: `conic-gradient(${GOLD}, transparent 30%, ${GOLD}) 1`,
                      }}
                    />
                    <motion.div
                      variants={capturedImageVariants}
                      initial="initial"
                      animate="animate"
                      className="w-32 h-32 overflow-hidden border-2 border-white/20"
                      style={{ borderRadius: 12 }}
                    >
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </div>
                )}

                {/* Animated wave dots */}
                <div className="flex gap-2 mb-5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -8, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.15,
                        ease: LV_EASE,
                      }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: GOLD }}
                    />
                  ))}
                </div>

                {/* Animated analyzing stage text */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={analyzingStage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: LV_EASE }}
                    className="text-[13px] text-white font-light tracking-wide"
                  >
                    {ANALYZING_STAGE_LABELS[analyzingStage]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── RESULTS ── */}
            {state === "results" && (
              <motion.div
                key="results"
                variants={stateVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="px-4 sm:px-6 py-6 max-w-[800px] mx-auto w-full relative"
              >
                {/* Particle burst */}
                {showParticleBurst && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        variants={particleBurstVariants(i)}
                        initial="initial"
                        animate="animate"
                        className="absolute w-2 h-2 rounded-full"
                        style={{ backgroundColor: GOLD }}
                      />
                    ))}
                  </div>
                )}

                {/* Captured image + retake */}
                <motion.div
                  variants={resultsContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={resultItemVariants} className="flex items-center gap-4 mb-5">
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
                  </motion.div>

                  {/* Category chips */}
                  <motion.div variants={resultItemVariants} className="flex flex-wrap gap-2 mb-6">
                    {detectedCategories.map((cat) => (
                      <motion.button
                        key={cat.searchTerm}
                        variants={chipVariants}
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
                  </motion.div>

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
                      <motion.p
                        variants={resultItemVariants}
                        className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-3"
                      >
                        {results.length} resultat{results.length !== 1 ? "s" : ""}{" "}
                        pour "{activeSearchTerm}"
                      </motion.p>
                      {results.map((product) => (
                        <motion.button
                          key={product.id}
                          variants={resultItemVariants}
                          onClick={() => handleProductClick(product.id)}
                          className="relative w-full flex items-center gap-4 py-3 px-2 hover:bg-white/5 transition-colors rounded group overflow-hidden"
                        >
                          {/* Gold accent on hover */}
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-[3px] origin-top"
                            style={{ backgroundColor: GOLD }}
                            initial={{ scaleY: 0 }}
                            whileHover={{ scaleY: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          />
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
                    <motion.div
                      variants={errorShakeVariants}
                      initial="initial"
                      animate="shake"
                      className="py-8 text-center"
                    >
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
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* ── ERROR ── */}
            {state === "error" && (
              <motion.div
                key="error"
                variants={stateVariants}
                initial="enter"
                animate="center"
                exit="exit"
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
                <motion.div
                  variants={errorShakeVariants}
                  initial="initial"
                  animate="shake"
                >
                  <motion.div
                    variants={errorPulseVariants}
                    animate="animate"
                    className="bg-red-500/10 border border-red-500/30 rounded-lg px-5 py-4 mb-6 max-w-[400px]"
                  >
                    <p className="text-[13px] text-red-300 font-light">{error}</p>
                  </motion.div>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={retake}
                  className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#c5a467] border border-[#c5a467]/40 px-5 py-2.5 hover:bg-[#c5a467]/10 transition-colors"
                >
                  <HiOutlineRefresh size={14} />
                  Reessayer
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraSearch;
