import ProductGrid from '@/components/ProductGrid';

const HomeCreations = () => {
    return (
        <section className="py-12 bg-secondary/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground mb-4">
                        Créations de la Maison
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Explorez notre collection de sacs et accessoires artisanaux
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Sac à Dos Section */}
                    <div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-primary">Sac à Dos</h3>
                                <p className="text-muted-foreground text-lg">Pratiques et stylés</p>
                            </div>
                        </div>
                        <div className="-mx-4 md:mx-0">
                            <ProductGrid
                                forceCategory="Sacs"
                                forceSubcategory="Sacs de classe"
                                hideHeader={true}
                                hideFilters={true}
                                limit={4}
                                renderCarousel={true}
                                className=""
                            />
                        </div>
                    </div>

                    {/* Sacs de Voyage Section */}
                    <div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-2xl font-bold text-primary">Sacs de Voyage</h3>
                                <p className="text-muted-foreground text-lg">Pour vos déplacements</p>
                            </div>
                        </div>
                        <div className="-mx-4 md:mx-0">
                            <ProductGrid
                                forceCategory="Sacs"
                                forceSubcategory="Sacs de voyage"
                                hideHeader={true}
                                hideFilters={true}
                                limit={4}
                                renderCarousel={true}
                                className=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeCreations;
