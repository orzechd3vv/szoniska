'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaCalendarAlt, FaCheckCircle, FaBan, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';

interface Warning {
  id: string;
  message: string;
  createdAt: string;
}

interface User {
  isBlocked: boolean;
  isRestricted: boolean;
}

export default function UserWarnings() {
  const { data: session } = useSession();
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [warningsRes, statsRes] = await Promise.all([
        fetch('/api/user/warnings'),
        fetch('/api/user/stats'),
      ]);
      
      if (warningsRes.ok) {
        const warningsData = await warningsRes.json();
        setWarnings(warningsData);
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setUser({
          isBlocked: statsData.isBlocked,
          isRestricted: statsData.isRestricted,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccountStatus = () => {
    const count = warnings.length;
    
    if (user?.isBlocked || count >= 8) {
      return {
        label: 'Zablokowane',
        description: 'Twoje konto zostało trwale lub czasowo zablokowane za wielokrotne naruszenia.',
        icon: FaBan,
        styles: 'bg-red-500/10 border-red-500/20 text-red-500',
        badge: 'bg-red-500',
      };
    }
    
    if (user?.isRestricted || count >= 4) {
      return {
        label: 'Ograniczone',
        description: 'Twoje konto posiada aktywne ograniczenia funkcji interaktywnych.',
        icon: FaExclamationTriangle,
        styles: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        badge: 'bg-amber-500',
      };
    }
    
    return {
      label: 'Wzorowe',
      description: 'Twoje konto jest w pełni bezpieczne i nie posiada żadnych nałożonych kar.',
      icon: FaCheckCircle,
      styles: 'bg-green-500/10 border-green-500/20 text-green-500',
      badge: 'bg-green-500',
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const status = getAccountStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-12">
      {/* Account Status Header */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
            <FaShieldAlt size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Status konta</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Reputacja i bezpieczeństwo</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-dark rounded-[2.5rem] p-10 border-2 ${status.styles.split(' ')[1]} relative overflow-hidden`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-black/20 ${status.styles.split(' ')[2]}`}>
              <StatusIcon size={40} />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
                <h3 className="text-3xl font-black text-white">Twój profil jest {status.label}</h3>
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${status.badge}`}>
                  Aktywne
                </span>
              </div>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">{status.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="glass px-6 py-3 rounded-2xl border-white/5 text-center min-w-[100px]">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ostrzeżenia</p>
                <p className="text-2xl font-black text-white">{warnings.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Warnings History */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <FaExclamationTriangle size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Historia naruszeń</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Lista Twoich ostrzeżeń</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {warnings.length === 0 ? (
            <div className="p-16 glass rounded-[2.5rem] border-dashed border-white/10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-6">
                <FaCheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Brak ostrzeżeń</h3>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Przestrzegasz wszystkich zasad społeczności</p>
            </div>
          ) : (
            warnings.map((warning, index) => (
              <motion.div
                key={warning.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-[2rem] p-8 border-white/5 relative overflow-hidden group hover:bg-white/[0.02] transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                    <FaExclamationTriangle size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-black text-lg">Naruszenie regulaminu</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <FaCalendarAlt className="text-primary-500" />
                        {new Date(warning.createdAt).toLocaleDateString('pl-PL')}
                      </div>
                    </div>
                    <p className="text-gray-400 font-medium leading-relaxed mb-4">{warning.message}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] text-gray-500 font-black uppercase tracking-widest">
                      <FaInfoCircle className="text-primary-500" /> Wystawione przez system moderacji
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Warning Alert */}
      <AnimatePresence>
        {warnings.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 glass rounded-[2rem] border-amber-500/20 bg-amber-500/5"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <FaExclamationTriangle size={20} />
              </div>
              <div>
                <h4 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-1">Krytyczne ostrzeżenie</h4>
                <p className="text-gray-300 font-medium text-sm">
                  Posiadasz {warnings.length} ostrzeżenia. Pamiętaj, że przekroczenie limitu 8 ostrzeżeń spowoduje <span className="text-red-500 font-black">trwałą blokadę konta</span> bez możliwości odwołania.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}