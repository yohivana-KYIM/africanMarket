import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineShoppingBag } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import type { Product } from "../types";
import { formatPrice } from "../data/products";

interface WishlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  removeFromWishlist: (productId: string) => void;
  addToCart: (product: Product) => void;
}

const WishlistPanel: FC<WishlistPanelProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  removeFromWishlist,
  addToCart,
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[70]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-[420px] bg-white z-[80] flex flex-col shadow-[-8px_0_40px_rgba(0,0,0,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 border-b border-[#e8e8e8] flex-shrink-0">
              <h2 className="text-[11px] sm:text-[12px] font-medium tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[#19110b]">
                Vos Favoris ({wishlistItems.length})
              </h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                className="p-1 text-[#19110b] hover:text-[#757575] transition-colors"
                aria-label="Fermer"
              >
                <HiOutlineX size={20} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6">
                  <p className="text-[14px] text-[#19110b] font-light tracking-[0.05em] mb-2">
                    Votre liste de souhaits est vide
                  </p>
                  <p className="text-[12px] text-[#757575] font-light">
                    Explorez nos collections et ajoutez vos coups de coeur
                  </p>
                </div>
              ) : (
                <div>
                  {wishlistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#e8e8e8]"
                    >
                      <div
                        onClick={() => {
                          onClose();
                          navigate(`/product/${item.id}`);
                        }}
                        className="w-[75px] h-[95px] sm:w-[90px] sm:h-[110px] bg-[#f6f5f3] flex-shrink-0 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">
                          {item.category}
                        </p>
                        <h3
                          onClick={() => {
                            onClose();
                            navigate(`/product/${item.id}`);
                          }}
                          className="text-[12px] sm:text-[13px] text-[#19110b] font-normal truncate mb-1 cursor-pointer hover:underline underline-offset-4"
                        >
                          {item.name}
                        </h3>
                        <p className="text-[12px] sm:text-[13px] text-[#19110b] font-medium mb-2 sm:mb-3">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-auto">
                          <button
                            onClick={() => addToCart(item)}
                            className="flex-1 bg-[#19110b] text-white text-[9px] tracking-[0.15em] uppercase py-2 flex items-center justify-center gap-1.5 hover:bg-[#2a1f14] transition-colors"
                          >
                            <HiOutlineShoppingBag size={12} />
                            Au panier
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-[#757575] hover:text-[#19110b] transition-colors p-1.5"
                            aria-label="Supprimer"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistPanel;
