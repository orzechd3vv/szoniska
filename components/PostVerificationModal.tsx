'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaCheckCircle } from 'react-icons/fa';

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
    // Sprawdź czy użytkownik już weryfikował ten post
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
        className="fixed inset-0 z-[101] flex items-center justify-center bg-black/95 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-purple-500/20"
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl">
              ✓
            </div>
          </div>

          {/* Tytuł */}
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 text-center mb-6">
            Weryfikacja Treści
          </h2>

          {/* Opis */}
          <p className="text-gray-300 text-center mb-6">
            Aby uzyskać dostęp do tej treści, potwierdź poniższe warunki:
          </p>

          {/* Checkboxes */}
          <div className="space-y-4 mb-8">
            {/* 1. Not a robot */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`w-6 h-6 rounded-lg border-2 transition-all ${
                  isNotRobot
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-purple-600'
                    : 'border-gray-600 group-hover:border-purple-500'
                }`}
              >
                {isNotRobot && <FaCheckCircle className="w-full h-full text-white p-0.5" />}
              </motion.div>
              <span
                className="text-gray-300 group-hover:text-white transition-colors flex-1"
                onClick={() => setIsNotRobot(!isNotRobot)}
              >
                Nie jestem robotem
              </span>
              <input
                type="checkbox"
                checked={isNotRobot}
                onChange={(e) => setIsNotRobot(e.target.checked)}
                className="hidden"
              />
            </label>

            {/* 2. Age verification */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`w-6 h-6 rounded-lg border-2 transition-all ${
                  isAbove18
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-purple-600'
                    : 'border-gray-600 group-hover:border-purple-500'
                }`}
              >
                {isAbove18 && <FaCheckCircle className="w-full h-full text-white p-0.5" />}
              </motion.div>
              <span
                className="text-gray-300 group-hover:text-white transition-colors flex-1"
                onClick={() => setIsAbove18(!isAbove18)}
              >
                Mam ukończone 18 lat
              </span>
              <input
                type="checkbox"
                checked={isAbove18}
                onChange={(e) => setIsAbove18(e.target.checked)}
                className="hidden"
              />
            </label>

            {/* 3. Privacy policy */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`w-6 h-6 rounded-lg border-2 transition-all ${
                  acceptsPrivacy
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-purple-600'
                    : 'border-gray-600 group-hover:border-purple-500'
                }`}
              >
                {acceptsPrivacy && <FaCheckCircle className="w-full h-full text-white p-0.5" />}
              </motion.div>
              <span
                className="text-gray-300 group-hover:text-white transition-colors flex-1"
                onClick={() => setAcceptsPrivacy(!acceptsPrivacy)}
              >
                Akceptuję politykę prywatności
              </span>
              <input
                type="checkbox"
                checked={acceptsPrivacy}
                onChange={(e) => setAcceptsPrivacy(e.target.checked)}
                className="hidden"
              />
            </label>
          </div>

          {/* Przycisk weryfikacji */}
          <motion.button
            whileHover={allChecked ? { scale: 1.02 } : {}}
            whileTap={allChecked ? { scale: 0.98 } : {}}
            onClick={handleVerify}
            disabled={!allChecked}
            className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg ${
              allChecked
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-purple-500/30 cursor-pointer'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            Potwierdzam i Wchodzę
          </motion.button>

          {/* Informacja dodatkowa */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Ta weryfikacja jest jednorazowa dla tego posta. Twoje preferencje zostaną zapamiętane.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
