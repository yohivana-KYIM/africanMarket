import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: "Électronique Haut de Gamme",
    subtitle: "Smartphones, casques, accessoires — jusqu'à -50%",
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400',
    cta: 'Découvrir'
  },
  {
    id: 2,
    title: "Mode & Wax Authentique",
    subtitle: "Styles africains, qualité premium",
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1400',
    cta: 'Shopper maintenant'
  },
  {
    id: 3,
    title: "Beauté & Parfums",
    subtitle: "Les meilleurs soins et fragrances",
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400',
    cta: 'Voir les offres'
  }
];

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dark text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="container mx-auto px-4 py-10 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Content */}
          <div className="lg:col-span-5">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              AFRICA
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                MARKET
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg lg:text-xl mb-8 text-primary-foreground/90 leading-relaxed"
            >
              Découvrez les meilleurs produits d'Afrique.
              <span className="block font-semibold">Qualité premium, prix imbattables ! 🛒️</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <button className="btn-hero animate-glow">Explorer les Produits</button>
              <button className="btn-secondary-hero">Offres Spéciales</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                <span>Support 24/7</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="relative">
              <Carousel
                className="w-full"
                opts={{ loop: true, align: 'start' }}
                plugins={[Autoplay({ delay: 4000 })]}
              >
                <CarouselContent>
                  {slides.map((slide) => (
                    <CarouselItem key={slide.id} className="basis-full">
                      <div className="relative">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-[420px] object-cover rounded-2xl shadow-2xl"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-2xl"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                          <div className="max-w-xl">
                            <div className="text-sm uppercase tracking-wider text-primary-foreground/80 mb-1">Sélection du jour</div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h3>
                            <p className="text-primary-foreground/90 mb-4">{slide.subtitle}</p>
                            <button className="btn-secondary-hero">{slide.cta}</button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-3 bg-card/80 backdrop-blur-sm" />
                <CarouselNext className="right-3 bg-card/80 backdrop-blur-sm" />
              </Carousel>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-primary-light/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-primary-dark/20 to-transparent rounded-full blur-3xl"></div>
    </section >
  );
};

export default Hero;