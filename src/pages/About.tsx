const About = () => {
  return (
    <main className="relative min-h-screen text-foreground">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-[-1] opacity-40 pointer-events-none"
        style={{
          backgroundImage: "url('/about/page-background.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "400px"
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/about/hero-banner.png"
            alt="Atelier artisan africain"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white z-10">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
            L'Excellence Africaine
          </h1>
          <p className="text-xl lg:text-2xl max-w-2xl mx-auto font-light text-white/90">
            Connecter le monde au savoir-faire authentique de nos artisans.
          </p>
        </div>
      </section>

      {/* Mission & Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 transform translate-x-4 translate-y-4 rounded-2xl" />
                <img
                  src="/about/portrait.png"
                  alt="Artisan partenaire"
                  className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]"
                />
                <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-xl border border-border/50 max-w-xs hidden md:block">
                  <p className="text-sm font-medium text-muted-foreground italic">
                    "Chaque produit raconte une histoire, celle d'une tradition transmise de génération en génération."
                  </p>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-primary">Notre Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  AFRICA MARKET est bien plus qu'une simple marketplace. C'est un pont numérique entre les talents exceptionnels de l'Afrique et les consommateurs exigeants du monde entier.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  Nous nous engageons à valoriser le "Made in Africa" en garantissant une qualité irréprochable, des prix justes pour les artisans, et une expérience client aux standards internationaux.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card transition-colors">
                  <h3 className="font-semibold text-xl mb-2">Authenticité</h3>
                  <p className="text-sm text-muted-foreground">Produits 100% originaux, directement des ateliers.</p>
                </div>
                <div className="p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card transition-colors">
                  <h3 className="font-semibold text-xl mb-2">Impact</h3>
                  <p className="text-sm text-muted-foreground">Soutien direct à l'économie locale et aux créateurs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        {/* Decorative Ndop pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('/about/ndop-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "200px"
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Pourquoi nous choisir ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une expérience d'achat sécurisée, rapide et transparente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Qualité Certifiée",
                desc: "Contrôle rigoureux de chaque article avant expédition.",
                icon: "✨"
              },
              {
                title: "Livraison Express",
                desc: "Partout en Afrique et dans le monde, avec suivi en temps réel.",
                icon: "🚀"
              },
              {
                title: "Paiement Sécurisé",
                desc: "Transactions chiffrées via Mobile Money et cartes bancaires.",
                icon: "🔒"
              },
            ].map((item, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-10 lg:p-20 text-center text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{ backgroundImage: "url('/about/ndop-pattern.png')", backgroundSize: "300px" }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Une question ?</h2>
              <p className="text-primary-foreground/90 text-lg mb-10">
                Notre équipe est à votre écoute 24/7 pour vous accompagner dans votre expérience d'achat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+237651711545"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors"
                >
                  +237 6 51 71 15 45
                </a>
                <a
                  href="mailto:contact@africamarket.com"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors"
                >
                  Nous écrire
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;