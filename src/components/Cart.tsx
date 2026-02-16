import { useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiPlus, HiMinus } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi2";
import type { CartItem } from "../types";
import { formatPrice } from "../data/products";
import WhatsAppSubmit from "./WhatsAppSubmit";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
}

const Cart: FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  updateQuantity,
  removeFromCart,
  clearCart,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);

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

          {/* Cart panel — full width on mobile, max-w on desktop */}
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
                Votre Sélection ({cartItems.length})
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
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6">
                  <p className="text-[14px] text-[#19110b] font-light tracking-[0.05em] mb-2">
                    Votre panier est vide
                  </p>
                  <p className="text-[12px] text-[#757575] font-light">
                    Découvrez nos collections
                  </p>
                </div>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.id}_${item.size || ""}`}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#e8e8e8]"
                    >
                      <div className="w-[75px] h-[95px] sm:w-[90px] sm:h-[110px] bg-[#f6f5f3] flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <p className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-0.5">
                          {item.category}
                        </p>
                        <h3 className="text-[12px] sm:text-[13px] text-[#19110b] font-normal truncate mb-1">
                          {item.name}
                          {item.size && (
                            <span className="text-[10px] text-[#757575] ml-1.5">— {item.sizeType === 'pointure' ? 'Pointure' : 'Taille'} {item.size}</span>
                          )}
                        </h3>
                        <p className="text-[12px] sm:text-[13px] text-[#19110b] font-medium mb-2 sm:mb-3">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-[#e8e8e8]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#757575] hover:text-[#19110b] transition-colors"
                            >
                              <HiMinus size={10} />
                            </button>
                            <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[11px] sm:text-[12px] text-[#19110b] font-medium border-x border-[#e8e8e8]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#757575] hover:text-[#19110b] transition-colors"
                            >
                              <HiPlus size={10} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-[#757575] hover:text-[#19110b] transition-colors p-1"
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

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-[#e8e8e8] flex-shrink-0">
                {!showCheckout ? (
                  <div className="px-4 sm:px-6 py-4 sm:py-5">
                    {cartTotal >= 50000 && (
                      <p className="text-[10px] tracking-[0.15em] uppercase text-[#6b4c3b] text-center mb-3">
                        Livraison offerte
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <span className="text-[11px] sm:text-[12px] tracking-[0.1em] uppercase text-[#757575]">
                        Total
                      </span>
                      <span className="text-[14px] sm:text-[15px] text-[#19110b] font-medium tracking-[0.03em]">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="lv-btn lv-btn-filled w-full text-[10px] mb-2"
                    >
                      Finaliser via WhatsApp
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full text-[10px] tracking-[0.15em] uppercase text-[#757575] hover:text-[#19110b] py-2 transition-colors"
                    >
                      Vider le panier
                    </button>
                  </div>
                ) : (
                  <div className="px-4 sm:px-6 py-4 sm:py-5">
                    <WhatsAppSubmit
                      cartItems={cartItems}
                      cartTotal={cartTotal}
                      onBack={() => setShowCheckout(false)}
                      onSuccess={() => {
                        clearCart();
                        onClose();
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;