import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Globe, Heart, CheckCircle2 } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import { Card } from '@/components/ui/card';

const categories = [
  {
    name: 'Sac à Dos',
    image: '/backpack.png',
    slug: 'sac-a-dos',
    description: 'Pratiques et stylés'
  },
  {
    name: 'Sacs de Voyage',
    image: '/travel-bag.png',
    slug: 'sacs-de-voyage',
    description: 'Pour vos déplacements'
  },
  {
    name: 'Sacs à Main',
    image: '/handbag.png',
    slug: 'sacs-a-main',
    description: 'Élégance au quotidien'
  },
  {
    name: 'Bandoulière',
    image: '/shoulder-bag.png',
    slug: 'bandouliere',
    description: 'Confort et style'
  },
  {
    name: 'Accessoires',
    image: '/accessories.png',
    slug: 'accessoires',
    description: 'Complétez votre look'
  },
  {
    name: 'Porte-Feuille',
    image: '/wallet.png',
    slug: 'porte-feuille',
    description: 'Compact et pratique'
  },
];

const AfricanMarket = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/55"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="bg-white/20 backdrop-blur-sm rounded-full p-6"
              >
                <Globe className="h-16 w-16 text-white" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              African Market
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-white/95 leading-relaxed max-w-3xl mx-auto">
              Découvrez l'authenticité africaine : sacs artisanaux, mode traditionnelle,
              accessoires uniques et bien plus encore
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              {[
                { icon: Sparkles, text: "Produits authentiques" },
                { icon: Heart, text: "Artisanat local" },
                { icon: ShoppingBag, text: "Livraison rapide" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/20"
                >
                  <item.icon className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Créations de la Maison
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explorez notre collection de sacs et accessoires artisanaux
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <motion.a
                key={category.name}
                href={`/category/${category.slug}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden border-2 hover:border-primary hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover p-8 group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                  <div className="p-6 text-center bg-card">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ProductGrid title="Produits African Market" limit={12} />
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16"
            >
              Pourquoi choisir African Market ?
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: Sparkles,
                  title: "Authenticité Garantie",
                  description: "Tous nos produits sont authentiques et proviennent directement d'artisans africains",
                  features: ["100% Artisanal", "Qualité vérifiée", "Designs uniques"]
                },
                {
                  icon: Heart,
                  title: "Commerce Équitable",
                  description: "Nous soutenons les artisans locaux avec des prix justes et équitables",
                  features: ["Prix justes", "Soutien local", "Impact positif"]
                },
                {
                  icon: Globe,
                  title: "Livraison Internationale",
                  description: "Recevez vos produits africains où que vous soyez dans le monde",
                  features: ["Livraison rapide", "Suivi en temps réel", "Mondial"]
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.15 }}
                  >
                    <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary group">
                      <div className="bg-primary/10 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-10 w-10 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-2xl mb-4 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {item.description}
                      </p>
                      <ul className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AfricanMarket;
