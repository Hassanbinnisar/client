import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAppStore } from '../stores/appStore';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useCartStore(state => state.items);
  const setShowCartModal = useAppStore(state => state.setShowCartModal);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg border-b border-[#cf5deb]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="https://res.cloudinary.com/danxmqgxb/image/upload/v1776712193/Gemini_Generated_Image_ykj5rqykj5rqykj5_gbf1ux.png" 
              alt="Sandesha Logo"
              className="w-12 h-12 rounded-3xl shadow-2xl group-hover:shadow-3xl object-cover bg-gradient-to-br from-[#cf5deb]/20 to-[#cf5deb]/10 p-2 border-4 border-white/80 hover:border-[#cf5deb]/50 transition-all duration-300"
            />


            <div>
              <h1 className="text-2xl font-serif font-bold text-[#966919] group-hover:text-[#cf5deb] transition-colors">Sandesha</h1>
              <p className="text-sm text-[#966919]/80 group-hover:text-[#966919]">Candle Studios</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link to="/" className="text-lg font-medium text-[#966919] hover:text-[#cf5deb] transition-colors px-3 py-2 rounded-lg hover:bg-[#cf5deb]/10">Home</Link> */}
            {/* <Link to="/cart" className="text-lg font-medium text-[#966919] hover:text-[#cf5deb] transition-colors px-3 py-2 rounded-lg hover:bg-[#cf5deb]/10">Cart</Link>
            <Link to="/admin" className="text-lg font-medium text-[#966919] hover:text-[#cf5deb] transition-colors px-3 py-2 rounded-lg hover:bg-[#cf5deb]/10">Admin</Link> */}
          </nav>

          {/* Right side - Cart & Mobile menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCartModal(true)}
              className="relative p-3 rounded-xl bg-[#cf5deb]/20 hover:bg-[#cf5deb]/30 border border-[#cf5deb]/30 hover:border-[#cf5deb]/50 text-[#966919] hover:text-[#cf5deb] transition-all duration-300 shadow-lg hover:shadow-xl group"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#966919] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {cartTotal}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-xl text-[#966919] hover:bg-[#cf5deb]/20 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#cf5deb]/20 px-4 pb-4">
          <nav className="flex flex-col space-y-4 pt-4">
            <Link to="/" className="text-lg font-medium text-[#966919] hover:text-[#cf5deb] px-4 py-3 rounded-xl hover:bg-[#cf5deb]/10 transition-all" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/cart" className="text-lg font-medium text-[#966919] hover:text-[#cf5deb] px-4 py-3 rounded-xl hover:bg-[#cf5deb]/10 transition-all" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
            <Link to="/admin" className="text-lg font-medium text-[#966919] hover:text-[#cf5deb] px-4 py-3 rounded-xl hover:bg-[#cf5deb]/10 transition-all" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

