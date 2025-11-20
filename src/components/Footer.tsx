import {
  MapPin, Phone, Mail, Facebook, Instagram, Twitter, Heart,
  Globe, Info, Wrench, HelpCircle, FileText, Truck,
  RotateCcw, Zap, Shirt, Sparkles, Dumbbell, Home as HomeIcon, Car,
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
    { name: 'Mode & Vêtements', icon: Shirt, href: '#' },
    { name: 'Beauté & Santé', icon: Sparkles, href: '#' },
    { name: 'Sport & Loisirs', icon: Dumbbell, href: '#' },
    { name: 'Maison & Jardin', icon: HomeIcon, href: '#' },
    { name: 'Automobile', icon: Car, href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-b from-card to-muted/30 border-t">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-purple-600 text-primary-foreground py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Restez connecté avec AFRICA MARKET 📧
          </h3>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Recevez nos offres exclusives et nouveautés en premier !
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="bg-card text-foreground border-none h-12 shadow-lg"
            />
            <Button variant="secondary" className="whitespace-nowrap h-12 px-8 font-semibold shadow-lg hover:scale-105 transition-transform">
              S'inscrire
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="text-2xl font-bold text-primary group-hover:scale-105 transition-transform">
                AFRICA MARKET
              </div>
              <div className="text-primary text-xl">🛍️💰</div>
            </Link>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Votre marketplace africain de confiance. Nous proposons les meilleurs produits
              d'Afrique avec une garantie de qualité et un service client exceptionnel.
            </p>

            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                className="p-2.5 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all border-2"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="p-2.5 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all border-2"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="p-2.5 hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all border-2"
              >
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links with Icons */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-primary" />
              Liens Rapides
            </h4>
            <nav className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary hover:bg-primary/5 p-2 rounded-lg transition-all duration-200 group"
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
            <h4 className="font-bold text-lg mb-6 text-foreground flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-primary" />
              Catégories
            </h4>
            <nav className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary hover:bg-primary/5 p-2 rounded-lg transition-all duration-200 group"
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
            <h4 className="font-bold text-lg mb-6 text-foreground flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-primary" />
              Contactez-nous
            </h4>
            <div className="space-y-4">
              <Card className="p-4 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Adresse</div>
                    <div className="text-sm text-muted-foreground">
                      Douala, Cameroun<br />
                      Quartier Akwa, Rue de la Joie
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Téléphone</div>
                    <a
                      href="tel:+237651711545"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      +237 6 51 71 15 45
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4 hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a
                      href="mailto:contact@africamarket.com"
                      className="text-sm text-primary hover:underline font-medium break-all"
                    >
                      contact@africamarket.com
                    </a>
                  </div>
                </div>
              </Card>

              {/* Hours */}
              <Card className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div className="font-semibold">Heures d'ouverture</div>
                </div>
                <div className="text-sm space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lun - Ven:</span>
                    <span className="font-medium">8h00 - 20h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sam:</span>
                    <span className="font-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dim:</span>
                    <span className="font-medium">10h00 - 16h00</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              © 2024 AFRICA MARKET. Tous droits réservés.
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Fait avec</span>
              <Heart className="h-4 w-4 text-destructive fill-current animate-pulse" />
              <span className="text-muted-foreground">en Afrique</span>
            </div>

            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Conditions d'utilisation
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
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