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
        <section className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
          <div className="container mx-auto px-4 py-10 lg:py-14">
            <h1 className="text-3xl lg:text-4xl font-bold">Catégorie: Électronique</h1>
            <p className="text-primary-foreground/90 mt-2">Découvrez nos meilleures offres par sous-catégorie.</p>
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


