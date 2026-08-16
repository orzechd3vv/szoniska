'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbtack, FaCalendarAlt, FaChevronDown, FaHistory, FaRocket } from 'react-icons/fa';

interface Update {
  id: string;
  version: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export default function UpdatesList() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      setUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
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

  const pinnedUpdates = updates.filter(u => u.isPinned);
  const regularUpdates = updates.filter(u => !u.isPinned);

  return (
    <div className="space-y-12">
      {/* Pinned Section */}
      {pinnedUpdates.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FaThumbtack size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Ważne aktualizacje</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Najistotniejsze zmiany</p>
            </div>
          </div>
          <div className="space-y-6">
            {pinnedUpdates.map((update, index) => (
              <UpdateCard key={update.id} update={update} isPinned index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Regular Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
            <FaHistory size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Pełna historia</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Ewolucja platformy Szoniska</p>
          </div>
        </div>
        <div className="space-y-6">
          {regularUpdates.length > 0 ? (
            regularUpdates.map((update, index) => (
              <UpdateCard key={update.id} update={update} index={index} />
            ))
          ) : pinnedUpdates.length === 0 && (
            <div className="p-16 glass rounded-[2.5rem] border-dashed border-white/10 text-center">
              <FaRocket className="text-gray-700 mx-auto mb-4" size={32} />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Brak dostępnych aktualizacji</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function UpdateCard({ update, isPinned = false, index }: { update: Update; isPinned?: boolean; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass rounded-[2rem] p-8 border-white/5 relative overflow-hidden group transition-all ${
        isPinned ? 'bg-amber-500/[0.03] border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.05)]' : 'hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-black/20 flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
            <span className="font-mono text-primary-400 font-black text-xs">
              {update.version}
            </span>
          </div>
          {isPinned && (
            <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
              <FaThumbtack size={8} /> Priorytet
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">{update.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
              <FaCalendarAlt className="text-primary-500" />
              {new Date(update.createdAt).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className={`text-gray-400 font-medium leading-relaxed prose prose-invert prose-sm max-w-none ${!isExpanded && 'line-clamp-4'}`}>
            {update.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </div>

          {update.content.length > 250 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-6 flex items-center gap-2 text-primary-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              {isExpanded ? 'Zwiń treść' : 'Czytaj więcej'}
              <FaChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

