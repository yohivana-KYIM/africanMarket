import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CreditCard,
  Megaphone,
  HeadphonesIcon,
  BarChart3,
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const services = [
  {
    icon: Package,
    title: "Catalogue & Sourcing",
    description: "Sélection et vérification de fournisseurs locaux. Négociation et contrôle qualité.",
    features: ["Fournisseurs vérifiés", "Contrôle qualité", "Meilleurs prix"]
  },
  {
    icon: Truck,
    title: "Logistique & Livraison",
    description: "Réseau de transport fiable. Suivi des colis. Livraison express en ville.",
    features: ["Suivi en temps réel", "Livraison express", "Réseau fiable"]
  },
  {
    icon: CreditCard,
    title: "Paiements Sécurisés",
    description: "Mobile Money, cartes, virements. Transactions sécurisées et rapides.",
    features: ["Mobile Money", "Cartes bancaires", "100% sécurisé"]
  },
  {
    icon: Megaphone,
    title: "Marketing Digital",
    description: "Campagnes digitales, réseaux sociaux, influenceurs, fidélisation.",
    features: ["Réseaux sociaux", "Influenceurs", "Campagnes ciblées"]
  },
  {
    icon: HeadphonesIcon,
    title: "Support 24/7",
    description: "Assistance multicanale réactive: chat, email, téléphone.",
    features: ["Disponible 24/7", "Multicanal", "Réponse rapide"]
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Tableaux de bord, suivi des ventes, optimisation continue.",
    features: ["Tableaux de bord", "Rapports détaillés", "Insights en temps réel"]
  },
];

const Services = () => {
  return (
    <main className="bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[400px] lg:min-h-[500px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white">
              Nos <span className="text-white/90">Services</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
              Solutions e-commerce complètes pour propulser votre business en Afrique
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ce que nous offrons
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des services complets pour gérer et développer votre activité en ligne
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full p-8 hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary group">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
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
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Clients satisfaits" },
              { value: "10k+", label: "Produits livrés" },
              { value: "24/7", label: "Support disponible" },
              { value: "99%", label: "Taux de satisfaction" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>

            <div className="relative p-12 lg:p-16 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Vous avez un projet ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discutons de vos besoins et bâtissons ensemble votre succès sur le marché africain
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-6 text-lg"
                >
                  <a href="mailto:support@awdpay.com" className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Nous contacter par email
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 px-8 py-6 text-lg hover:bg-primary hover:text-primary-foreground"
                >
                  <a href="tel:+237651711545" className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    +237 6 51 71 15 45
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 px-8 py-6 text-lg hover:bg-primary hover:text-primary-foreground"
                >
                  <a href="https://wa.me/237651711545" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </main>
  );
};

export default Services;