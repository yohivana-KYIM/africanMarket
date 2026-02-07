import { useState, type FC, type FormEvent } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import type { CartItem } from "../types";
import { formatWhatsAppMessage, sendWhatsApp } from "../utils/whatsappFormatter";
import { formatPrice } from "../data/products";

interface WhatsAppSubmitProps {
  cartItems: CartItem[];
  cartTotal: number;
  onBack: () => void;
  onSuccess: () => void;
}

const cities: string[] = [
  "Douala",
  "Yaoundé",
  "Bafoussam",
  "Bamenda",
  "Garoua",
  "Maroua",
  "Ngaoundéré",
  "Bertoua",
  "Kribi",
  "Limbe",
];

const WhatsAppSubmit: FC<WhatsAppSubmitProps> = ({
  cartItems,
  cartTotal,
  onBack,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = formatWhatsAppMessage(cartItems, name, city);
    sendWhatsApp(message);
    onSuccess();
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-[#757575] hover:text-[#19110b] transition-colors mb-4 sm:mb-5"
      >
        <HiArrowLeft size={14} />
        Retour
      </button>

      <div className="text-center mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-[#e8e8e8]">
        <p className="text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-1">
          Total de votre commande
        </p>
        <p className="text-[16px] sm:text-[18px] text-[#19110b] font-medium tracking-[0.03em]">
          {formatPrice(cartTotal)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">
            Nom complet
          </label>
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-0 py-2.5 sm:py-3 bg-transparent border-0 border-b border-[#e8e8e8] text-[13px] sm:text-[14px] text-[#19110b] font-light placeholder:text-[#c0c0c0] focus:outline-none focus:border-[#19110b] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase text-[#757575] mb-2">
            Ville de livraison
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-0 py-2.5 sm:py-3 bg-transparent border-0 border-b border-[#e8e8e8] text-[13px] sm:text-[14px] text-[#19110b] font-light focus:outline-none focus:border-[#19110b] transition-colors appearance-none cursor-pointer"
          >
            <option value="">Sélectionner</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-[#25D366] text-white text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase py-3.5 sm:py-4 flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-colors mt-5 sm:mt-6"
        >
          <FaWhatsapp size={18} />
          Commander via WhatsApp
        </button>
      </form>
    </div>
  );
};

export default WhatsAppSubmit;