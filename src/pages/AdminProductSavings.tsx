import { useState } from 'react';
import { Search, Wallet, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSavings } from '@/context/SavingsContext';
import SavingsBadge from '@/components/SavingsBadge';
import SavingsCalculator from '@/components/SavingsCalculator';
import { toast } from 'sonner';

// Import mock products (in a real app, this would come from an API)
import iphone12Img from '@/assets/image/smartphones/apple_iphone-12.jpg';
import galaxyImg from '@/assets/image/smartphones/samsung-galaxy.jpg';
import pixel10Img from '@/assets/image/smartphones/google-pixel-10.jpg';

const mockProducts = [
    { id: 1, name: "Smartphone Samsung Galaxy A54", price: 180000, image: galaxyImg, category: "Électronique" },
    { id: 13, name: "Samsung Galaxy S24", price: 520000, image: galaxyImg, category: "Électronique" },
    { id: 14, name: "Google Pixel 10", price: 150000, image: pixel10Img, category: "Électronique" },
    { id: 7, name: "iPhone 13 128 Go", price: 420000, image: iphone12Img, category: "Électronique" },
];

const AdminProductSavings = () => {
    const {
        savingsPlans,
        productSavings,
        assignSavingsToProduct,
        removeSavingsFromProduct,
        toggleProductSavings,
        getSavingsForProduct,
        calculateSavings
    } = useSavings();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string>('');

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssignSavings = () => {
        if (!selectedProduct || !selectedPlan) {
            toast.error('Veuillez sélectionner un produit et un plan');
            return;
        }

        assignSavingsToProduct(selectedProduct, selectedPlan);
        toast.success('Plan d\'épargne assigné avec succès');
        setSelectedProduct(null);
        setSelectedPlan('');
    };

    const handleRemoveSavings = (productId: number, productName: string) => {
        if (confirm(`Retirer le plan d'épargne de "${productName}" ?`)) {
            removeSavingsFromProduct(productId);
            toast.success('Plan d\'épargne retiré');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-primary" />
                    Assigner l'Épargne aux Produits
                </h1>
                <p className="text-muted-foreground text-lg">
                    Configurez les plans d'épargne pour vos produits
                </p>
            </div>

            {savingsPlans.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Aucun plan d'épargne disponible</h3>
                        <p className="text-muted-foreground mb-4">
                            Créez d'abord des plans d'épargne avant de les assigner aux produits
                        </p>
                        <Button onClick={() => window.location.href = '/admin/savings/plans'}>
                            Créer des plans
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Assignment Form */}
                    <Card className="mb-8 border-2 border-primary">
                        <CardHeader>
                            <CardTitle>Assigner un Plan d'Épargne</CardTitle>
                            <CardDescription>
                                Sélectionnez un produit et un plan d'épargne à lui assigner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label>Produit</Label>
                                    <Select
                                        value={selectedProduct?.toString() || ''}
                                        onValueChange={(value) => setSelectedProduct(parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un produit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockProducts.map((product) => (
                                                <SelectItem key={product.id} value={product.id.toString()}>
                                                    {product.name} - {formatPrice(product.price)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Plan d'Épargne</Label>
                                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {savingsPlans.map((plan) => (
                                                <SelectItem key={plan.id} value={plan.id}>
                                                    {plan.name} ({plan.durationWeeks}sem, {plan.interestRate}%)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button onClick={handleAssignSavings} className="gap-2">
                                    <Check className="h-4 w-4" />
                                    Assigner
                                </Button>
                            </div>

                            {/* Preview */}
                            {selectedProduct && selectedPlan && (
                                <div className="mt-6">
                                    <Label className="mb-2 block">Aperçu du calcul</Label>
                                    {(() => {
                                        const product = mockProducts.find(p => p.id === selectedProduct);
                                        const calculation = calculateSavings(product?.price || 0, selectedPlan);
                                        return calculation && product ? (
                                            <SavingsCalculator calculation={calculation} productName={product.name} />
                                        ) : null;
                                    })()}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => {
                            const savings = getSavingsForProduct(product.id);
                            const plan = savings ? savingsPlans.find(p => p.id === savings.savingsPlanId) : null;

                            return (
                                <Card key={product.id} className={savings ? 'border-2 border-green-500/30' : ''}>
                                    <CardHeader className="pb-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-contain bg-white rounded-lg mb-3"
                                        />
                                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                                        <CardDescription className="text-xl font-bold text-primary">
                                            {formatPrice(product.price)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {savings && plan ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <SavingsBadge
                                                        durationWeeks={plan.durationWeeks}
                                                        interestRate={plan.interestRate}
                                                        variant="compact"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={savings.isActive}
                                                            onCheckedChange={() => toggleProductSavings(product.id)}
                                                        />
                                                        <span className="text-xs text-muted-foreground">
                                                            {savings.isActive ? 'Actif' : 'Inactif'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <strong>{plan.name}</strong> - {plan.durationWeeks} semaines à {plan.interestRate}%
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full gap-2 text-destructive hover:text-destructive"
                                                    onClick={() => handleRemoveSavings(product.id, product.name)}
                                                >
                                                    <X className="h-4 w-4" />
                                                    Retirer
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-muted-foreground text-sm">
                                                Aucun plan d'épargne assigné
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminProductSavings;
