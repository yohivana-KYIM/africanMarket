import { useState, useEffect, useRef, type FC } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useSlides, fallbackSlides } from "../hooks/useSlides";
import type { Slide, SlideTransition } from "../types";

const mediaVariants: Record<SlideTransition, Variants> = {
  fade: {
    initial: { opacity: 0, scale: 1.08 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 1, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 1, x: "-30%" },
  },
  zoom: {
    initial: { opacity: 0, scale: 1.35 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },
};

export const SlideMedia: FC<{ slide: Slide }> = ({ slide }) =>
  slide.mediaType === "video" ? (
    <video
      key={slide.media}
      src={slide.media}
      poster={slide.poster || undefined}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  ) : (
    <div
      className="absolute inset-0 bg-cover bg-center will-change-transform"
      style={{ backgroundImage: `url("${slide.media}")` }}
    />
  );

const HeroSlider: FC = () => {
  const { slides: remote, loading, fromServer } = useSlides();
  // Tant que le serveur n'a pas répondu (ou n'a aucun slide), on garde les visuels d'origine
  const slides = fromServer && remote.length > 0 ? remote : loading ? [] : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const touchX = useRef<number | null>(null);

  const index = slides.length > 0 ? current % slides.length : 0;
  const slide = slides[index];
  const duration = slide?.duration ?? 8;

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setTimeout(() => setCurrent((p) => (p + 1) % slides.length), duration * 1000);
    return () => clearTimeout(timer);
  }, [index, duration, slides.length]);

  if (!slide) {
    return <section className="relative w-full h-[100svh] min-h-[500px] bg-[#19110b]" />;
  }

  const variants = mediaVariants[slide.transition] || mediaVariants.fade;
  const go = (i: number) => setCurrent((i + slides.length) % slides.length);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || slides.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      className="relative w-full h-[100svh] min-h-[500px] overflow-hidden bg-[#19110b]"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: slide.transition === "none" ? 0 : 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <SlideMedia slide={slide} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-24 lg:pb-32 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="max-w-lg lg:max-w-xl"
            >
              {slide.eyebrow && (
                <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/70 font-light mb-3 sm:mb-4">
                  {slide.eyebrow}
                </p>
              )}
              {slide.title && (
                <h2
                  className="text-[28px] sm:text-[34px] lg:text-[48px] text-white font-light leading-[1.1] tracking-wide mb-4 sm:mb-5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {slide.title}
                </h2>
              )}
              {slide.subtitle && (
                <p className="text-[13px] sm:text-[14px] text-white/80 font-light tracking-wide mb-6 sm:mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
              )}
              {slide.cta && (
                <a href={slide.link || "#produits"} className="lv-btn lv-btn-white text-[10px] sm:text-[11px] pointer-events-auto">
                  {slide.cta}
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-4">
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => go(i)} className="group relative h-8 flex items-center" aria-label={`Slide ${i + 1}`}>
              <span className="block w-6 sm:w-8 h-[1px] bg-white/30 relative overflow-hidden">
                {i === index && (
                  <motion.span
                    key={`${s.id}-${duration}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlider;
