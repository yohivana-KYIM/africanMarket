// Types for the savings feature

export interface SavingsPlan {
    id: string;
    name: string;
    durationWeeks: number;
    interestRate: number; // en pourcentage (ex: 5 pour 5%)
    description: string;
}

export interface ProductSavings {
    productId: number;
    savingsPlanId: string;
    isActive: boolean;
    minDeposit?: number; // dépôt minimum optionnel
}

export interface UserSavings {
    id: string;
    productId: number;
    userId: string; // pour l'instant, peut être un ID de session
    totalAmount: number;
    amountSaved: number;
    startDate: Date;
    targetDate: Date;
    payments: SavingsPayment[];
}

export interface SavingsPayment {
    id: string;
    amount: number;
    date: Date;
    method: string;
}

// Helper type for savings calculation
export interface SavingsCalculation {
    productPrice: number;
    interestRate: number;
    durationWeeks: number;
    totalAmount: number;
    weeklyPayment: number;
    totalInterest: number;
}
