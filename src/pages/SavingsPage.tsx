import { Wallet, TrendingUp, Calendar, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductGrid from '@/components/ProductGrid';
import { useSavings } from '@/context/SavingsContext';

const SavingsPage = () => {
    const { savingsPlans, productSavings } = useSavings();

    const activeSavingsCount = productSavings.filter(ps => ps.isActive).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-background">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                            <Wallet className="h-10 w-10" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">
                            Épargne Produits
                        </h1>
                        <p className="text-xl text-green-50 mb-8">
                            Achetez maintenant, payez progressivement ! Épargnez pour vos produits préférés avec nos plans flexibles.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                <CardContent className="p-6 text-center">
                                    <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                                    <div className="text-3xl font-bold mb-1">{savingsPlans.length}</div>
                                    <div className="text-green-100">Plans disponibles</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                <CardContent className="p-6 text-center">
                                    <Wallet className="h-8 w-8 mx-auto mb-3" />
                                    <div className="text-3xl font-bold mb-1">{activeSavingsCount}</div>
                                    <div className="text-green-100">Produits avec épargne</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                                <CardContent className="p-6 text-center">
                                    <Calendar className="h-8 w-8 mx-auto mb-3" />
                                    <div className="text-3xl font-bold mb-1">2-8</div>
                                    <div className="text-green-100">Semaines de durée</div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Comment ça marche ?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Choisissez votre produit</h3>
                                <p className="text-muted-foreground">
                                    Sélectionnez un produit avec un plan d'épargne disponible
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Épargnez progressivement</h3>
                                <p className="text-muted-foreground">
                                    Payez par semaine selon le plan choisi (2, 4 ou 8 semaines)
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Recevez votre produit</h3>
                                <p className="text-muted-foreground">
                                    Une fois l'épargne complétée, votre produit vous est livré !
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Info Banner */}
            <section className="container mx-auto px-4 pb-8">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    À propos des taux d'intérêt
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200">
                                    Un petit taux d'intérêt est appliqué pour couvrir les frais de gestion de votre plan d'épargne.
                                    Plus la durée est courte, plus le taux est élevé. Choisissez le plan qui vous convient le mieux !
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Products with Savings */}
            <section className="container mx-auto px-4 pb-16">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Produits Disponibles en Épargne
                </h2>

                {activeSavingsCount > 0 ? (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
                            <TabsTrigger value="all">Tous</TabsTrigger>
                            <TabsTrigger value="2w">2 sem</TabsTrigger>
                            <TabsTrigger value="4w">4 sem</TabsTrigger>
                            <TabsTrigger value="8w">8 sem</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <ProductGrid
                                hideHeader
                                hideFilters
                                forceCategory="Électronique"
                            />
                        </TabsContent>

                        <TabsContent value="2w">
                            <ProductGrid
                                hideHeader
                                hideFilters
                                forceCategory="Électronique"
                            />
                        </TabsContent>

                        <TabsContent value="4w">
                            <ProductGrid
                                hideHeader
                                hideFilters
                                forceCategory="Électronique"
                            />
                        </TabsContent>

                        <TabsContent value="8w">
                            <ProductGrid
                                hideHeader
                                hideFilters
                                forceCategory="Électronique"
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <Card className="text-center py-16">
                        <CardContent>
                            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">Aucun produit avec épargne pour le moment</h3>
                            <p className="text-muted-foreground">
                                Revenez bientôt pour découvrir nos offres d'épargne !
                            </p>
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    );
};

export default SavingsPage;
