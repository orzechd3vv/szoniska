'use client';

import Link from 'next/link';
import { FaBalanceScale, FaEnvelope, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#03000a] border-t border-white/[0.1] pt-28 pb-14 overflow-hidden">
      {/* Background Cyber Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[400px] bg-primary-600/30 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <span className="text-3xl font-black tracking-tighter text-white uppercase italic">
                SZONISKA<span className="text-primary-400">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Najbardziej zaawansowana platforma społecznościowa nowej generacji. Pełna autentyczność bez filtrów.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ y: -3, scale: 1.15 }}
                href="/kontakt"
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-200 hover:text-primary-300 hover:border-primary-400/60 transition-all shadow-xl"
              >
                <FaEnvelope size={20} />
              </motion.a>
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-primary-300 border-primary-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <FaGlobe size={20} />
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.35em] mb-6 text-glow">Nawigacja</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/informacje" className="group flex items-center gap-3 text-gray-300 hover:text-primary-300 transition-colors text-sm font-bold">
                  <FaInfoCircle className="text-primary-400" size={16} />
                  Informacje
                </Link>
              </li>
              <li>
                <Link href="/regulamin" className="group flex items-center gap-3 text-gray-300 hover:text-primary-300 transition-colors text-sm font-bold">
                  <FaBalanceScale className="text-primary-400" size={16} />
                  Regulamin
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="group flex items-center gap-3 text-gray-300 hover:text-primary-300 transition-colors text-sm font-bold">
                  <FaBalanceScale className="text-primary-400" size={16} />
                  Polityka Prywatności
                </Link>
              </li>
              <li>
                <Link href="/prawo" className="group flex items-center gap-3 text-gray-300 hover:text-primary-300 transition-colors text-sm font-bold">
                  <FaBalanceScale className="text-primary-400" size={16} />
                  Prawo i Zgłoszenia
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.35em] mb-6 text-glow">Wsparcie</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/kontakt" className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-500 group-hover:scale-125 transition-all shadow-[0_0_12px_rgba(168,85,247,1)]" />
                  Kontakt z Administracją
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h3 className="text-white font-black text-xs uppercase tracking-[0.35em] mb-6 text-glow">Bezpieczeństwo</h3>
            <div className="glass rounded-[2.5rem] p-6 border-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.2)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/30 flex items-center justify-center text-red-300 font-black text-xs border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]">18+</div>
                <span className="text-white text-xs font-black uppercase tracking-wider">Tylko Dorosłe Osoby</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                Serwis przeznaczony dla pełnoletnich użytkowników. Wszelkie materiały są chronione prawem.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.1] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs font-bold tracking-wider">
            © {currentYear} SZONISKA. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-2 text-gray-300 text-xs font-bold">
            Strona zrobiona przez<span className="text-primary-400 font-black">MVP Entertainment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
