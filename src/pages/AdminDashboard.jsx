import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, Edit3, Plus, Package, CheckCircle, Clock, User, MapPin, Edit, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';


const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pending: 0, completed: 0, revenue: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);
  
  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Premium',
    imageUrl: '',
    stock: 100
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Orders
      const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      const allOrders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Stats
      const totalOrders = allOrders.length;
      const pending = allOrders.filter(o => o.status === 'pending').length;
      const completed = allOrders.filter(o => o.status === 'delivered').length;
      const revenue = allOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
      
      setStats({ totalOrders, pending, completed, revenue: Math.round(revenue), totalProducts: 0 });
      setOrders(allOrders);

      // Products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
      setStats(prev => ({ ...prev, totalProducts: productsList.length }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    await updateDoc(doc(db, 'orders', orderId), { status });
    fetchAllData();
  };

  const deleteOrder = async (orderId) => {
    if (confirm('Delete this order?')) {
      await deleteDoc(doc(db, 'orders', orderId));
      fetchAllData();
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        createdAt: new Date().toISOString()
      };
      console.log('Adding product:', productData);
      await addDoc(collection(db, 'products'), productData);
      console.log('✅ Product added successfully');
      Swal.fire({
        icon: 'success',
        title: 'Product Added!',
        text: 'Your new product has been added successfully',
        confirmButtonColor: '#cf5deb',
        background: '#1a1a1a',
        color: 'white'
      });

      setNewProduct({ name: '', price: '', description: '', category: 'Premium', imageUrl: '', stock: 100 });

      setShowProductForm(false);
      fetchAllData();
    } catch (error) {
      console.error('❌ Error adding product:', error);
      alert('Error adding product: ' + error.message + '\nCheck console & Firebase rules');
    }
  };

  const editProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      category: product.category || 'Premium',
      imageUrl: product.imageUrl || '',
      stock: product.stock || 100
    });
    setShowProductForm(true);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        updatedAt: new Date()
      });
      console.log('Product updated');
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', description: '', category: 'Premium', imageUrl: '', stock: 100 });
      setShowProductForm(false);
      fetchAllData();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating: ' + error.message);
    }
  };

  const deleteProduct = async (productId) => {
    if (confirm('Delete this product? This cannot be undone.')) {
      await deleteDoc(doc(db, 'products', productId));
      console.log('Product deleted');
      fetchAllData();
    }
  };

  const renderOrderItems = (orderProducts) => {
    if (!orderProducts || orderProducts.length === 0) return <p className="text-gray-500 italic text-sm">No items</p>;
    
    try {
      const items = Array.isArray(orderProducts) ? orderProducts : JSON.parse(orderProducts || '[]');
      return items.slice(0, 3).map((item, index) => (
        <div key={index} className="flex justify-between py-1">
          <span className="font-medium text-sm truncate">{item.name || item.candleName} x{item.qty || item.quantity}</span>
          <span className="font-bold text-sm">Rs {(item.price * (item.qty || item.quantity)).toLocaleString()}</span>

        </div>
      ));
    } catch {
      return <p className="text-gray-500 italic text-sm">Items unavailable</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#cf5deb3b] to-white flex items-center justify-center p-8">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Package className="w-24 h-24 text-[#cf5deb] mx-auto mb-6" />
          <p className="text-2xl font-bold text-[#966919] text-center">Loading Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cf5deb3b]/50 to-[#cf5deb3b] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#966919]">Admin Dashboard</h1>
            <p className="text-[#966919]/70">Manage orders and products</p>
          </div>
          <div className="flex gap-3">
            <motion.button 
              onClick={fetchAllData}
              className="px-6 py-3 bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] text-[#966919] rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span>🔄</span> Refresh
            </motion.button>
            <motion.button 
              onClick={() => {
                setShowProductForm(true);
                setEditingProduct(null);
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Plus size={20} />
              Add Product
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
          <motion.div className="bg-white/90 p-8 rounded-3xl shadow-2xl border border-[#cf5deb]/20 text-center hover:shadow-3xl transition-all cursor-pointer group" whileHover={{ scale: 1.02 }}>
            <Package className="w-16 h-16 text-[#cf5deb] mx-auto mb-6 group-hover:rotate-6" />
            <div className="text-4xl lg:text-5xl font-bold text-[#966919] mb-2">{stats.totalProducts}</div>
            <p className="text-[#966919]/70 font-semibold uppercase tracking-wider">Products</p>
          </motion.div>
          <motion.div className="bg-white/90 p-8 rounded-3xl shadow-2xl border border-[#cf5deb]/20 text-center hover:shadow-3xl transition-all cursor-pointer group" whileHover={{ scale: 1.02 }}>
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <div className="text-4xl lg:text-5xl font-bold text-[#966919] mb-2">{stats.pending}</div>
            <p className="text-[#966919]/70 font-semibold uppercase tracking-wider">Pending Orders</p>
          </motion.div>
          <motion.div className="bg-white/90 p-8 rounded-3xl shadow-2xl border border-[#cf5deb]/20 text-center hover:shadow-3xl transition-all cursor-pointer group" whileHover={{ scale: 1.02 }}>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <div className="text-4xl lg:text-5xl font-bold text-[#966919] mb-2">{stats.completed}</div>
            <p className="text-[#966919]/70 font-semibold uppercase tracking-wider">Completed</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-[#cf5deb] to-[#cf5deb80] p-8 rounded-3xl shadow-2xl text-white text-center hover:shadow-3xl group" whileHover={{ scale: 1.02 }}>
            <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
              <span className="text-xl font-bold">Rs</span>

            </div>
            <div className="text-3xl lg:text-4xl font-bold mb-2">{stats.revenue.toLocaleString()}</div>
            <p className="font-semibold uppercase tracking-wider opacity-90">Total Revenue</p>
          </motion.div>
        </motion.div>

        {/* Product Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#966919] flex items-center gap-3">
              <Edit3 size={32} />
              Products ({products.length})
            </h2>
            <motion.button 
              onClick={() => {
                setShowProductForm(true);
                setEditingProduct(null);
              }}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Plus size={24} />
              Add New Product
            </motion.button>
          </div>

          {/* Product Form */}
          {showProductForm && (
            <motion.div 
              className="bg-white/95 backdrop-blur-xl p-8 lg:p-12 rounded-4xl shadow-2xl border border-[#cf5deb]/30"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="text-2xl font-bold text-[#966919] mb-8 flex items-center gap-3">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
                <Edit size={28} className="text-[#cf5deb]" />
              </h3>
              <form onSubmit={editingProduct ? updateProduct : addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-[#966919]/90 mb-2">Product Name *</label>
                  <input 
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-4 border border-[#cf5deb]/30 rounded-2xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg font-semibold placeholder-[#966919]/50"
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#966919]/90 mb-2">Price (Rs) *</label>
                  <input 
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full p-4 border border-[#cf5deb]/30 rounded-2xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg font-semibold placeholder-[#966919]/50"
                    placeholder="299"
                    required
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#966919]/90 mb-2">Description</label>
                  <textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    rows={4}
                    className="w-full p-4 border border-[#cf5deb]/30 rounded-2xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all resize-vertical text-base placeholder-[#966919]/50"
                    placeholder="Premium handcrafted candle with natural soy wax..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#966919]/90 mb-2">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-4 border border-[#cf5deb]/30 rounded-2xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg font-semibold"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Signature">Signature</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#966919]/90 mb-2">Image URL</label>
                  <input 
                    type="url"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    className="w-full p-4 border border-[#cf5deb]/30 rounded-2xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-base placeholder-[#966919]/50"
                    placeholder="https://example.com/candle.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#966919]/90 mb-2">Stock Quantity</label>
                  <input 
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    className="w-full p-4 border border-[#cf5deb]/30 rounded-2xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg font-semibold placeholder-[#966919]/50"
                    placeholder="100"
                    min="0"
                  />
                </div>
                <div className="md:col-span-2 flex gap-4 pt-4">
                  <motion.button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-8 rounded-2xl font-bold text-lg uppercase tracking-wider hover:shadow-2xl transition-all shadow-xl flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Save size={24} />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </motion.button>
                  <motion.button 
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                      setNewProduct({ name: '', price: '', description: '', category: 'Premium', imageUrl: '', stock: 100 });
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-8 rounded-2xl font-bold text-lg uppercase tracking-wider hover:shadow-xl transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <X size={24} />
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                className="group bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-3xl border border-[#cf5deb]/20 hover:border-[#cf5deb]/40 transition-all cursor-pointer relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -8 }}
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                  <button 
                    onClick={() => editProduct(product.id)}
                    className="p-3 bg-blue-500/90 hover:bg-blue-500 text-white rounded-2xl hover:scale-110 transition-all shadow-lg"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-3 bg-red-500/90 hover:bg-red-500 text-white rounded-2xl hover:scale-110 transition-all shadow-lg"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="aspect-[4/5] bg-gradient-to-br from-[#cf5deb]/10 to-[#cf5deb]/5 rounded-2xl mb-6 overflow-hidden shadow-xl group-hover:ring-4 group-hover:ring-[#cf5deb]/30 transition-all">
                  <img 
                    src={product.imageUrl || '/placeholder-candle.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#cf5deb]/30 to-[#cf5deb]/20 text-[#966919] text-xs font-bold rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#966919] mb-3 line-clamp-2">{product.name}</h3>
                  <p className="text-[#966919]/70 text-sm mb-6 line-clamp-3 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-serif font-bold text-[#cf5deb]">
                      Rs {Number(product.price).toLocaleString()}

                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-xl">
                      Stock: {product.stock || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {products.length === 0 && !showProductForm && (
            <motion.div 
              className="text-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Package className="w-32 h-32 text-[#966919]/30 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-[#966919] mb-4">No Products</h3>
              <p className="text-[#966919]/70 mb-8 max-w-lg mx-auto">Add your first product to get started.</p>
              <motion.button 
                onClick={() => setShowProductForm(true)}
                className="px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-3xl font-bold text-xl uppercase tracking-wider hover:shadow-2xl transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <Plus size={28} className="inline mr-2" />
                Add First Product
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Orders Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-[#966919] flex items-center gap-3">
              <Package size={32} />
              Recent Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <motion.div 
              className="bg-white/90 backdrop-blur-xl p-20 rounded-4xl shadow-2xl border border-[#cf5deb]/30 text-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <Package className="w-32 h-32 text-[#966919]/30 mx-auto mb-8" />
              <h3 className="text-3xl font-bold text-[#966919] mb-4">No Orders Yet</h3>
              <p className="text-[#966919]/70 text-lg max-w-2xl mx-auto mb-8">Orders will appear here when customers place purchases.</p>
              <motion.button 
                className="px-12 py-6 bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] text-[#966919] rounded-3xl font-bold text-xl uppercase tracking-wider hover:shadow-2xl transition-all shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                Orders will appear here automatically
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {orders.map((order) => (
                <motion.div 
                  key={order.id}
                  className="group bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-3xl border border-[#cf5deb]/30 hover:border-[#cf5deb]/50 transition-all overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-8 border-b border-[#cf5deb]/20">
                    <h3 className="text-2xl font-bold text-[#966919]">Order #{order.id.slice(-8).toUpperCase()}</h3>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm capitalize shadow-lg ${
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' :
                      'bg-green-100 text-green-700 ring-2 ring-green-200'
                    }`}>
                      {order.status?.toUpperCase()}
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#cf5deb]">
                      Rs {(order.totalPrice || 0).toLocaleString()}

                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-8">
                    <h4 className="font-bold text-xl mb-6 flex items-center gap-3 text-[#966919]">
                      <Package size={24} />
                      Order Items ({Array.isArray(order.products) ? order.products.length : 'N/A'})
                    </h4>
                    <div className="space-y-3 bg-gradient-to-r from-[#cf5deb]/5 p-6 rounded-3xl border border-[#cf5deb]/10">
                      {renderOrderItems(order.products)}
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#966919]/90">
                        <User size={20} />
                        Customer Details
                      </div>
                      <p className="font-semibold">{order.customerName}</p>
                      <p className="text-sm text-[#966919]/70">📞 {order.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-[#966919]/90">
                        <MapPin size={20} />
                        Delivery Address
                      </div>
                      <p className="font-semibold">{order.address}</p>
                      <p className="text-sm text-[#966919]/70">{order.city}, {order.area}</p>
                    </div>
                  </div>

                  {/* Payment & Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-[#cf5deb]/20 items-stretch">
                    <div className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                      <div className="font-bold text-[#966919]/90 mb-2 flex items-center gap-2">
                        Payment: {order.paymentMethod || 'Cash on Delivery'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Ordered: {order.createdAt ? new Date(order.createdAt.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <select 
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] text-[#966919] rounded-2xl font-bold text-lg cursor-pointer hover:shadow-xl transition-all focus:ring-4 focus:ring-[#cf5deb]/30"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="delivered">✨ Delivered</option>
                      </select>
                      <motion.button 
                        onClick={() => deleteOrder(order.id)}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Trash2 size={20} />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
