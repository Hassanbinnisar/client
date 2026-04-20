import React from "react";
import { useCartStore } from "../stores/cartStore";
import { useAppStore } from "../stores/appStore";
import { motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";

const YourCart = ({ onClose }) => {
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const total = getTotal();

const handleCheckout = () => {
    useAppStore.getState().setShowCartModal(false);
    window.location.href = '/checkout';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-xl mb-4">
                <img 
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">Rs {Math.round(item.price || 0)}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black hover:bg-white rounded-lg transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg mx-2">
                        {item.quantity || 1}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black hover:bg-white rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all ml-auto"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-bold text-xl text-gray-900">
                    Rs {Math.round((item.price || 0) * (item.quantity || 1))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <div className="text-right mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-1">Total: Rs {Math.round(total + 289)}</div>
            <p className="text-sm text-gray-500">Cash on Delivery + Rs 289 delivery fee</p>
          </div>
          <motion.button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Checkout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default YourCart;
