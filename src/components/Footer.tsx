import { useState, type FC, type FormEvent } from "react";
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import toast from "react-hot-toast";
import type { FooterSection } from "../types";

const footerSections: FooterSection[] = [
  {
    title: "Africa Market Bags",
    links: ["Sacs Bandoulière", "Sacs à Main", "Sacs à Dos", "Pochettes", "Sacs de Voyage"],
  },
  {
    title: "Collections",
    links: ["Chaussures", "Parfums", "Accessoires", "Nouveautés", "Éditions Limitées"],
  },
  {
    title: "Services",
    links: ["Livraison & Retours", "Guide des tailles", "Entretien produits", "Service client", "FAQ"],
  },
  {
    title: "La Maison",
    links: ["Notre histoire", "Nos artisans", "Engagements", "Presse", "Carrières"],
  },
];

const Footer: FC = () => {
  const [email, setEmail] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Merci pour votre inscription.", {
        style: {
          background: "#19110b",
          color: "#ffffff",
          fontSize: "12px",
          letterSpacing: "0.05em",
          borderRadius: "0",
        },
      });
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#19110b] w-full">
      {/* NEWSLETTER */}
      <div className="border-b border-white/10">
        <div className="max-w-[600px] mx-auto px-5 sm:px-6 py-12 sm:py-14 lg:py-16 text-center">
          <h3 className="text-[11px] sm:text-[12px] tracking-[0.25em] uppercase text-white font-medium mb-2">
            Newsletter
          </h3>
          <p className="text-[12px] sm:text-[13px] text-white/50 font-light mb-6 sm:mb-8">
            Recevez nos nouveautés et offres exclusives en avant-première.
          </p>
          <form
            onSubmit={handleNewsletter}
            className="flex max-w-[440px] mx-auto"
          >
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 min-w-0 bg-transparent border-b border-white/20 text-[12px] sm:text-[13px] text-white font-light px-0 py-3 placeholder:text-white/30 focus:outline-none focus:border-white/60 transition-colors"
            />
            <button
              type="submit"
              className="text-[10px] tracking-[0.2em] uppercase text-white/60 hover:text-white font-medium ml-5 transition-colors whitespace-nowrap"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      {/* LINKS */}
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-10 sm:py-12 lg:py-14">
        {/* Desktop: 4 columns */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-12 text-center">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-white font-medium mb-5">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[12px] text-white/40 hover:text-white/80 transition-colors duration-300 font-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile: accordion */}
        <div className="md:hidden divide-y divide-white/10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between py-3.5"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase text-white font-medium">
                  {section.title}
                </span>
                <HiChevronDown
                  size={16}
                  className={`text-white/40 transition-transform duration-300 ${
                    openSections[section.title] ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openSections[section.title] ? "max-h-60 pb-3" : "max-h-0"
                }`}
              >
                <ul className="space-y-2 pl-1">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[12px] text-white/40 font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-6 py-8">
          <div className="flex flex-col items-center gap-5">
            {/* Logo */}
            <span className="text-[13px] sm:text-[14px] font-medium tracking-[0.3em] uppercase text-white/80">
              Africa Market
            </span>

            {/* Social icons */}
            <div className="flex items-center gap-6">
              <a
                href="https://wa.me/237651711545"
                className="text-white/30 hover:text-[#25D366] transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="https://www.facebook.com/KAMITE.BENDOZA?mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-[#1877F2] transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a
                href="#"
                className="text-white/30 hover:text-white/70 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="#"
                className="text-white/30 hover:text-white/70 transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok size={16} />
              </a>
            </div>

            {/* Email */}
            <a
              href="mailto:africamarketbags@gmail.com"
              className="text-[10px] sm:text-[11px] text-white/30 hover:text-white/60 tracking-[0.1em] transition-colors"
            >
              africamarketbags@gmail.com
            </a>

            {/* Legal */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <span className="text-[9px] sm:text-[10px] text-white/20 tracking-[0.1em]">
                &copy; {new Date().getFullYear()} Africa Market
              </span>
              <a
                href="#"
                className="text-[9px] sm:text-[10px] text-white/20 hover:text-white/40 tracking-[0.1em] transition-colors"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="text-[9px] sm:text-[10px] text-white/20 hover:text-white/40 tracking-[0.1em] transition-colors"
              >
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;