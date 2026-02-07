import { type FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Admin from "./pages/Admin";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";

const AppLayout: FC = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { products } = useProducts();

  const siteLayout = (children: React.ReactNode) => (
    <>
      <Header cartCount={cartCount} toggleCart={toggleCart} />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
      {children}
      <Footer />
      <BackToTop />
    </>
  );

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            borderRadius: "0",
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={siteLayout(<Home addToCart={addToCart} products={products} />)}
        />
        <Route
          path="/categorie/:slug"
          element={siteLayout(<Category addToCart={addToCart} products={products} />)}
        />
        <Route
          path="/categorie/:slug/:sub"
          element={siteLayout(<Category addToCart={addToCart} products={products} />)}
        />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

const App: FC = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default App;