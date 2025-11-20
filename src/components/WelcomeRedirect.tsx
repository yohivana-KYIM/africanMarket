import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePreferences } from '@/context/PreferencesContext';

const WelcomeRedirect = () => {
    const { hasVisited } = usePreferences();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Only redirect to welcome if:
        // 1. User hasn't visited before
        // 2. Not already on welcome page
        // 3. On the home page
        if (!hasVisited && location.pathname === '/') {
            navigate('/welcome');
        }
    }, [hasVisited, navigate, location]);

    return null;
};

export default WelcomeRedirect;
