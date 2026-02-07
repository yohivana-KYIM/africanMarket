import { useState, type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineX,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineMail,
} from "react-icons/hi";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqItems = [
  {
    q: "Comment passer une commande ?",
    a: "Ajoutez vos articles au panier, puis cliquez sur « Finaliser via WhatsApp ». Remplissez votre nom et ville de livraison, et votre commande sera envoyée directement à notre équipe.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "Douala et Yaoundé : 24-48h. Autres villes du Cameroun : 3-5 jours ouvrables. Vous recevrez un suivi par WhatsApp.",
  },
  {
    q: "La livraison est-elle gratuite ?",
    a: "Oui, la livraison est offerte pour toute commande supérieure à 50 000 FCFA. En dessous, les frais varient selon votre ville.",
  },
  {
    q: "Puis-je retourner un article ?",
    a: "Vous disposez de 14 jours après réception pour retourner un article dans son état d'origine. Contactez-nous via WhatsApp pour initier le retour.",
  },
  {
    q: "Les produits sont-ils authentiques ?",
    a: "Chaque pièce Africa Market est fabriquée à la main par nos artisans au Cameroun avec des matériaux premium : cuir tanné végétal, wax véritable, bogolan malien authentique.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Paiement à la livraison (cash), Mobile Money (MTN MoMo, Orange Money) ou virement bancaire. Le paiement est confirmé par WhatsApp.",
  },
];

type View = "main" | "faq";

const ContactPanel: FC<ContactPanelProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<View>("main");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => { setView("main"); setOpenFaq(null); }, 350);
  };

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
            onClick={handleClose}
            className="fixed inset-0 bg-black/30 z-[110]"
          />

          {/* Panel — slide from right on mobile, from right on desktop */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-[480px] bg-white z-[120] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 pt-8 sm:pt-10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                {view === "faq" && (
                  <button
                    onClick={() => setView("main")}
                    className="text-[#19110b] hover:text-[#6b4c3b] transition-colors mr-1"
                  >
                    <HiOutlineChevronRight size={18} className="rotate-180" />
                  </button>
                )}
                <h2
                  className="text-[18px] sm:text-[20px] text-[#19110b] font-light tracking-wide"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {view === "main" ? "Contactez-nous" : "Vos questions"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-[#19110b] hover:text-[#757575] transition-colors p-1"
                aria-label="Fermer"
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8">
              <AnimatePresence mode="wait">
                {view === "main" && (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Intro */}
                    <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed mb-8 sm:mb-10">
                      Où que vous soyez, l'équipe Africa Market sera ravie de vous aider.
                    </p>

                    {/* Contact options */}
                    <div className="space-y-1">
                      <a
                        href="tel:+237671178991"
                        className="flex items-center gap-4 py-4 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <HiOutlinePhone size={20} className="shrink-0" />
                        <span className="text-[14px] sm:text-[15px] font-light tracking-wide group-hover:underline underline-offset-4">
                          +237 671 178 991
                        </span>
                      </a>

                      <a
                        href="https://wa.me/237671178991"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 py-4 text-[#19110b] hover:text-[#25D366] transition-colors group"
                      >
                        <FaWhatsapp size={20} className="shrink-0" />
                        <span className="text-[14px] sm:text-[15px] font-light tracking-wide group-hover:underline underline-offset-4">
                          WhatsApp
                        </span>
                      </a>

                      <a
                        href="mailto:contact@africamarketbag.store"
                        className="flex items-center gap-4 py-4 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <HiOutlineMail size={20} className="shrink-0" />
                        <span className="text-[14px] sm:text-[15px] font-light tracking-wide group-hover:underline underline-offset-4">
                          Email
                        </span>
                      </a>

                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 py-4 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <FaInstagram size={20} className="shrink-0" />
                        <span className="text-[14px] sm:text-[15px] font-light tracking-wide group-hover:underline underline-offset-4">
                          Instagram
                        </span>
                      </a>

                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 py-4 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <FaTiktok size={18} className="shrink-0" />
                        <span className="text-[14px] sm:text-[15px] font-light tracking-wide group-hover:underline underline-offset-4">
                          TikTok
                        </span>
                      </a>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-[#e8e8e8] my-6 sm:my-8" />

                    {/* Links */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          window.open("https://wa.me/237671178991?text=Bonjour%2C%20j%27ai%20besoin%20d%27aide", "_blank");
                        }}
                        className="flex items-center justify-between w-full py-3.5 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <span className="text-[14px] sm:text-[15px] font-normal tracking-wide">
                          Besoin d'aide ?
                        </span>
                        <HiOutlineChevronRight size={16} className="text-[#c0c0c0] group-hover:text-[#19110b] transition-colors" />
                      </button>

                      <button
                        onClick={() => setView("faq")}
                        className="flex items-center justify-between w-full py-3.5 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <span className="text-[14px] sm:text-[15px] font-normal tracking-wide">
                          Vos questions
                        </span>
                        <HiOutlineChevronRight size={16} className="text-[#c0c0c0] group-hover:text-[#19110b] transition-colors" />
                      </button>

                      <button
                        onClick={() => {
                          window.open("https://maps.google.com/?q=Douala+Cameroun", "_blank");
                        }}
                        className="flex items-center justify-between w-full py-3.5 text-[#19110b] hover:text-[#6b4c3b] transition-colors group"
                      >
                        <span className="text-[14px] sm:text-[15px] font-normal tracking-wide">
                          Nos points de vente
                        </span>
                        <HiOutlineChevronRight size={16} className="text-[#c0c0c0] group-hover:text-[#19110b] transition-colors" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "faq" && (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[13px] sm:text-[14px] text-[#757575] font-light leading-relaxed mb-6 sm:mb-8">
                      Retrouvez les réponses aux questions les plus fréquentes.
                    </p>

                    <div className="divide-y divide-[#f0f0f0]">
                      {faqItems.map((item, i) => (
                        <div key={i}>
                          <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full flex items-start justify-between gap-4 py-4 text-left group"
                          >
                            <div className="flex items-start gap-3">
                              <HiOutlineQuestionMarkCircle
                                size={18}
                                className="shrink-0 mt-0.5 text-[#c5a467]"
                              />
                              <span className={`text-[13px] sm:text-[14px] font-normal leading-snug transition-colors ${
                                openFaq === i ? "text-[#19110b]" : "text-[#19110b]/80 group-hover:text-[#19110b]"
                              }`}>
                                {item.q}
                              </span>
                            </div>
                            <HiOutlineChevronDown
                              size={16}
                              className={`shrink-0 mt-0.5 text-[#c0c0c0] transition-transform duration-300 ${
                                openFaq === i ? "rotate-180 text-[#19110b]" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <p className="text-[12px] sm:text-[13px] text-[#757575] font-light leading-relaxed pl-[30px] pb-4">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8 sm:mt-10 p-5 bg-[#f6f5f3]">
                      <p className="text-[12px] sm:text-[13px] text-[#19110b] font-normal mb-1">
                        Vous ne trouvez pas votre réponse ?
                      </p>
                      <p className="text-[11px] sm:text-[12px] text-[#757575] font-light mb-4">
                        Notre équipe est disponible 7j/7 pour vous aider.
                      </p>
                      <a
                        href="https://wa.me/237671178991?text=Bonjour%2C%20j%27ai%20une%20question"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] text-white text-[11px] tracking-[0.1em] uppercase px-5 py-3 hover:bg-[#20bd5a] transition-colors"
                      >
                        <FaWhatsapp size={16} />
                        Écrire sur WhatsApp
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-[#f0f0f0]">
              <p className="text-[10px] tracking-[0.1em] uppercase text-[#c0c0c0] text-center">
                Africa Market &mdash; Service client
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactPanel;