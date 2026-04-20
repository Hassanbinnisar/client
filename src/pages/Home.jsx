import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import CandleCard from '../components/CandleCard';
import { useCartStore } from '../stores/cartStore';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const q = query(collection(db, 'products'));
    const snapshot = await getDocs(q);
    const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productList);
    setFilteredProducts(productList);
    setLoading(false);
  };

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, products]);

  if (loading) {
    return <div className="min-h-screen bg-[#cf5deb3b] flex items-center justify-center text-[#966919]">Loading candles...</div>;
  }

  return (
    <div className="min-h-screen py-20 bg-[#cf5deb3b] text-[#966919]">
      <div className="text-center mb-16 px-4">
        <motion.img 
          src="https://res.cloudinary.com/danxmqgxb/image/upload/q_auto/f_auto/v1776629069/WhatsApp_Image_2026-04-20_at_1.03.45_AM_e038ay.jpg" 
          alt="Premium Candles"
          className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px] object-cover rounded-3xl shadow-2xl block mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-16 px-4">
        <input 
          type="text" 
          placeholder="Search candles by name or scent..."
          className="w-full px-6 py-4 text-lg border border-[#966919]/30 rounded-3xl shadow-lg focus:outline-none focus:ring-4 focus:ring-[#cf5deb]/50 focus:border-[#966919] transition-all duration-300 bg-white/80 text-[#966919] placeholder-[#966919]/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map(product => (
            <CandleCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <motion.div 
          className="text-center py-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-8 text-[#966919]/30">🔍</div>
          <p className="text-[#966919]/70 text-lg mb-4">No candles found</p>
          <motion.button 
            onClick={() => setSearchQuery('')}
            className="bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] hover:from-[#cf5deb80] hover:to-[#cf5deb] text-[#966919] px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Search
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Home;

