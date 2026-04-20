import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCartStore } from '../stores/cartStore';
import { ArrowLeft, ShoppingCart, Minus, Plus, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#cf5deb3b] text-[#966919]">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#cf5deb3b] text-[#966919]">Product not found</div>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#cf5deb3b] text-[#966919] pt-4 sm:pt-8 pb-20">
      {/* No header gap - starts immediately */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#966919]/80 hover:text-[#cf5deb] mb-8 sm:mb-12 font-medium transition-colors">
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to shop</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image - Full height responsive */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full"
          >
            <div className="aspect-[4/5] w-full bg-gradient-to-br from-[#cf5deb]/10 to-[#cf5deb]/5 rounded-3xl overflow-hidden shadow-2xl group hover:ring-4 hover:ring-[#cf5deb]/30 transition-all">
              <img 
                src={product.image || product.imageUrl || '/placeholder-candle.jpg'} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <button className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-[#cf5deb]/30 hover:scale-110">
                <Heart size={22} className="text-[#966919] hover:text-red-500" />
              </button>
            </div>
          </motion.div>

          {/* Details - Responsive spacing */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 lg:space-y-8 pt-4 lg:pt-0"
          >
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#cf5deb]">
                Rs {Math.round(product.price || 289)}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-[#cf5deb]/20">
              <p className="text-base sm:text-lg text-[#966919]/90 leading-relaxed max-w-2xl">
                {product.description || 'Premium handcrafted scented candle made with natural soy wax and essential oils. Long-lasting fragrance for your home.'}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#cf5deb]/30">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#cf5deb]/10 to-[#cf5deb]/5 rounded-2xl border border-[#cf5deb]/20">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:bg-[#cf5deb]/10 transition-all"
                  >
                    <Minus size={20} className="text-[#966919]" />
                  </button>
                  <span className="w-20 text-center text-2xl font-bold text-[#966919]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:bg-[#cf5deb]/10 transition-all"
                  >
                    <Plus size={20} className="text-[#966919]" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] hover:from-[#cf5deb80] hover:to-[#cf5deb] text-[#966919] font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-wider text-sm font-semibold min-h-[56px]"
                >
                  <ShoppingCart size={24} />
                  Add to Cart ({quantity})
                </button>
              </div>
            </div>

            {/* Product Info Grid */}
            {/* <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
              <div className="bg-white/50 backdrop-blur p-4 rounded-xl shadow-md border border-[#cf5deb]/20">
                <span className="font-semibold text-[#966919]/90 block mb-1">Category</span>
                <span className="font-bold">{product.category?.toUpperCase() || 'PREMIUM'}</span>
              </div>
              <div className="bg-white/50 backdrop-blur p-4 rounded-xl shadow-md border border-[#cf5deb]/20">
                <span className="font-semibold text-[#966919]/90 block mb-1">Burn Time</span>
                <span className="font-bold">4-8 hours</span>
              </div>
              <div className="bg-white/50 backdrop-blur p-4 rounded-xl shadow-md border border-[#cf5deb]/20">
                <span className="font-semibold text-[#966919]/90 block mb-1">Size</span>
                <span className="font-bold">200g</span>
              </div>
              <div className="bg-white/50 backdrop-blur p-4 rounded-xl shadow-md border border-[#cf5deb]/20">
                <span className="font-semibold text-[#966919]/90 block mb-1">Wax</span>
                <span className="font-bold">Soy Wax</span>
              </div>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

