import { useParams } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';

const slugToLabel: Record<string, string> = {
  electronique: 'Électronique',
  mode: 'Mode',
  beaute: 'Beauté',
  sport: 'Sport',
  maison: 'Maison',
  livres: 'Livres',
  automobile: 'Automobile',
};

const Category = () => {
  const { slug } = useParams();
  const category = slug ? (slugToLabel[slug] ?? slug) : undefined;

  if (category === 'Électronique') {
    return (
      <main>
        {/* Hero Banner with African Ndop Patterns */}
        <section className="relative min-h-[400px] lg:min-h-[500px] flex items-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
          {/* Background Pattern - Ndop Inspired */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ndop-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="white" strokeWidth="1" />
                  <circle cx="50" cy="50" r="15" fill="none" stroke="white" strokeWidth="1" />
                  <path d="M25 25 L75 25 L75 75 L25 75 Z" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ndop-pattern)" />
            </svg>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          {/* Filigree Border Top */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

          <div className="container mx-auto px-4 py-16 lg:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <div className="inline-block mb-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Technologie & Innovation</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                    Électronique
                  </span>
                  <br />
                  <span className="text-2xl lg:text-3xl font-normal text-white/80">
                    L'excellence technologique africaine
                  </span>
                </h1>

                <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
                  Découvrez notre sélection premium d'appareils électroniques.
                  Des smartphones aux ordinateurs, trouvez la technologie qui vous correspond.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-md">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">500+</div>
                    <div className="text-sm text-white/60">Produits</div>
                  </div>
                  <div className="text-center border-x border-white/20">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">24/7</div>
                    <div className="text-sm text-white/60">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-1">100%</div>
                    <div className="text-sm text-white/60">Garantie</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Decorative */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  {/* Decorative Circle with Ndop Pattern */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full border-4 border-yellow-500/30 border-dashed animate-spin-slow"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-white/20"></div>
                  </div>

                  {/* Icons */}
                  <div className="relative z-10 flex items-center justify-center h-80">
                    <div className="text-center">
                      <div className="text-8xl mb-4">💻</div>
                      <div className="flex gap-4 justify-center text-4xl">
                        <span>📱</span>
                        <span>🎧</span>
                        <span>⌚</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filigree Border Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

          {/* Wave SVG at bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-16" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,40 Q360,0 720,40 T1440,40 L1440,80 L0,80 Z" fill="white" fillOpacity="0.05" />
            </svg>
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 space-y-20">
          <section>
            <h2 className="text-2xl font-bold mb-6">Smartphones</h2>
            <ProductGrid
              title="Smartphones"
              forceCategory="Électronique"
              forceSubcategory="Smartphones"
              hideHeader
              hideFilters
              renderCarousel
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Casques</h2>
            <ProductGrid
              title="Casques"
              forceCategory="Électronique"
              forceSubcategory="Casques"
              hideHeader
              hideFilters
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">TV & Écrans</h2>
            <ProductGrid
              title="TV & Écrans"
              forceCategory="Électronique"
              forceSubcategory="TV"
              hideHeader
              hideFilters
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Ordinateurs</h2>
            <ProductGrid
              title="Ordinateurs"
              forceCategory="Électronique"
              forceSubcategory="Ordinateurs"
              hideHeader
              hideFilters
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Tablettes</h2>
            <ProductGrid
              title="Tablettes"
              forceCategory="Électronique"
              forceSubcategory="Tablettes"
              hideHeader
              hideFilters
            />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Accessoires</h2>
            <ProductGrid
              title="Accessoires"
              forceCategory="Électronique"
              forceSubcategory="Accessoires"
              hideHeader
              hideFilters
            />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
        <div className="container mx-auto px-4 py-10 lg:py-14">
          <h1 className="text-3xl lg:text-4xl font-bold">
            {category ? `Catégorie: ${category}` : 'Catégorie'}
          </h1>
          <p className="text-primary-foreground/90 mt-2">
            Découvrez nos produits dans la catégorie sélectionnée.
          </p>
        </div>
      </section>

      <ProductGrid forceCategory={category} />
    </main>
  );
};

export default Category;


