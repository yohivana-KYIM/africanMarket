import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, TrendingUp, Wallet, DollarSign } from 'lucide-react';
import { SavingsCalculation } from '@/types/savings';

interface SavingsCalculatorProps {
    calculation: SavingsCalculation;
    productName?: string;
}

const SavingsCalculator = ({ calculation, productName }: SavingsCalculatorProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
    };

    const getDurationText = (weeks: number) => {
        if (weeks === 1) return '1 semaine';
        if (weeks < 4) return `${weeks} semaines`;
        if (weeks === 4) return '1 mois';
        return `${Math.floor(weeks / 4)} mois`;
    };

    return (
        <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                    <Wallet className="h-5 w-5" />
                    Plan d'Épargne
                    {productName && <span className="text-sm font-normal text-muted-foreground">- {productName}</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Product Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>Prix du produit</span>
                    </div>
                    <span className="font-semibold text-lg">{formatPrice(calculation.productPrice)}</span>
                </div>

                {/* Interest Rate */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>Taux d'intérêt</span>
                    </div>
                    <span className="font-semibold text-lg text-green-600">{calculation.interestRate}%</span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Durée</span>
                    </div>
                    <span className="font-semibold text-lg">{getDurationText(calculation.durationWeeks)}</span>
                </div>

                <Separator />

                {/* Interest Amount */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Intérêts</span>
                    <span className="font-medium text-green-600">+{formatPrice(calculation.totalInterest)}</span>
                </div>

                {/* Total Amount */}
                <div className="flex items-center justify-between bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
                    <span className="font-semibold text-green-800 dark:text-green-300">Montant Total</span>
                    <span className="font-bold text-xl text-green-700 dark:text-green-400">{formatPrice(calculation.totalAmount)}</span>
                </div>

                {/* Weekly Payment */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-lg text-center">
                    <div className="text-sm opacity-90 mb-1">Paiement par semaine</div>
                    <div className="text-2xl font-bold">{formatPrice(calculation.weeklyPayment)}</div>
                    <div className="text-xs opacity-75 mt-1">pendant {calculation.durationWeeks} semaine{calculation.durationWeeks > 1 ? 's' : ''}</div>
                </div>

                {/* Info */}
                <div className="text-xs text-muted-foreground text-center bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    💡 Épargnez progressivement et obtenez votre produit à la fin de la période !
                </div>
            </CardContent>
        </Card>
    );
};

export default SavingsCalculator;
