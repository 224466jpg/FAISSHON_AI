import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import RecommendationsPage from './pages/RecommendationsPage';
import WardrobePage from './pages/WardrobePage';
import StyleTipsPage from './pages/StyleTipsPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import ContactPage from './pages/ContactPage';
import ShoppingPage from './pages/ShoppingPage';
import CartPage from './pages/CartPage';
import './App.css';

function AnimatedRoutes({
  cartItems,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="route-stage"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/recommendations" element={<RecommendationsPage onAddToCart={addToCart} />} />
          <Route path="/shopping" element={<ShoppingPage onAddToCart={addToCart} />} />
          <Route
            path="/cart"
            element={(
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
                onClear={clearCart}
              />
            )}
          />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/style-tips" element={<StyleTipsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/fit-check" element={<Navigate to="/upload" replace />} />
          <Route path="/editorial" element={<Navigate to="/recommendations" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('styleai-cart')
        || localStorage.getItem('fashion-ai-cart')
        || '[]',
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('styleai-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const addToCart = (product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);

      if (existing) {
        return items.map((item) => (
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }

      return [...items, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((items) => (
      items
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    ));
  };

  const removeFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar cartCount={cartCount} />
        <AnimatedRoutes
          cartItems={cartItems}
          addToCart={addToCart}
          updateCartQuantity={updateCartQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
