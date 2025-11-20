import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Footprints,
    Home,
    Shirt,
    Laptop,
    UtensilsCrossed,
    GraduationCap,
    BookOpen,
    Check,
    X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CategorySelectionModalProps {
    open: boolean;
    onClose: (selectedCategories: string[]) => void;
}

const categories = [
    { id: 'sac', name: 'Sac', icon: ShoppingBag, color: 'from-purple-500 to-pink-500' },
    { id: 'chaussures', name: 'Chaussures', icon: Footprints, color: 'from-blue-500 to-cyan-500' },
    { id: 'accessoires-maison', name: 'Accessoires maison', icon: Home, color: 'from-green-500 to-emerald-500' },
    { id: 'vetements', name: 'Vêtements', icon: Shirt, color: 'from-orange-500 to-red-500' },
    { id: 'appareil', name: 'Appareil', icon: Laptop, color: 'from-indigo-500 to-purple-500' },
    { id: 'nourriture', name: 'Nourriture', icon: UtensilsCrossed, color: 'from-yellow-500 to-orange-500' },
    { id: 'etudes', name: 'Études', icon: GraduationCap, color: 'from-teal-500 to-green-500' },
    { id: 'culture', name: 'Culture', icon: BookOpen, color: 'from-rose-500 to-pink-500' },
];

const CategorySelectionModal = ({ open, onClose }: CategorySelectionModalProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleConfirm = () => {
        onClose(selectedCategories);
    };

    const handleSkip = () => {
        onClose([]);
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 p-6 border-b">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Bienvenue ! 👋
                        </DialogTitle>
                        <DialogDescription className="text-lg mt-2">
                            Sélectionnez vos centres d'intérêt pour personnaliser votre expérience
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategories.includes(category.id);

                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card
                                        onClick={() => toggleCategory(category.id)}
                                        className={`
                      relative cursor-pointer p-6 transition-all duration-300 hover:scale-105
                      ${isSelected
                                                ? 'border-2 border-primary shadow-lg shadow-primary/20'
                                                : 'border-2 border-transparent hover:border-muted-foreground/20'
                                            }
                    `}
                                    >
                                        {/* Selection Indicator */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5 shadow-lg"
                                                >
                                                    <Check className="h-4 w-4 text-primary-foreground" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Icon with Gradient Background */}
                                        <div className={`
                      bg-gradient-to-br ${category.color} 
                      rounded-2xl w-16 h-16 flex items-center justify-center mb-4 mx-auto
                      ${isSelected ? 'scale-110' : ''}
                      transition-transform duration-300
                    `}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>

                                        {/* Category Name */}
                                        <h3 className={`
                      text-center font-semibold text-sm
                      ${isSelected ? 'text-primary' : 'text-foreground'}
                      transition-colors duration-300
                    `}>
                                            {category.name}
                                        </h3>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Selected Count */}
                    {selectedCategories.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-4"
                        >
                            <p className="text-sm text-muted-foreground">
                                {selectedCategories.length} catégorie{selectedCategories.length > 1 ? 's' : ''} sélectionnée{selectedCategories.length > 1 ? 's' : ''}
                            </p>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={handleSkip}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Passer
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={selectedCategories.length === 0}
                            className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                            <Check className="h-4 w-4" />
                            Confirmer {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CategorySelectionModal;
