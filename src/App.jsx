import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import ProductDetail from './pages/ProductDetail';
import Footer from './pages/Footer';
import YourCart from './components/YourCart';

import { useState } from 'react';
import { useCartStore } from './stores/cartStore';
import { useAppStore } from './stores/appStore';
import './App.css';

function App() {
  const showCartModal = useAppStore(state => state.showCartModal);
  const cartItems = useCartStore(state => state.items);
  
  return (
    <Router>
      <div className="min-h-screen bg-[#cf5deb3b] text-[#966919]">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
        {showCartModal && (
          <YourCart 
            onClose={() => useAppStore.getState().setShowCartModal(false)} 
          />
        )}
      </div>
    </Router>
  );
}

export default App;

