'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaIdBadge, FaEnvelope, FaCalendarAlt, FaFileAlt, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

interface UserStats {
  postsCount: number;
  approvedPosts: number;
  pendingPosts: number;
  rejectedPosts: number;
  reputation: number;
  createdAt: string;
}

export default function ProfileInfo() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const accountInfo = [
    { label: 'Identyfikator', value: `#${session?.user.id?.slice(-8) || '000000'}`, icon: FaIdBadge, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'E-mail kontaktowy', value: session?.user.email, icon: FaEnvelope, color: 'text-primary-400', bg: 'bg-primary-400/10' },
    { 
      label: 'Obywatel od', 
      value: stats ? new Date(stats.createdAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }) : '...', 
      icon: FaCalendarAlt, 
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
  ];

  const statCards = [
    { label: 'Reputacja', value: stats?.reputation || 0, icon: FaLightbulb, color: 'from-primary-500/10 to-primary-600/5', iconColor: 'text-primary-400' },
    { label: 'Wszystkie szony', value: stats?.postsCount || 0, icon: FaFileAlt, color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-blue-400' },
    { label: 'Zatwierdzone', value: stats?.approvedPosts || 0, icon: FaCheckCircle, color: 'from-green-500/10 to-green-600/5', iconColor: 'text-green-400' },
    { label: 'W weryfikacji', value: stats?.pendingPosts || 0, icon: FaHourglassHalf, color: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-amber-400' },
  ];

  return (
    <div className="space-y-12">
      {/* Account Info Bar */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountInfo.map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 rounded-[2rem] border-white/5 relative overflow-hidden group"
            >
              <div className="relative z-10 flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl ${info.bg} flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform duration-500`}>
                  <info.icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">{info.label}</p>
                  <p className="text-white font-black truncate text-sm">{info.value}</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <info.icon size={60} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
            <h3 className="text-white font-black text-xl tracking-tighter uppercase">Aktywność społeczna</h3>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 glass rounded-full border-white/5">
            <FaShieldAlt className="text-primary-400" size={12} />
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Zweryfikowany profil</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className={`p-8 rounded-[2.5rem] glass-dark border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${card.iconColor} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <card.icon size={24} />
                </div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {card.value}
                  </span>
                  <span className="text-[10px] text-gray-600 font-black uppercase">szt.</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Rep Management Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative group cursor-help"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        <div className="relative glass p-8 rounded-[2.5rem] border-white/10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] group-hover:rotate-12 transition-transform duration-500">
            <FaLightbulb size={28} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-white font-black text-lg tracking-tight mb-2 uppercase italic">Wskazówka od administracji</h4>
            <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-widest max-w-2xl">
              Im więcej Twoich szonów przejdzie <span className="text-primary-400 font-black">pozytywną weryfikację</span>, tym większy zyskujesz autorytet w społeczności. Wysoka reputacja odblokowuje priorytetowe sprawdzanie Twoich zgłoszeń!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


