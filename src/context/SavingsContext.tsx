import { createContext, useContext, useEffect, useState } from 'react';
import { SavingsPlan, ProductSavings, SavingsCalculation } from '@/types/savings';

interface SavingsContextValue {
    savingsPlans: SavingsPlan[];
    productSavings: ProductSavings[];
    addSavingsPlan: (plan: Omit<SavingsPlan, 'id'>) => void;
    updateSavingsPlan: (id: string, plan: Partial<SavingsPlan>) => void;
    deleteSavingsPlan: (id: string) => void;
    assignSavingsToProduct: (productId: number, planId: string, minDeposit?: number) => void;
    removeSavingsFromProduct: (productId: number) => void;
    getSavingsForProduct: (productId: number) => ProductSavings | undefined;
    calculateSavings: (productPrice: number, planId: string) => SavingsCalculation | null;
    toggleProductSavings: (productId: number) => void;
}

const SavingsContext = createContext<SavingsContextValue | undefined>(undefined);

const SAVINGS_PLANS_KEY = 'africa_market_savings_plans';
const PRODUCT_SAVINGS_KEY = 'africa_market_product_savings';

// Default savings plans
const defaultSavingsPlans: SavingsPlan[] = [
    {
        id: 'plan-2w-5',
        name: 'Épargne Express',
        durationWeeks: 2,
        interestRate: 5,
        description: 'Plan d\'épargne rapide sur 2 semaines avec 5% d\'intérêt'
    },
    {
        id: 'plan-4w-3',
        name: 'Épargne Standard',
        durationWeeks: 4,
        interestRate: 3,
        description: 'Plan d\'épargne standard sur 1 mois avec 3% d\'intérêt'
    },
    {
        id: 'plan-8w-2',
        name: 'Épargne Flexible',
        durationWeeks: 8,
        interestRate: 2,
        description: 'Plan d\'épargne flexible sur 2 mois avec 2% d\'intérêt'
    }
];

export const SavingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [savingsPlans, setSavingsPlans] = useState<SavingsPlan[]>(() => {
        try {
            const stored = localStorage.getItem(SAVINGS_PLANS_KEY);
            return stored ? JSON.parse(stored) : defaultSavingsPlans;
        } catch {
            return defaultSavingsPlans;
        }
    });

    const [productSavings, setProductSavings] = useState<ProductSavings[]>(() => {
        try {
            const stored = localStorage.getItem(PRODUCT_SAVINGS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist savings plans
    useEffect(() => {
        localStorage.setItem(SAVINGS_PLANS_KEY, JSON.stringify(savingsPlans));
    }, [savingsPlans]);

    // Persist product savings
    useEffect(() => {
        localStorage.setItem(PRODUCT_SAVINGS_KEY, JSON.stringify(productSavings));
    }, [productSavings]);

    const addSavingsPlan = (plan: Omit<SavingsPlan, 'id'>) => {
        const newPlan: SavingsPlan = {
            ...plan,
            id: `plan-${Date.now()}`
        };
        setSavingsPlans(prev => [...prev, newPlan]);
    };

    const updateSavingsPlan = (id: string, updates: Partial<SavingsPlan>) => {
        setSavingsPlans(prev =>
            prev.map(plan => (plan.id === id ? { ...plan, ...updates } : plan))
        );
    };

    const deleteSavingsPlan = (id: string) => {
        setSavingsPlans(prev => prev.filter(plan => plan.id !== id));
        // Also remove from products
        setProductSavings(prev => prev.filter(ps => ps.savingsPlanId !== id));
    };

    const assignSavingsToProduct = (productId: number, planId: string, minDeposit?: number) => {
        setProductSavings(prev => {
            const existing = prev.find(ps => ps.productId === productId);
            if (existing) {
                return prev.map(ps =>
                    ps.productId === productId
                        ? { ...ps, savingsPlanId: planId, minDeposit, isActive: true }
                        : ps
                );
            }
            return [...prev, { productId, savingsPlanId: planId, isActive: true, minDeposit }];
        });
    };

    const removeSavingsFromProduct = (productId: number) => {
        setProductSavings(prev => prev.filter(ps => ps.productId !== productId));
    };

    const toggleProductSavings = (productId: number) => {
        setProductSavings(prev =>
            prev.map(ps =>
                ps.productId === productId ? { ...ps, isActive: !ps.isActive } : ps
            )
        );
    };

    const getSavingsForProduct = (productId: number): ProductSavings | undefined => {
        return productSavings.find(ps => ps.productId === productId && ps.isActive);
    };

    const calculateSavings = (productPrice: number, planId: string): SavingsCalculation | null => {
        const plan = savingsPlans.find(p => p.id === planId);
        if (!plan) return null;

        const totalInterest = productPrice * (plan.interestRate / 100);
        const totalAmount = productPrice + totalInterest;
        const weeklyPayment = totalAmount / plan.durationWeeks;

        return {
            productPrice,
            interestRate: plan.interestRate,
            durationWeeks: plan.durationWeeks,
            totalAmount,
            weeklyPayment,
            totalInterest
        };
    };

    const value: SavingsContextValue = {
        savingsPlans,
        productSavings,
        addSavingsPlan,
        updateSavingsPlan,
        deleteSavingsPlan,
        assignSavingsToProduct,
        removeSavingsFromProduct,
        getSavingsForProduct,
        calculateSavings,
        toggleProductSavings
    };

    return (
        <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>
    );
};

export const useSavings = () => {
    const ctx = useContext(SavingsContext);
    if (!ctx) throw new Error('useSavings must be used within SavingsProvider');
    return ctx;
};
