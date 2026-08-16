'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import PostFeed from '@/components/PostFeed';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { motion } from 'framer-motion';
import { FaFire, FaClock, FaArrowDown, FaRocket, FaShieldAlt, FaBolt, FaCrown } from 'react-icons/fa';

export default function HomePage() {
  const [filter, setFilter] = useState<'latest' | 'popular'>('latest');
  const feedRef = useRef<HTMLDivElement>(null);

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen pb-32 bg-cyber-grid relative overflow-hidden">
      {/* Immersive Cyber Orbs & Light Beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-primary-600/25 blur-[180px] rounded-full pointer-events-none animate-pulse-fast" />
      <div className="absolute top-28 left-[5%] w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none animate-float" />
      <div className="absolute top-44 right-[5%] w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none animate-float" style={{ animationDelay: '2.5s' }} />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">

          {/* Monumental Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-6xl sm:text-8xl md:text-[10rem] font-black text-white mb-8 tracking-tighter leading-[0.8] uppercase italic"
          >
            POLSKIE <br />
            <span className="bg-gradient-to-r from-primary-400 via-purple-300 to-indigo-300 bg-[length:250%_auto] animate-gradient bg-clip-text text-transparent text-glow">
              SZONISKA
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="max-w-3xl mx-auto text-gray-300 text-lg md:text-2xl font-semibold mb-14 leading-relaxed tracking-wide"
          >
            Bezkompromisowa platforma nowej generacji. Przeglądaj, oceniaj autentyczność i zanurz się w najbardziej zaawansowanej społeczności w sieci.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={scrollToFeed}
              className="btn-primary py-5 px-12 text-base w-full sm:w-auto flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(168,85,247,0.7)]"
            >
              <FaRocket size={18} className="text-primary-200 animate-pulse" /> Eksploruj Feed
            </motion.button>

            <Link href="/prawo" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.06, y: -3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.94 }}
                className="glass py-5 px-12 text-base font-black text-white w-full transition-all rounded-2xl flex items-center justify-center gap-4 border-white/25 shadow-2xl uppercase tracking-widest"
              >
                <FaShieldAlt size={18} className="text-primary-400" /> Zasady Serwisu
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll Down Cyber Indicator */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-28 text-primary-400 cursor-pointer inline-block"
            onClick={scrollToFeed}
          >
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mx-auto border-primary-500/50 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <FaArrowDown size={22} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={feedRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <AnnouncementBanner />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8 mt-10">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-10 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
              <h2 className="text-5xl font-black text-white tracking-tight uppercase italic">Feed Główny</h2>
            </div>
            
            <div className="h-10 w-px bg-white/15 hidden sm:block" />

            {/* Cyber Filter Tabs */}
            <div className="flex gap-3 p-2.5 glass rounded-[2rem] border-white/15 relative shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <button
                onClick={() => setFilter('popular')}
                className={`relative px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center gap-3 transition-colors duration-300 z-10 ${
                  filter === 'popular' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter === 'popular' && (
                  <motion.div
                    layoutId="activeFilterCyber"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.7)] border border-white/30"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <FaFire className="relative z-10 text-amber-400" size={16} />
                <span className="relative z-10">Popularne</span>
              </button>

              <button
                onClick={() => setFilter('latest')}
                className={`relative px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center gap-3 transition-colors duration-300 z-10 ${
                  filter === 'latest' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter === 'latest' && (
                  <motion.div
                    layoutId="activeFilterCyber"
                    className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.7)] border border-white/30"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <FaClock className="relative z-10 text-primary-300" size={16} />
                <span className="relative z-10">Najnowsze</span>
              </button>
            </div>
          </motion.div>
        </div>

        <PostFeed filter={filter} />
      </section>
    </main>
  );
}
