import { useState } from 'react';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import WelcomeRedirect from '@/components/WelcomeRedirect';
import CategorySelectionModal from '@/components/CategorySelectionModal';
import { usePreferences } from '@/context/PreferencesContext';

const Index = () => {
  const { hasVisited, setSelectedCategories, markAsVisited } = usePreferences();
  const [showModal, setShowModal] = useState(!hasVisited);

  const handleCategorySelection = (categories: string[]) => {
    setSelectedCategories(categories);
    markAsVisited();
    setShowModal(false);
  };

  return (
    <>
      <CategorySelectionModal
        open={showModal}
        onClose={handleCategorySelection}
      />
      <WelcomeRedirect />
      <Hero />
      <ProductGrid title="Sélection du moment" limit={6} />
    </>
  );
};

export default Index;