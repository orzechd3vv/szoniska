'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

export default function AgeVerificationModal() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    const ageRestricted = localStorage.getItem('ageRestricted');
    const isOnRestrictedPage = window.location.pathname === '/age-restricted';
    
    if (!ageVerified && !ageRestricted && !isOnRestrictedPage) {
      setShow(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('ageVerified', 'true');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('ageRestricted', 'true');
    setShow(false);
    router.push('/age-restricted');
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#020202]/95 backdrop-blur-2xl p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative max-w-xl w-full"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full animate-pulse-slow" />
          
          <div className="relative bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            
            {/* Top Warning Banner */}
            <div className="bg-[#121212] py-10 flex flex-col items-center justify-center border-b border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 bg-black/80 rounded-3xl border-2 border-red-500/20 flex items-center justify-center relative group"
              >
                {/* Glow behind 18+ */}
                <div className="absolute inset-0 bg-red-500/10 blur-xl group-hover:bg-red-500/20 transition-all" />
                <span className="text-4xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">18+</span>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-12 text-center">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-6 justify-center"
              >
                <FaExclamationTriangle className="text-[#f59e0b] text-sm" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#f59e0b]">Wymagana Weryfikacja</h2>
              </motion.div>

              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-6xl font-black text-white mb-8 tracking-tighter leading-[0.9] uppercase italic"
              >
                Czy jesteś <br />
                <span className="text-primary-500 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]">Pełnoletni?</span>
              </motion.h3>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm max-w-sm mx-auto mb-12 font-medium leading-relaxed tracking-tight"
              >
                Ta platforma zawiera treści przeznaczone wyłącznie dla dorosłych. 
                Kontynuując, oświadczasz, że masz ukończone 18 lat.
              </motion.p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#1a1a1a' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDecline}
                  className="py-6 px-8 bg-[#121212] rounded-[1.5rem] text-gray-500 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-white/5 transition-all"
                >
                  <FaTimes className="text-[12px]" /> Nie, Wyjdź
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className="py-6 px-8 bg-gradient-to-r from-primary-600 to-primary-400 text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center gap-3"
                >
                  <FaCheck className="text-[12px]" /> Tak, Mam 18 lat
                </motion.button>
              </div>

              {/* Footer Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex items-center justify-center gap-4"
              >
                <div className="h-px w-12 bg-white/5" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">Bezpieczne Przeglądanie</span>
                <div className="h-px w-12 bg-white/5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
