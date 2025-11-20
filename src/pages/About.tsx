const About = () => {
  return (
    <main>
      <section className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">À propos d'AFRICA MARKET</h1>
          <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-3xl">
            Marketplace africain de confiance. Notre mission: connecter les consommateurs à des produits de qualité
            fabriqués et vendus en Afrique, à des prix imbattables, avec un service irréprochable.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Qualité garantie",
              desc: "Chaque produit est vérifié. Partenaires certifiés et service après-vente local.",
            },
            {
              title: "Livraison rapide",
              desc: "Partout en Afrique, avec suivi. Livraison gratuite dès 50,000 FCFA.",
            },
            {
              title: "Paiement sécurisé",
              desc: "Mobile Money, cartes, virements. Données chiffrées et protégées.",
            },
          ].map((b, i) => (
            <article key={i} className="product-card p-6">
              <h2 className="text-xl font-semibold mb-2 text-foreground">{b.title}</h2>
              <p className="text-muted-foreground">{b.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Contact</h2>
          <p className="text-muted-foreground mb-6">
            Une question? Écrivez-nous ou appelez: <a className="text-primary" href="tel:+237651711545">+237 6 51 71 15 45</a>
          </p>
          <a href="mailto:contact@africamarket.com" className="btn-secondary-hero inline-block">Nous écrire</a>
        </div>
      </section>
    </main>
  );
};

export default About;