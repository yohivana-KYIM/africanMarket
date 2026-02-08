import { useState, type FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import WishlistPanel from "./components/WishlistPanel";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useCart } from "./hooks/useCart";
import { useProducts } from "./hooks/useProducts";
import { useWishlist } from "./hooks/useWishlist";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

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
  const {
    wishlistItems,
    wishlistCount,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
  } = useWishlist();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const toggleWishlistPanel = () => setIsWishlistOpen((prev) => !prev);

  const siteLayout = (children: React.ReactNode) => (
    <>
      <Header
        cartCount={cartCount}
        toggleCart={toggleCart}
        wishlistCount={wishlistCount}
        toggleWishlist={toggleWishlistPanel}
      />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
      <WishlistPanel
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        removeFromWishlist={removeFromWishlist}
        addToCart={addToCart}
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
          element={siteLayout(
            <Home
              addToCart={addToCart}
              products={products}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
            />
          )}
        />
        <Route
          path="/categorie/:slug"
          element={siteLayout(
            <Category
              addToCart={addToCart}
              products={products}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
            />
          )}
        />
        <Route
          path="/categorie/:slug/:sub"
          element={siteLayout(
            <Category
              addToCart={addToCart}
              products={products}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
            />
          )}
        />
        <Route
          path="/product/:id"
          element={siteLayout(
            <ProductDetail
              addToCart={addToCart}
              products={products}
              toggleWishlist={toggleWishlist}
              isInWishlist={isInWishlist}
            />
          )}
        />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
