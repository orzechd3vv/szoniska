'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaEdit, FaExclamationTriangle, FaUser, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ onClose, onSuccess }: EditProfileModalProps) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(session?.user?.image || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Plik jest za duży (max 5MB)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Plik musi być obrazem');
      return;
    }

    setError('');
    setAvatar(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name !== session?.user?.name && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    setUploading(true);

    try {
      if (name !== session?.user?.name) {
        const nameRes = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });

        if (!nameRes.ok) {
          const data = await nameRes.json();
          throw new Error(data.error || 'Failed to update name');
        }
      }

      if (avatar) {
        const formData = new FormData();
        formData.append('file', avatar);

        const avatarRes = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData,
        });

        if (!avatarRes.ok) {
          const data = await avatarRes.json();
          throw new Error(data.error || 'Failed to upload avatar');
        }
      }

      await update();
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      setShowConfirmation(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass rounded-[3rem] p-10 max-w-md w-full border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                <FaUser size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Edytuj profil</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Personalizacja konta</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all">
              <FaTimes size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-primary-500/30 group-hover:border-primary-500 transition-all p-1 bg-black/40">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-[2rem]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[2rem] bg-primary-600/20 flex items-center justify-center text-primary-400 text-4xl font-black">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/40 border-2 border-[#020202] z-20"
                >
                  <FaCamera size={16} />
                </motion.button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-4">
                Zalecane: 512x512px, JPG/PNG (max 5MB)
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">
                Nazwa użytkownika
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  maxLength={50}
                  required
                  className="input-field w-full pl-12"
                  placeholder="Jak mamy Cię nazywać?"
                />
                <FaEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
              </div>
              <div className="flex items-center gap-2 px-1 text-[9px] text-gray-600 font-bold uppercase">
                <FaInfoCircle className="text-primary-500/50" /> Zmiana możliwa raz na 7 dni
              </div>
            </div>

            {/* Confirmation Warning */}
            <AnimatePresence>
              {showConfirmation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 glass rounded-2xl border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-start gap-4">
                      <FaExclamationTriangle className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                      <div>
                        <p className="text-amber-500 font-black text-[10px] uppercase tracking-widest mb-1">Potwierdź zmianę nazwy</p>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">
                          Czy na pewno chcesz zmienić nazwę na <span className="text-white font-bold">{name}</span>? 
                          Będziesz mógł ją zmienić ponownie dopiero za 7 dni.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 glass rounded-xl border-red-500/20 bg-red-500/5"
                >
                  <p className="text-red-400 text-[10px] font-black uppercase text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading}
                className="flex-1 btn-primary py-4 font-black text-[10px] uppercase tracking-widest"
              >
                {uploading ? 'Procesowanie...' : showConfirmation ? 'Potwierdź zmianę' : 'Zapisz profil'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => showConfirmation ? setShowConfirmation(false) : onClose()}
                disabled={uploading}
                className="px-8 py-4 glass rounded-[1.5rem] border-white/5 text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest"
              >
                Anuluj
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

