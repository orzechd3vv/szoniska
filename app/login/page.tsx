'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight, FaGoogle, FaChevronLeft } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '', twoFactorCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials: any = {
        email: formData.email,
        password: formData.password,
        redirect: false,
      };

      if (formData.twoFactorCode && formData.twoFactorCode.length === 6) {
        credentials.twoFactorCode = formData.twoFactorCode;
      }

      const result = await signIn('credentials', credentials);

      if (result?.error) {
        if (result.error === '2FA_REQUIRED') {
          setShow2FA(true);
          setError('');
        } else {
          setError(result.error);
        }
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Wróć do strony głównej
        </Link>

        <div className="glass-dark rounded-[2.5rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Inner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl" />

          <div className="text-center mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-white mb-3"
            >
              Witaj w <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Szoniska</span>
            </motion.h1>
            <p className="text-gray-400">Podaj swoje dane, aby wejść do serwisu</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-8 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">Adres Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all"
                  placeholder="twoj@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-bold text-gray-300">Hasło</label>
                <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 font-bold transition-colors">
                  Zapomniałeś?
                </Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white/10 transition-all"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            {show2FA && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="text-sm font-bold text-primary-400 ml-1">Kod 2FA</label>
                <input
                  type="text"
                  value={formData.twoFactorCode}
                  onChange={(e) => setFormData({ ...formData, twoFactorCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  className="w-full bg-white/5 border-2 border-primary-500/50 rounded-2xl px-4 py-4 text-white text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:bg-white/10 transition-all"
                  placeholder="000000"
                  maxLength={6}
                />
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full btn-primary py-4 flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Zaloguj się <FaArrowRight /></>
              )}
            </motion.button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-500">
              <span className="px-3 bg-black/60 backdrop-blur-md rounded-full">Lub przez</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-black py-4 rounded-2xl transition-all shadow-xl"
          >
            <FaGoogle size={20} />
            Konto Google
          </motion.button>

          <p className="text-gray-500 text-center mt-10 font-medium">
            Nie masz jeszcze konta?{' '}
            <Link href="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

