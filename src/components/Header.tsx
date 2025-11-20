import { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User, MapPin, Globe, Zap, Info, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CartSheet from '@/components/CartSheet';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalQuantity } = useCart();

  const categories = [
    'Électronique'
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-card">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Livraison gratuite à partir de 50,000 FCFA</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Contact: +237 6 51 71 15 45</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">
              AFRICA MARKET
            </div>
            <div className="text-primary text-xl">🛍️💰</div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 h-12 rounded-l-lg border-r-0"
              />
              <Button className="absolute right-0 top-0 h-12 px-6 rounded-l-none bg-primary hover:bg-primary-dark">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Compte</span>
            </Button>

            <CartSheet>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Button>
            </CartSheet>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 h-12"
            />
            <Button className="absolute right-0 top-0 h-12 px-4 bg-primary hover:bg-primary-dark">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="hidden lg:flex mt-6 pt-4 border-t border-border/40">
          <div className="flex items-center justify-center w-full gap-2">
            <Button
              asChild
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 font-semibold rounded-lg px-6 py-2.5 transition-all hover:scale-105"
            >
              <Link to="/african-market" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                African Market
              </Link>
            </Button>

            <div className="h-6 w-px bg-border/60 mx-1"></div>

            {categories.map((category) => {
              const to = category === 'Électronique' ? '/category/electronique' : '#';
              return (
                <Button
                  key={category}
                  asChild
                  variant="ghost"
                  className="text-foreground hover:text-primary hover:bg-primary/10 font-semibold rounded-lg px-6 py-2.5 transition-all hover:scale-105"
                >
                  <Link to={to} className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    {category}
                  </Link>
                </Button>
              );
            })}

            <div className="h-6 w-px bg-border/60 mx-1"></div>

            <Button
              asChild
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 font-semibold rounded-lg px-6 py-2.5 transition-all hover:scale-105"
            >
              <Link to="/about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                À propos
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-primary/10 font-semibold rounded-lg px-6 py-2.5 transition-all hover:scale-105"
            >
              <Link to="/services" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Services
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-card border-t shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col gap-2">
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start hover:bg-primary/10 hover:text-primary rounded-lg py-3 font-medium"
                >
                  <Link to="/account" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-5 w-5 mr-3" />
                    Mon Compte
                  </Link>
                </Button>

                <div className="my-2 border-t border-border/40"></div>

                <Button
                  asChild
                  variant="ghost"
                  className="justify-start hover:bg-primary/10 hover:text-primary rounded-lg py-3 font-medium"
                >
                  <Link to="/african-market" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <Globe className="h-5 w-5" />
                    African Market
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="justify-start hover:bg-primary/10 hover:text-primary rounded-lg py-3 font-medium"
                >
                  <Link to="/category/electronique" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <Zap className="h-5 w-5" />
                    Électronique
                  </Link>
                </Button>

                <div className="my-2 border-t border-border/40"></div>

                <Button
                  asChild
                  variant="ghost"
                  className="justify-start hover:bg-primary/10 hover:text-primary rounded-lg py-3 font-medium"
                >
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <Info className="h-5 w-5" />
                    À propos
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="justify-start hover:bg-primary/10 hover:text-primary rounded-lg py-3 font-medium"
                >
                  <Link to="/services" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                    <Wrench className="h-5 w-5" />
                    Services
                  </Link>
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;