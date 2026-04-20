import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Login failed. Check credentials or create user in Firebase Console → Authentication.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#cf5deb3b] to-[#cf5deb80] flex items-center justify-center p-4">
      <motion.div 
        className="bg-white/95 backdrop-blur-xl p-10 sm:p-12 rounded-4xl shadow-2xl max-w-md w-full border border-[#cf5deb]/30"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#cf5deb] to-[#cf5deb80] rounded-3xl flex items-center justify-center shadow-xl">
            <svg className="w-12 h-12 text-[#966919]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold bg-gradient-to-r from-[#966919] to-[#cf5deb] bg-clip-text text-transparent mb-4">
            Admin Panel
          </h2>
          <p className="text-[#966919]/80 font-medium">Access full dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#966919]/90 flex items-center gap-2">
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg font-semibold placeholder-[#966919]/50 shadow-lg"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#966919]/90 flex items-center gap-2">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 border border-[#cf5deb]/30 rounded-3xl bg-white/50 backdrop-blur focus:ring-4 focus:ring-[#cf5deb]/30 focus:border-[#cf5deb] transition-all text-lg font-semibold placeholder-[#966919]/50 shadow-lg"
              placeholder="admin123"
              required
            />
          </div>

          {error && (
            <motion.div 
              className="p-4 bg-red-100 border border-red-300 rounded-2xl text-red-800 font-semibold text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#966919] to-[#cf5deb] hover:from-[#cf5deb] hover:to-[#966919] text-white py-6 px-8 rounded-3xl font-bold text-xl uppercase tracking-wider transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:opacity-50 flex items-center justify-center gap-3 disabled:cursor-not-allowed min-h-[70px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Enter Dashboard
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 p-4 bg-gradient-to-r from-[#cf5deb]/10 rounded-2xl border border-[#cf5deb]/20">
          <p className="text-center text-xs sm:text-sm text-[#966919]/70">
            👨‍💼 Default: <strong>admin@example.com</strong> / <strong>admin123</strong>
            <br />
            🔑 Create in Firebase Console → Authentication → Users → Add User
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

