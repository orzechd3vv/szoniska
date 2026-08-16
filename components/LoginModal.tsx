'use client';

import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaTimes, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative glass-dark rounded-3xl p-8 w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-600/20 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[100px]" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <FaTimes size={20} />
          </button>

          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black mb-3 bg-gradient-to-r from-white via-primary-300 to-primary-600 bg-clip-text text-transparent"
            >
              Witaj ponownie
            </motion.h2>
            <p className="text-gray-400">
              Zaloguj się do swojego konta Szoniska
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signIn('google', { callbackUrl: '/auth/callback' })}
              className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-2xl shadow-xl transition-all"
            >
              <FaGoogle size={20} />
              Kontynuuj przez Google
            </motion.button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-500">
                <span className="px-3 bg-black/40 backdrop-blur-md">Lub tradycyjnie</span>
              </div>
            </div>

            <Link href="/login" onClick={onClose}>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all"
              >
                <FaEnvelope size={20} />
                Email i Hasło
              </motion.button>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Nie masz jeszcze konta?{' '}
              <Link 
                href="/register" 
                onClick={onClose}
                className="text-primary-400 hover:text-primary-300 font-bold transition-colors"
              >
                Zarejestruj się
              </Link>
            </p>
            <p className="mt-4 text-xs opacity-50">
              Logując się akceptujesz nasz <Link href="/regulamin" className="underline">Regulamin</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

