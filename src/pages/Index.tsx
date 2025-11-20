import { useState } from 'react';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CategorySelectionModal from '@/components/CategorySelectionModal';
import WelcomeModal from '@/components/WelcomeModal';
import { usePreferences } from '@/context/PreferencesContext';

const Index = () => {
  const { hasVisited, setSelectedCategories, setInterests, markAsVisited } = usePreferences();
  const [showCategoryModal, setShowCategoryModal] = useState(!hasVisited);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleCategorySelection = (categories: string[]) => {
    setSelectedCategories(categories);
    setShowCategoryModal(false);
    // Show welcome modal after category selection
    setShowWelcomeModal(true);
  };

  const handleWelcomeComplete = (selectedInterests: string[]) => {
    setInterests(selectedInterests);
    markAsVisited();
    setShowWelcomeModal(false);
  };

  return (
    <>
      <CategorySelectionModal
        open={showCategoryModal}
        onClose={handleCategorySelection}
      />
      <WelcomeModal
        open={showWelcomeModal}
        onClose={handleWelcomeComplete}
      />
      <Hero />
      <ProductGrid title="Sélection du moment" limit={6} />
    </>
  );
};

export default Index;