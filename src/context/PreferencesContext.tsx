import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferences {
    interests: string[];
    hasVisited: boolean;
    selectedCategories: string[];
}

interface PreferencesContextType {
    interests: string[];
    hasVisited: boolean;
    selectedCategories: string[];
    setInterests: (interests: string[]) => void;
    setSelectedCategories: (categories: string[]) => void;
    markAsVisited: () => void;
    resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<UserPreferences>(() => {
        // Load from localStorage on init
        const saved = localStorage.getItem('userPreferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return { interests: [], hasVisited: false, selectedCategories: [] };
            }
        }
        return { interests: [], hasVisited: false, selectedCategories: [] };
    });

    // Save to localStorage whenever preferences change
    useEffect(() => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }, [preferences]);

    const setInterests = (interests: string[]) => {
        setPreferences(prev => ({ ...prev, interests }));
    };

    const setSelectedCategories = (selectedCategories: string[]) => {
        setPreferences(prev => ({ ...prev, selectedCategories }));
    };

    const markAsVisited = () => {
        setPreferences(prev => ({ ...prev, hasVisited: true }));
    };

    const resetPreferences = () => {
        setPreferences({ interests: [], hasVisited: false, selectedCategories: [] });
        localStorage.removeItem('userPreferences');
    };

    return (
        <PreferencesContext.Provider
            value={{
                interests: preferences.interests,
                hasVisited: preferences.hasVisited,
                selectedCategories: preferences.selectedCategories,
                setInterests,
                setSelectedCategories,
                markAsVisited,
                resetPreferences,
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};
