import {
  MapPin, Phone, Mail, Facebook, Instagram, Twitter, Heart,
  Globe, Info, Wrench, HelpCircle, FileText, Truck,
  RotateCcw, Zap,
  Clock, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'À propos', icon: Info, href: '/about' },
    { name: 'Nos Services', icon: Wrench, href: '/services' },
    { name: 'Politique de Livraison', icon: Truck, href: '#' },
    { name: 'Retours & Remboursements', icon: RotateCcw, href: '#' },
    { name: 'FAQ', icon: HelpCircle, href: '#' },
    { name: 'Blog', icon: FileText, href: '#' },
  ];

  const categories = [
    { name: 'African Market', icon: Globe, href: '/african-market' },
    { name: 'Électronique', icon: Zap, href: '/category/electronique' },
  ];

  return (
    <footer className="relative">
      {/* Wave SVG */}
      <div className="relative">
        <svg
          className="w-full h-24 md:h-32"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#0a0a0a"
          />
        </svg>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#0a0a0a] text-white py-16 relative overflow-hidden">
        {/* Decorative wave patterns */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 25, 50 50 T 100 50" stroke="white" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Restez connecté avec AFRICA MARKET 📧
          </h3>
          <p className="text-xl mb-8 text-white/80">
            Recevez nos offres exclusives et nouveautés en premier !
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="bg-white text-black border-none h-12 shadow-lg"
            />
            <Button className="whitespace-nowrap h-12 px-8 font-semibold shadow-lg hover:scale-105 transition-transform bg-white text-black hover:bg-gray-200">
              S'inscrire
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer - Black Background */}
      <div className="bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-6 group">
                <div className="text-2xl font-bold text-white group-hover:scale-105 transition-transform">
                  AFRICA MARKET
                </div>
                <div className="text-white text-xl">🛍️💰</div>
              </Link>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Votre marketplace africain de confiance. Nous proposons les meilleurs produits
                d'Afrique avec une garantie de qualité et un service client exceptionnel.
              </p>

              <div className="flex gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="p-2.5 bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all border-2"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-2.5 bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all border-2"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-2.5 bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all border-2"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links with Icons */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-white" />
                Liens Rapides
              </h4>
              <nav className="space-y-2">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 group"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Categories with Icons */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-white" />
                Catégories
              </h4>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 group"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{category.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-white" />
                Contactez-nous
              </h4>
              <div className="space-y-4">
                <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1 text-white">Adresse</div>
                      <div className="text-sm text-gray-300">
                        Douala, Cameroun<br />
                        Quartier Akwa, Rue de la Joie
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1 text-white">Téléphone</div>
                      <a
                        href="tel:+237651711545"
                        className="text-sm text-gray-300 hover:text-white hover:underline font-medium"
                      >
                        +237 6 51 71 15 45
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1 text-white">Email</div>
                      <a
                        href="mailto:contact@africamarket.com"
                        className="text-sm text-gray-300 hover:text-white hover:underline font-medium break-all"
                      >
                        contact@africamarket.com
                      </a>
                    </div>
                  </div>
                </Card>

                {/* Hours */}
                <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-white" />
                    <div className="font-semibold text-white">Heures d'ouverture</div>
                  </div>
                  <div className="text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Lun - Ven:</span>
                      <span className="font-medium text-white">8h00 - 20h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sam:</span>
                      <span className="font-medium text-white">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Dim:</span>
                      <span className="font-medium text-white">10h00 - 16h00</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400 font-medium">
                © 2024 AFRICA MARKET. Tous droits réservés.
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Fait avec</span>
                <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
                <span className="text-gray-400">en Afrique</span>
              </div>

              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Conditions d'utilisation
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Confidentialité
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;