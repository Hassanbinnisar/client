import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useCartStore } from "../stores/cartStore";

const StepCart = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const cart = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: ""
  });

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

const handlePlaceOrder = async () => {
    if (!billingInfo.name || !billingInfo.phone || !billingInfo.city || !billingInfo.address) {
      // Soft error: toast or styled message instead of alert
    
      return;
    }
    setLoading(true);
    try {
      console.log("Placing order:", cart, billingInfo, total);
      // Test order
      setTimeout(() => {
        setOrderId("TEST" + Math.floor(Math.random()*10000));
        clearCart();
        setCurrentStep(4);
        alert("Order successful! Order ID: TEST" + Math.floor(Math.random()*10000));
        console.log("Order success!");
      }, 1500);
    } catch (error) {
      console.error("Order error:", error);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-gray-900/95 to-black/90 backdrop-blur-sm" />
      
      <motion.div
        className="relative z-10 mx-auto max-w-4xl h-full flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Top Bar */}
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-6 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all flex items-center gap-2 text-white"
          >
            <X size={24} />
            <span className="font-semibold">Close</span>
          </button>
          
          <div className="flex items-center gap-2 text-white/90">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-medium">{currentStep}/3</span>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            
            {/* Step 1: Cart Review */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-8 text-center">
                    Your Cart
                  </h1>
                  
                  <div className="space-y-6 mb-12">
                    {cart.map((item, index) => (
                      <div key={index} className="group p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 hover:border-white/50 transition-all hover:shadow-2xl">
                        <div className="flex gap-6">
                          <div className="w-28 h-28 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
                            <span className="text-3xl">🕯️</span>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-4 text-lg text-white/90 mb-4">
                              <span>Qty: {item.quantity}</span>
<span className="font-mono">Rs{(item.price || 0).toLocaleString()}</span>

                            </div>
                          </div>
                          
                          <div className="text-right min-w-[120px]">
                            <div className="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
Rs{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl border border-amber-300/50 backdrop-blur-xl mb-12 shadow-2xl">
                    <div className="flex justify-between items-center text-4xl">
                      <span className="font-bold text-white/90">Grand Total</span>
                      <span className="font-black text-5xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Rs{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-4 px-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowRight size={32} />
                    Continue to Checkout
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-12 text-center">
                    Checkout Details
                  </h1>

                  <div className="space-y-6 mb-12">
                    <div className="p-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <CreditCard size={32} className="text-emerald-400" />
                        Cash on Delivery
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-lg font-semibold text-white mb-3">Full Name *</label>
                            <input
                              type="text"
                              value={billingInfo.name}
                              onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                              className="w-full p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 text-xl placeholder-white/60 font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 outline-none transition-all"
                              placeholder="Enter your full name"
    evalue={billingInfo.email}
                              onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                              className="w-full p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 text-xl placeholder-white/60 font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 outline-none transition-all"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-lg font-semibold text-white mb-3">City *</label>
                            <input
                              type="text"
                              value={billingInfo.city}
                              onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                              className="w-full p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 text-xl placeholder-white/60 font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 outline-none transition-all"
                              placeholder="Karachi, Lahore, etc."
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <label className="block text-lg font-semibold text-white mb-3">Complete Delivery Address *</label>
                        <textarea
                          value={billingInfo.address}
                          onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                          className="w-full p-5 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 text-xl placeholder-white/60 font-medium focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 outline-none transition-all resize-vertical min-h-[140px]"
                          placeholder="House number, street, area, landmark..."
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl border border-emerald-400/50 backdrop-blur-xl shadow-2xl mb-12">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-2xl font-bold">Final Amount</span>
                      <span className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Rs{total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-emerald-200 font-medium mt-2 text-center">Cash on Delivery - No advance payment</p>
                  </div>

                  <div className="flex gap-4">
<motion.button
                      onClick={handlePrevStep}
                      className="flex-1 bg-white/20 backdrop-blur-xl border border-white/40 hover:border-white/60 text-white py-5 px-8 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft size={24} />
                      Back to Cart
                    </motion.button>
                    <motion.button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-5 px-8 rounded-3xl font-black text-xl uppercase tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={28} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={28} />
                          Place Order Now
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <div className="w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                    <CheckCircle size={64} className="text-white" />
                  </div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-6">
                    Order Confirmed!
                  </h1>
                  <p className="text-2xl text-white/90 mb-8 max-w-md leading-relaxed">
                    Your order #{orderId?.slice(-6).toUpperCase()} has been placed successfully.
                  </p>
                  <p className="text-xl text-emerald-300 mb-12 font-semibold">
                    Cart has been cleared. Thank you! 🕯️
                  </p>
                  <motion.button
                    onClick={onClose}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StepCart;

