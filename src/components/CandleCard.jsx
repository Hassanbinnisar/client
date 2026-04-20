"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const CandleCard = ({ product, onAdd }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product);
    onAdd?.(product);
  };

  return (
    <motion.div 
      layout 
      className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl hover:-translate-y-4 transition-all duration-500 border border-[#cf5deb]/20 hover:border-[#cf5deb]/40 overflow-hidden h-[480px] sm:h-[500px] flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      onClick={() => window.location.href = `/product/${product.id}`}
    >
      {/* Quick actions */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
        <button className="w-12 h-12 bg-white/80 hover:bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-[#cf5deb]/30">
          <Heart className="w-5 h-5 text-[#966919] hover:text-red-500" />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 mb-6 flex items-center justify-center relative min-h-[220px] sm:min-h-[260px]">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#cf5deb]/10 to-[#cf5deb]/5 rounded-2xl overflow-hidden group-hover:ring-4 group-hover:ring-[#cf5deb]/20 transition-all">
          {!imageLoaded && (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#cf5deb]/20 to-[#cf5deb]/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-dashed border-[#cf5deb]/30 animate-pulse">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-[#966919]/50" />
            </div>
          )}
          <img
            src={product.imageUrl || product.image || '/placeholder-candle.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl shadow-2xl cursor-pointer"
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-gradient-to-r from-[#cf5deb]/30 to-[#cf5deb]/20 text-[#966919] text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
              {product.category || 'Premium'}
            </span>
            <div className="flex items-center gap-1 text-[#966919]/70 text-xs sm:text-sm">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-amber-400" />
              <span>4.9</span>
            </div>
          </div>
          
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#966919] line-clamp-2 group-hover:text-[#cf5deb] transition-colors leading-tight">
            {product.name}
          </h3>
          
          <p className="text-[#966919]/70 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Button */}
        <div className="pt-4 border-t border-[#cf5deb]/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#966919]">Rs {Math.round(product.price)}</span>
            <span className="text-xs sm:text-sm text-[#966919]/70 font-medium">In Stock: {product.stock || '✓'}</span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] hover:from-[#cf5deb80] hover:to-[#cf5deb] text-[#966919] font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-xs sm:text-sm group-hover:gap-4"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#cf5deb]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
    </motion.div>
  );
};

export default CandleCard;

