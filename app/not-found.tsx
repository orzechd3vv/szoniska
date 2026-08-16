'use client';

import Link from 'next/link';
import { FaHome, FaCompass } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#03000a] flex items-center justify-center px-4 relative overflow-hidden bg-cyber-grid">
      <div className="absolute w-[600px] h-[600px] bg-primary-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="relative z-10 glass rounded-[3rem] p-12 max-w-lg w-full text-center border-primary-500/30 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
        <div className="w-20 h-20 rounded-3xl bg-primary-500/20 text-primary-400 flex items-center justify-center mx-auto mb-6 border border-primary-500/40 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
          <FaCompass size={36} className="animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <h2 className="text-5xl font-black text-white uppercase italic mb-3">404</h2>
        <h3 className="text-xl font-bold text-primary-300 uppercase mb-3">Strona nie znaleziona</h3>
        <p className="text-gray-400 text-sm mb-8 font-medium">
          Szukana strona nie istnieje lub została przeniesiona w inne miejsce cyberprzestrzeni.
        </p>
        <Link href="/">
          <button className="btn-primary py-4 px-8 flex items-center justify-center gap-3 text-xs mx-auto shadow-[0_0_35px_rgba(168,85,247,0.6)]">
            <FaHome /> Powrót do bazy
          </button>
        </Link>
      </div>
    </div>
  );
}
