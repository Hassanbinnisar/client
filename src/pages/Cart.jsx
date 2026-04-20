import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useAppStore } from '../stores/appStore';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, PackageCheck } from 'lucide-react';

const Cart = () => {
  const cartItems = useCartStore(state => state.items);
  const getTotal = useCartStore(state => state.getTotal);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const clearCart = useCartStore(state => state.clearCart);

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#cf5deb3b] py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center py-32">
            <motion.div 
              className="text-6xl sm:text-8xl mb-8 text-[#966919]/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              🛒
            </motion.div>
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#966919] mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your Cart is Empty
            </motion.h2>
            <motion.p 
              className="text-[#966919]/70 mb-12 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Looks like you haven't added any beautiful candles yet. Explore our premium collection!
            </motion.p>
            <motion.div 
              className="space-y-4 max-w-md mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/" 
                className="block w-full bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] hover:from-[#cf5deb80] hover:to-[#cf5deb] text-[#966919] py-5 px-8 rounded-3xl font-bold text-lg uppercase tracking-wider transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#cf5deb3b] py-12 sm:py-20 px-4 sm:px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16 sm:mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#966919] mb-4 leading-tight">
              Shopping Cart
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg sm:text-xl text-[#966919]/80 font-medium">
              <span>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#cf5deb]">
                Rs {Math.round(getTotal())}
              </span>
            </div>
          </motion.div>

          {/* Cart Items */}
          <div className="space-y-6 mb-16">
            {cartItems.map((item, index) => (
              <motion.div 
                key={item.id || index}
                className="group bg-white/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl hover:shadow-3xl border border-[#cf5deb]/20 hover:border-[#cf5deb]/40 transition-all duration-500 flex flex-col sm:flex-row gap-6 sm:gap-8 min-h-[120px] sm:min-h-[160px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform">
                  <img 
                    src={item.image || item.imageUrl || '/placeholder-candle.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#966919] line-clamp-2 mb-2 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[#966919]/70 text-sm sm:text-base line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Price */}
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#cf5deb] mb-4 sm:mb-0">
                    Rs {Math.round(item.price * item.quantity)}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-2 sm:pt-0">
                  {/* Quantity */}
                  <div className="flex items-center gap-3 bg-[#cf5deb]/20 p-3 sm:p-4 rounded-2xl border border-[#cf5deb]/30">
                    <button 
                      onClick={() => updateQuantity(item.id || index, item.quantity - 1)}
                      className="w-12 h-12 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all text-[#966919]"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="min-w-[3rem] text-center text-xl sm:text-2xl font-bold text-[#966919] px-4">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id || index, item.quantity + 1)}
                      className="w-12 h-12 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all text-[#966919]"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button 
                    onClick={() => removeFromCart(item.id || index)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500/90 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg text-sm sm:text-base whitespace-nowrap"
                  >
                    <Trash2 size={18} className="inline mr-1" />
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Sticky Footer */}
          <motion.div 
            className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-[#cf5deb]/30 sticky bottom-20 max-w-2xl mx-auto sm:bottom-24 z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-right mb-8 sm:mb-12">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#966919] mb-2 tracking-tight">
                Rs {Math.round(getTotal())}
              </div>
              <div className="text-[#966919]/70 uppercase tracking-wider text-base sm:text-lg font-semibold mb-6">
                incl. taxes • Free shipping • COD available
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={clearCart}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-sm hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl"
              >
                Clear Cart
              </button>
              <Link 
                to="/checkout"
                className="flex-1 bg-gradient-to-r from-[#966919] to-[#b58919] hover:from-[#b58919] hover:to-[#966919] text-white py-4 px-6 rounded-2xl font-bold text-lg uppercase tracking-wider hover:scale-[1.02] transition-all shadow-2xl hover:shadow-3xl text-center flex items-center justify-center gap-3"
              >
                <PackageCheck size={24} />
                Proceed to Checkout
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Cart;

