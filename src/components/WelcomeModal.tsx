import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Footprints, Shirt, Watch, Home, Smartphone, Check, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface WelcomeModalProps {
    open: boolean;
    onClose: (selectedInterests: string[]) => void;
}

const interests = [
    { id: 'bags', name: 'Sacs', nameEn: 'Bags', icon: ShoppingBag, category: 'Mode' },
    { id: 'shoes', name: 'Chaussures', nameEn: 'Shoes', icon: Footprints, category: 'Mode' },
    { id: 'clothes', name: 'Vêtements', nameEn: 'Clothes', icon: Shirt, category: 'Mode' },
    { id: 'accessories', name: 'Accessoires', nameEn: 'Accessories', icon: Watch, category: 'Mode' },
    { id: 'home', name: 'Maison', nameEn: 'Home', icon: Home, category: 'Maison' },
    { id: 'electronics', name: 'Électronique', nameEn: 'Electronics', icon: Smartphone, category: 'Électronique' },
];

const WelcomeModal = ({ open, onClose }: WelcomeModalProps) => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interestId: string) => {
        setSelectedInterests(prev =>
            prev.includes(interestId)
                ? prev.filter(id => id !== interestId)
                : [...prev, interestId]
        );
    };

    const handleContinue = () => {
        onClose(selectedInterests);
    };

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <div className="p-8 md:p-12">
                    {/* Logo & Welcome Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            L'EXCELLENCE <span className="text-primary">AFRICAINE</span>
                        </h1>
                        <div className="h-1 w-24 bg-primary mx-auto mb-6"></div>
                    </motion.div>

                    {/* Bilingual Welcome Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-muted/50 rounded-xl p-6 mb-8 space-y-4"
                    >
                        <p className="text-lg leading-relaxed">
                            <span className="font-semibold">Merci pour votre message.</span> Nous ne sommes pas disponibles pour l'instant, mais nous vous répondrons au plus vite.
                        </p>
                        <p className="text-lg leading-relaxed">
                            <span className="font-semibold">Thank you for contacting L'Excellence Africaine!</span> Tell us how we can help you.
                        </p>
                        <div className="pt-4 border-t border-border">
                            <p className="font-medium mb-3">
                                En attendant que nous vous répondons, vous pouvez consulter notre catalogue :
                            </p>
                            <p className="font-medium mb-4">
                                While you wait for our reply, you can take a look at our catalog preview:
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <a href="https://wa.me/c/237651711545" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                        WhatsApp Catalog
                                    </a>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <a href="https://share.google/t9TxiD7xfA2hgi1np" target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4" />
                                        Google Catalog
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interest Selection */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold mb-2 text-center">
                            Quels sont vos centres d'intérêt ?
                        </h2>
                        <p className="text-muted-foreground text-center mb-6">
                            What are your interests?
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {interests.map((interest, index) => {
                                const Icon = interest.icon;
                                const isSelected = selectedInterests.includes(interest.id);

                                return (
                                    <motion.div
                                        key={interest.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                    >
                                        <Card
                                            onClick={() => toggleInterest(interest.id)}
                                            className={`
                        relative p-6 cursor-pointer transition-all duration-300
                        hover:shadow-lg hover:-translate-y-1
                        ${isSelected
                                                    ? 'border-2 border-primary bg-primary/10'
                                                    : 'border-2 border-border hover:border-primary/50'
                                                }
                      `}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                            <div className="flex flex-col items-center text-center gap-3">
                                                <Icon className={`h-8 w-8 ${isSelected ? 'text-primary' : 'text-foreground'}`} />
                                                <div>
                                                    <p className="font-semibold">{interest.name}</p>
                                                    <p className="text-sm text-muted-foreground">{interest.nameEn}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Continue Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="text-center"
                        >
                            <Button
                                onClick={handleContinue}
                                size="lg"
                                className="px-12 py-6 text-lg font-semibold bg-primary hover:bg-primary-dark"
                            >
                                Continuer / Continue
                            </Button>
                            {selectedInterests.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-3">
                                    {selectedInterests.length} {selectedInterests.length === 1 ? 'intérêt sélectionné' : 'intérêts sélectionnés'}
                                </p>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WelcomeModal;
