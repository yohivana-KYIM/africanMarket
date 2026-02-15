import { type FC, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineShoppingBag, HiOutlineHeart, HiHeart } from "react-icons/hi";
import type { Product } from "../types";
import { formatPrice } from "../data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
  index?: number;
}

const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, isInWishlist, index = 0 }) => {
  const navigate = useNavigate();
  const hasSizes = product.sizes && product.sizes.length > 0;

  // Multi-image support
  const images = product.images && product.images.length > 1 ? product.images : [product.image];
  const hasMultiple = images.length > 1;
  const [currentImg, setCurrentImg] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImg((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, [hasMultiple, nextImage]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSizes) {
      navigate(`/product/${product.id}`);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative overflow-hidden bg-[#f6f5f3] aspect-[3/4]"
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${product.name}${hasMultiple ? ` - ${i + 1}` : ""}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06] ${
              i === currentImg ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? undefined : "lazy"}
          />
        ))}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700 pointer-events-none" />

        {/* Image dots indicator */}
        {hasMultiple && (
          <div className="absolute bottom-14 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImg ? "bg-white scale-110" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist heart */}
        {onToggleWishlist && (
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center transition-colors z-10 hover:bg-white"
            aria-label={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {isInWishlist ? (
              <HiHeart size={16} className="text-[#c5a467]" />
            ) : (
              <HiOutlineHeart size={16} className="text-[#19110b]" />
            )}
          </motion.button>
        )}

        {/* Add to cart — slides up on hover (hidden on touch) */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hidden sm:block">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#19110b]/90 backdrop-blur-sm text-white text-[10px] font-medium tracking-[0.2em] uppercase py-3.5 sm:py-4 flex items-center justify-center gap-2 hover:bg-[#19110b] transition-colors"
          >
            <HiOutlineShoppingBag size={14} />
            {hasSizes ? "Voir les tailles" : "Ajouter au panier"}
          </button>
        </div>

        {/* Mobile: always-visible add button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleAddToCart}
          className="sm:hidden absolute bottom-3 right-3 bg-[#19110b]/90 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          aria-label={hasSizes ? "Voir les tailles" : "Ajouter au panier"}
        >
          <HiOutlineShoppingBag size={16} />
        </motion.button>

        {/* Discount badge */}
        {product.discount && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] sm:text-[10px] tracking-[0.15em] uppercase font-medium text-[#19110b] bg-white/90 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5"
          >
            -{product.discount}%
          </motion.span>
        )}
      </motion.div>

      {/* Product info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
        className="pt-3 sm:pt-4 pb-2"
      >
        <p className="text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#757575] font-light mb-1">
          {product.category}
        </p>
        <h3 className="text-[12px] sm:text-[13px] md:text-[14px] text-[#19110b] font-normal leading-snug tracking-[0.02em] mb-1.5 sm:mb-2 group-hover:underline underline-offset-4 decoration-[0.5px]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="text-[12px] sm:text-[13px] text-[#19110b] font-normal tracking-[0.03em]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] sm:text-[12px] text-[#757575] line-through font-light">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
