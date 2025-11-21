import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSavings } from '@/context/SavingsContext';
import { SavingsPlan } from '@/types/savings';
import { toast } from 'sonner';

const AdminSavingsPlans = () => {
    const { savingsPlans, addSavingsPlan, updateSavingsPlan, deleteSavingsPlan } = useSavings();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        durationWeeks: 2,
        interestRate: 5,
        description: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            durationWeeks: 2,
            interestRate: 5,
            description: ''
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || formData.durationWeeks <= 0 || formData.interestRate < 0) {
            toast.error('Veuillez remplir tous les champs correctement');
            return;
        }

        if (editingId) {
            updateSavingsPlan(editingId, formData);
            toast.success('Plan d\'épargne mis à jour avec succès');
        } else {
            addSavingsPlan(formData);
            toast.success('Plan d\'épargne créé avec succès');
        }

        resetForm();
    };

    const handleEdit = (plan: SavingsPlan) => {
        setFormData({
            name: plan.name,
            durationWeeks: plan.durationWeeks,
            interestRate: plan.interestRate,
            description: plan.description
        });
        setEditingId(plan.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le plan "${name}" ?`)) {
            deleteSavingsPlan(id);
            toast.success('Plan d\'épargne supprimé');
        }
    };

    const getDurationText = (weeks: number) => {
        if (weeks === 1) return '1 semaine';
        if (weeks < 4) return `${weeks} semaines`;
        if (weeks === 4) return '1 mois';
        return `${Math.floor(weeks / 4)} mois`;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-primary" />
                    Gestion des Plans d'Épargne
                </h1>
                <p className="text-muted-foreground text-lg">
                    Créez et gérez les plans d'épargne pour vos produits
                </p>
            </div>

            {/* Add/Edit Form */}
            {isAdding ? (
                <Card className="mb-8 border-2 border-primary">
                    <CardHeader>
                        <CardTitle>{editingId ? 'Modifier' : 'Nouveau'} Plan d'Épargne</CardTitle>
                        <CardDescription>
                            Configurez les détails du plan d'épargne
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom du plan *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: Épargne Express"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Durée (en semaines) *</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        value={formData.durationWeeks}
                                        onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 1 })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="interest">Taux d'intérêt (%) *</Label>
                                    <Input
                                        id="interest"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.interestRate}
                                        onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Décrivez ce plan d'épargne..."
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {editingId ? 'Mettre à jour' : 'Créer'}
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
                                    <X className="h-4 w-4" />
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Button onClick={() => setIsAdding(true)} className="mb-8 gap-2" size="lg">
                    <Plus className="h-5 w-5" />
                    Créer un nouveau plan
                </Button>
            )}

            {/* Plans List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingsPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-xl">{plan.name}</span>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(plan)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(plan.id, plan.name)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Durée</span>
                                    <span className="font-semibold text-blue-700 dark:text-blue-400">
                                        {getDurationText(plan.durationWeeks)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Taux d'intérêt</span>
                                    <span className="font-bold text-lg text-green-700 dark:text-green-400">
                                        {plan.interestRate}%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {savingsPlans.length === 0 && !isAdding && (
                <Card className="text-center py-12">
                    <CardContent>
                        <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">Aucun plan d'épargne</h3>
                        <p className="text-muted-foreground mb-4">
                            Commencez par créer votre premier plan d'épargne
                        </p>
                        <Button onClick={() => setIsAdding(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Créer un plan
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminSavingsPlans;
