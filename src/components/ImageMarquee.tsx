import { type FC } from "react";
import { motion } from "framer-motion";

interface ImageMarqueeProps {
  images: { src: string; alt: string }[];
  speed?: number;
  direction?: "left" | "right";
  height?: string;
}

const ImageMarquee: FC<ImageMarqueeProps> = ({
  images,
  speed = 35,
  direction = "left",
  height = "h-[260px] sm:h-[320px] lg:h-[380px]",
}) => {
  const animationName =
    direction === "left" ? "marquee-scroll-left" : "marquee-scroll-right";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-hidden group"
    >
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      {/* Scrolling track — duplicate images for seamless loop */}
      <div
        className="flex gap-3 sm:gap-4 group-hover:[animation-play-state:paused]"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {[...images, ...images].map((img, i) => (
          <div
            key={`${img.alt}-${i}`}
            className={`${height} aspect-[4/5] flex-shrink-0 overflow-hidden`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.05]"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ImageMarquee;
