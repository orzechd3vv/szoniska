'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaClock, FaShieldAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

export default function SystemMaintenanceOverlay() {
  const { data: session } = useSession();
  const [maintenance, setMaintenance] = useState<{ isMaintenance: boolean; reason?: string; endTime?: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const isAdmin = session?.user?.isAdmin;

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await fetch('/api/maintenance/global');
        if (res.ok) {
          const data = await res.json();
          setMaintenance(data);
        }
      } catch (err) {
        console.error('Error fetching global maintenance:', err);
      }
    };

    checkMaintenance();
    const interval = setInterval(checkMaintenance, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!maintenance?.endTime) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(maintenance.endTime!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Zakończono');
        window.location.reload();
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [maintenance?.endTime]);

  if (!maintenance?.isMaintenance || isAdmin) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#03000a]/95 backdrop-blur-2xl flex items-center justify-center px-4 overflow-hidden bg-cyber-grid">
      {/* Background Cosmic Glows */}
      <div className="absolute w-[800px] h-[800px] bg-primary-600/30 blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none animate-float" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 glass-dark rounded-[3rem] p-8 sm:p-14 max-w-xl w-full text-center border-primary-500/50 shadow-[0_0_80px_rgba(168,85,247,0.4)]"
      >
        <div className="w-24 h-24 rounded-3xl bg-primary-500/20 text-primary-400 flex items-center justify-center mx-auto mb-8 border border-primary-500/50 shadow-[0_0_40px_rgba(168,85,247,0.7)] animate-bounce" style={{ animationDuration: '3s' }}>
          <FaTools size={44} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full border-primary-500/40 mb-6 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Przerwa Techniczna</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase italic tracking-tighter mb-4 text-glow">
          SYSTEM <br /> <span className="text-primary-400">AKTUALIZOWANY</span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base mb-8 font-medium leading-relaxed italic border-l-2 border-primary-500/40 pl-4 max-w-md mx-auto">
          {maintenance.reason || 'Przeprowadzamy planowane prace konserwacyjne i ulepszenia infrastruktury sieciowej.'}
        </p>

        {/* Countdown Box */}
        <div className="glass rounded-[2rem] p-6 border-white/15 mb-8 shadow-inner bg-black/40">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2 flex items-center justify-center gap-2">
            <FaClock className="text-primary-400" /> Szacowany czas do końca przerwy:
          </p>
          <div className="text-4xl sm:text-6xl font-black text-white tracking-widest font-mono text-glow">
            {timeLeft || '00:00:00'}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
          <FaShieldAlt className="text-primary-400" /> Szoniska Cyber Network • Bezpieczna Aktualizacja
        </div>
      </motion.div>
    </div>
  );
}
