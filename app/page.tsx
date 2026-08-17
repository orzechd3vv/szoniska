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
      <section className="relative pt-36 sm:pt-48 pb-24 sm:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">

          {/* Monumental Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-5xl sm:text-8xl md:text-[10rem] font-black text-white mb-6 sm:mb-8 tracking-tighter leading-[0.9] uppercase italic"
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
            className="max-w-3xl mx-auto text-gray-300 text-base sm:text-xl md:text-2xl font-semibold mb-10 sm:mb-14 leading-relaxed tracking-wide px-2"
          >
            Bezkompromisowa platforma nowej generacji. Przeglądaj, oceniaj autentyczność i zanurz się w najbardziej zaawansowanej społeczności w sieci.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToFeed}
              className="btn-primary py-4 sm:py-5 px-8 sm:px-12 text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(168,85,247,0.6)] touch-manipulation"
            >
              <FaRocket size={16} className="text-primary-200 animate-pulse" /> Eksploruj Feed
            </motion.button>

            <Link href="/prawo" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.04, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.96 }}
                className="glass py-4 sm:py-5 px-8 sm:px-12 text-sm sm:text-base font-black text-white w-full transition-all rounded-2xl flex items-center justify-center gap-3 border-white/25 shadow-2xl uppercase tracking-widest touch-manipulation"
              >
                <FaShieldAlt size={16} className="text-primary-400" /> Zasady Serwisu
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll Down Cyber Indicator */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-20 sm:mt-28 text-primary-400 cursor-pointer inline-block"
            onClick={scrollToFeed}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 glass rounded-2xl flex items-center justify-center mx-auto border-primary-500/50 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              <FaArrowDown size={20} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={feedRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <AnnouncementBanner />

        {/* Fully Responsive Header & Filter Tabs */}
        <div className="flex flex-col gap-6 mt-8 sm:mt-10 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-stretch md:items-center justify-between w-full gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-10 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)] shrink-0" />
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase italic truncate">Feed Główny</h2>
            </div>

            {/* Cyber Filter Tabs - Grid on mobile so it never gets cut off */}
            <div className="grid grid-cols-2 sm:flex gap-2.5 p-2 glass rounded-[2.2rem] border-white/15 relative shadow-[0_15px_40px_rgba(0,0,0,0.6)] w-full md:w-auto">
              <button
                onClick={() => setFilter('popular')}
                className={`relative px-4 sm:px-8 py-3.5 rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 transition-colors duration-300 z-10 touch-manipulation ${
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
                <FaFire className="relative z-10 text-amber-400 shrink-0" size={15} />
                <span className="relative z-10 truncate">Popularne</span>
              </button>

              <button
                onClick={() => setFilter('latest')}
                className={`relative px-4 sm:px-8 py-3.5 rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 sm:gap-3 transition-colors duration-300 z-10 touch-manipulation ${
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
                <FaClock className="relative z-10 text-primary-300 shrink-0" size={15} />
                <span className="relative z-10 truncate">Najnowsze</span>
              </button>
            </div>
          </motion.div>
        </div>

        <PostFeed filter={filter} />
      </section>
    </main>
  );
}
