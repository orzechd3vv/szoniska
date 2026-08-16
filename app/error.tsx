'use client';

import { useEffect } from 'react';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#03000a] flex items-center justify-center px-4 relative overflow-hidden bg-cyber-grid">
      <div className="absolute w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="relative z-10 glass rounded-[3rem] p-10 max-w-lg w-full text-center border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="w-20 h-20 rounded-3xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6 border border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.4)]">
          <FaExclamationTriangle size={36} />
        </div>
        <h2 className="text-3xl font-black text-white uppercase italic mb-3">Wystąpił błąd systemu</h2>
        <p className="text-gray-400 text-sm mb-8 font-medium">
          {error.message || 'Wystąpił nieoczekiwany błąd w cyberprzestrzeni.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary py-3.5 px-6 flex items-center justify-center gap-2 text-xs"
          >
            <FaRedo /> Spróbuj ponownie
          </button>
          <Link href="/">
            <button className="glass py-3.5 px-6 rounded-2xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 transition-all w-full">
              <FaHome /> Strona Główna
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
