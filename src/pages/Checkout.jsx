import React, { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import { Truck, Shield, CreditCard, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const cartItems = useCartStore(state => state.items);
const getTotal = useCartStore(state => state.getTotal);
const DELIVERY_FEE = 220;
const finalTotal = getTotal() + DELIVERY_FEE;

  const clearCart = useCartStore(state => state.clearCart);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    city: '',
    area: '',
    address: '',
    paymentMethod: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create order
      const orderData = {
        ...formData,
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
totalPrice: finalTotal,

        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      console.error('Order error:', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <PackageCheck className="w-16 h-16 text-white" />
            </motion.div>
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Order Placed Successfully!
            </motion.h1>
            <motion.p 
              className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your order has been received and will be processed shortly. You'll receive a confirmation on{' '}
              <span className="font-semibold">{formData.phone}</span>.
            </motion.p>
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 max-w-md mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-green-200">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <Truck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="font-bold text-lg">Fast Delivery</p>
                    <p className="text-sm text-gray-600">2-3 days</p>
                  </div>
                  <div>
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="font-bold text-lg">Secure Payment</p>
                    <p className="text-sm text-gray-600">100% Safe</p>
                  </div>
                </div>
              </div>
              <Link 
                to="/"
                className="block w-full bg-gradient-to-r from-[#966919] to-[#b58919] hover:from-[#b58919] hover:to-[#966919] text-white py-5 px-8 rounded-3xl font-bold text-xl uppercase tracking-wider transition-all shadow-2xl hover:shadow-3xl text-center hover:-translate-y-1"
              >
                Continue Shopping
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
      <div className="min-h-screen bg-[#cf5deb3b] py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl font-serif font-bold text-[#966919] text-center mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Checkout
          </motion.h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Order Summary */}
            <motion.div 
              className="lg:sticky lg:top-24 lg:h-fit bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-4xl shadow-2xl border border-[#cf5deb]/30"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-2xl font-bold text-[#966919] mb-8">Order Summary</h3>
              <div className="space-y-4 mb-8">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#cf5deb]/5 rounded-2xl">
                    <img 
                      src={item.image || '/placeholder-candle.jpg'}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#966919] line-clamp-1">{item.name}</p>
                      <p className="text-sm text-[#966919]/70">x{item.quantity}</p>
                    </div>
                    <div className="font-bold text-lg text-[#cf5deb]">
                      Rs {(item.price * item.quantity).toLocaleString()}

                    </div>
                  </div>
                ))}
              </div>
                <div className="space-y-3 p-6 bg-gradient-to-r from-[#cf5deb]/10 rounded-3xl border border-[#cf5deb]/20">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>Rs {Math.round(getTotal()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-2xl">
<span>Subtotal:</span>
                  <span>Rs {Math.round(getTotal()).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-2xl">
                  <span>Delivery (Rs 220):</span>
                  <span>+ Rs 220</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-3xl pt-4 border-t border-gray-200">
                  <span>Total:</span>
                  <span>Rs {Math.round(finalTotal).toLocaleString()}</span>

                </div>
              </div>

            </motion.div>

            {/* Delivery Form */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="bg-white/90 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-[#cf5deb]/30">
                <h3 className="text-2xl font-bold text-[#966919] mb-8 flex items-center gap-3">
                  <Truck size={28} />
                  Delivery Details
                </h3>
                <form onSubmit={handleOrder} className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-[#966919]/90 mb-3">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg placeholder-[#966919]/50 shadow-lg"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-[#966919]/90 mb-3">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg placeholder-[#966919]/50 shadow-lg"
                      placeholder="03XXXXXXXXX"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold text-[#966919]/90 mb-3">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all placeholder-[#966919]/50 shadow-lg"
                        placeholder="Lahore"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-[#966919]/90 mb-3">Area *</label>
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all placeholder-[#966919]/50 shadow-lg"
                        placeholder="Gulberg"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-[#966919]/90 mb-3">Complete Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all resize-vertical text-lg placeholder-[#966919]/50 shadow-lg"
                      placeholder="House #123, Street ABC, Landmark XYZ"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-[#966919]/90 mb-3">Payment Method</label>
<div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-6 rounded-3xl border-2 border-emerald-200/50 backdrop-blur-xl shadow-2xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                          <PackageCheck className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-emerald-800">Cash on Delivery</h4>
                          <p className="text-emerald-700 font-semibold text-lg">fast Delivery</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-white/50 rounded-2xl shadow-lg">
                          <Truck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Lightning Fast</p>
                          <p className="text-xs text-emerald-700">2-3 days delivery</p>
                        </div>
                        <div className="text-center p-4 bg-white/50 rounded-2xl shadow-lg">
                          <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">100% Safe</p>
                          <p className="text-xs text-emerald-700">Pay after inspection</p>
                        </div>
                        <div className="text-center p-4 bg-white/50 rounded-2xl shadow-lg">
                          <CreditCard className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">No Advance</p>
                          <p className="text-xs text-emerald-700">Pay at doorstep</p>
                        </div>
                      </div>
                      <div className="text-center p-6 bg-white/70 rounded-2xl shadow-inner border border-emerald-100">
                        <p className="text-2xl font-serif font-bold text-emerald-800 mb-2">Rs {Math.round(finalTotal).toLocaleString()}</p>

                        <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Total with Delivery</p>
                      </div>
                    </div>
                    <input type="hidden" name="paymentMethod" value="COD" />

                  </div>

                  <motion.button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#966919] to-[#b58919] hover:from-[#b58919] hover:to-[#966919] text-white py-6 px-8 rounded-3xl font-bold text-2xl uppercase tracking-wider transition-all shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-4 min-h-[70px]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <PackageCheck size={32} />
Place Order - Rs {Math.round(finalTotal).toLocaleString()}


                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

