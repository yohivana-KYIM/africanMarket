import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp } from 'lucide-react';

interface SavingsBadgeProps {
    durationWeeks: number;
    interestRate: number;
    variant?: 'default' | 'compact';
}

const SavingsBadge = ({ durationWeeks, interestRate, variant = 'default' }: SavingsBadgeProps) => {
    const getDurationText = (weeks: number) => {
        if (weeks === 1) return '1 semaine';
        if (weeks < 4) return `${weeks} semaines`;
        if (weeks === 4) return '1 mois';
        return `${Math.floor(weeks / 4)} mois`;
    };

    if (variant === 'compact') {
        return (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 gap-1">
                <Wallet className="h-3 w-3" />
                Épargne
            </Badge>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 gap-1.5 px-3 py-1">
                <Wallet className="h-3.5 w-3.5" />
                <span className="font-semibold">Épargne {getDurationText(durationWeeks)}</span>
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-700 gap-1 px-2 py-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-semibold">{interestRate}%</span>
            </Badge>
        </div>
    );
};

export default SavingsBadge;
