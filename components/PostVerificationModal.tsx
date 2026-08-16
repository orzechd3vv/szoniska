'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';

interface PostVerificationModalProps {
  postId: string;
  onVerify: () => void;
}

export default function PostVerificationModal({ postId, onVerify }: PostVerificationModalProps) {
  const [show, setShow] = useState(false);
  const [isNotRobot, setIsNotRobot] = useState(false);
  const [isAbove18, setIsAbove18] = useState(false);
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(`post-verified-${postId}`);
    if (!verified) {
      setShow(true);
    } else {
      onVerify();
    }
  }, [postId, onVerify]);

  const handleVerify = () => {
    if (isNotRobot && isAbove18 && acceptsPrivacy) {
      localStorage.setItem(`post-verified-${postId}`, 'true');
      setShow(false);
      onVerify();
    }
  };

  const allChecked = isNotRobot && isAbove18 && acceptsPrivacy;

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1001] flex items-center justify-center bg-[#020202]/95 backdrop-blur-2xl p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative max-w-xl w-full"
        >
          {/* Ambient Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-600/20 blur-[100px] rounded-full animate-pulse" />
          
          <div className="relative bg-[#0a0a0a] rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            
            {/* Top Verification Banner */}
            <div className="bg-[#121212] py-10 flex flex-col items-center justify-center border-b border-white/5 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 bg-black/80 rounded-3xl border-2 border-primary-500/20 flex items-center justify-center relative group"
              >
                <div className="absolute inset-0 bg-primary-500/10 blur-xl transition-all" />
                <FaShieldAlt className="text-3xl text-primary-500 drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
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
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#f59e0b]">Weryfikacja Treści</h2>
              </motion.div>

              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-black text-white mb-6 tracking-tighter leading-[0.9] uppercase italic"
              >
                Potwierdź <br />
                <span className="text-primary-500">Uprawnienia</span>
              </motion.h3>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm max-w-sm mx-auto mb-10 font-medium leading-relaxed tracking-tight"
              >
                Ten post zawiera treści przeznaczone dla zweryfikowanych użytkowników. Proszę potwierdzić warunki dostępu.
              </motion.p>

              {/* Checklist Section */}
              <div className="space-y-4 mb-10 text-left max-w-xs mx-auto">
                <VerificationCheck 
                  label="Nie jestem robotem" 
                  checked={isNotRobot} 
                  onChange={setIsNotRobot} 
                />
                <VerificationCheck 
                  label="Mam ukończone 18 lat" 
                  checked={isAbove18} 
                  onChange={setIsAbove18} 
                />
                <VerificationCheck 
                  label="Akceptuję regulamin serwisu" 
                  checked={acceptsPrivacy} 
                  onChange={setAcceptsPrivacy} 
                />
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={allChecked ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
                whileTap={allChecked ? { scale: 0.98 } : {}}
                onClick={handleVerify}
                disabled={!allChecked}
                className={`w-full py-6 px-8 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 ${
                  allChecked 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-400 text-white shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]' 
                    : 'bg-[#121212] text-gray-700 border border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <FaCheck className="text-[12px]" /> Potwierdzam i Wchodzę
              </motion.button>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex items-center justify-center gap-4"
              >
                <div className="h-px w-10 bg-white/5" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">Weryfikacja jednorazowa</span>
                <div className="h-px w-10 bg-white/5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function VerificationCheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer group">
      <div 
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
          checked ? 'bg-primary-500 border-primary-500' : 'bg-transparent border-white/10 group-hover:border-primary-500/50'
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && <FaCheck className="text-white text-[10px]" />}
      </div>
      <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${checked ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>
        {label}
      </span>
    </label>
  );
}
