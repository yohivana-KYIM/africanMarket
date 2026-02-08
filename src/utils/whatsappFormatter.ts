import type { CartItem } from "../types";
import { formatPrice } from "../data/products";

export const formatWhatsAppMessage = (
  cartItems: CartItem[],
  customerName: string,
  city: string
): string => {
  const lines: string[] = [
    "🛒 NOUVEAU PANIER - Africa Market",
    "",
    `👤 Client : ${customerName}`,
    "📦 Articles :",
  ];

  let total = 0;
  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    lines.push(`• ${item.name} x${item.quantity} - ${formatPrice(itemTotal)}`);
  });

  lines.push("");
  lines.push(`💰 TOTAL : ${formatPrice(total)}`);
  lines.push(`📍 Livraison : ${city}`);

  return lines.join("\n");
};

export const sendWhatsApp = (
  message: string,
  phoneNumber: string = "237651711545"
): void => {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
};