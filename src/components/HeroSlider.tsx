import { useState, useEffect, useCallback, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "../data/products";

const HeroSlider: FC = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <section className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-[#19110b]">
      {/* Background image — Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlides[current].id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${heroSlides[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content — bottom-left editorial (LV) */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-24 lg:pb-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlides[current].id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="max-w-lg lg:max-w-xl"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/70 font-light mb-3 sm:mb-4"
              >
                Collection Exclusive
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-[28px] sm:text-[34px] lg:text-[48px] text-white font-light leading-[1.1] tracking-wide mb-4 sm:mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {heroSlides[current].title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-[13px] sm:text-[14px] text-white/80 font-light tracking-wide mb-6 sm:mb-8 leading-relaxed"
              >
                {heroSlides[current].subtitle}
              </motion.p>
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                href="#produits"
                className="lv-btn lv-btn-white text-[10px] sm:text-[11px]"
              >
                {heroSlides[current].cta}
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide progress indicators */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative h-8 flex items-center"
            aria-label={`Slide ${index + 1}`}
          >
            <span className="block w-6 sm:w-8 h-[1px] bg-white/30 relative overflow-hidden">
              {index === current && (
                <motion.span
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "linear" }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Scroll text */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden sm:block">
        <motion.p
          className="text-[9px] tracking-[0.3em] uppercase text-white/40"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          Scroll
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSlider;