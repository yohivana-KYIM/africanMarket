import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="container mx-auto px-4 py-24">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oups ! La page demandée est introuvable.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="btn-hero">Retour à l’accueil</Link>
          <Link to="/services" className="btn-secondary-hero">Voir nos services</Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
