import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Services from "./pages/Services";
import Layout from "@/components/Layout";
import { CartProvider } from "@/context/CartContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { SavingsProvider } from "@/context/SavingsContext";
import Checkout from "@/pages/Checkout";
import Category from "@/pages/Category";
import AfricanMarket from "@/pages/AfricanMarket";
import WelcomePage from "@/pages/WelcomePage";
import SavingsPage from "@/pages/SavingsPage";
import AdminSavingsPlans from "@/pages/AdminSavingsPlans";
import AdminProductSavings from "@/pages/AdminProductSavings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PreferencesProvider>
      <SavingsProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Welcome page - shown outside Layout */}
                <Route path="/welcome" element={<WelcomePage />} />

                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/african-market" element={<AfricanMarket />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/savings" element={<SavingsPage />} />
                  <Route path="/admin/savings/plans" element={<AdminSavingsPlans />} />
                  <Route path="/admin/savings/products" element={<AdminProductSavings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </SavingsProvider>
    </PreferencesProvider>
  </QueryClientProvider>
);

export default App;
