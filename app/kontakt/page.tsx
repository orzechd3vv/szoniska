'use client';

import { motion } from 'framer-motion';
import { FaEnvelope, FaChevronLeft, FaHeadset } from 'react-icons/fa';
import Link from 'next/link';

export default function KontaktPage() {
  return (
    <div className="min-h-screen bg-[#020202] py-32 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Wróć do strony głównej
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[3rem] p-12 border border-white/10"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
              <FaHeadset size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">Kontakt</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Centrum pomocy i wsparcia</p>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            {/* Email Section */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass rounded-[2.5rem] p-12 border-white/5 bg-white/[0.02] flex flex-col items-center text-center group max-w-md w-full"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-8 shadow-xl group-hover:scale-110 transition-transform">
                <FaEnvelope size={40} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">E-mail</h3>
              <p className="text-gray-400 text-sm mb-10 leading-relaxed uppercase tracking-wider">
                Współpraca, sprawy formalne, pomoc techniczna i odwołania od blokad. Odpowiadamy do 24h.
              </p>
              <a
                href="mailto:kontakt@szoniska.xyz"
                className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-lg shadow-primary-900/20 transition-all"
              >
                NAPISZ WIADOMOŚĆ
              </a>
            </motion.div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">01.</span> Częste pytania (FAQ)
              </h2>
              <div className="space-y-4">
                {[
                  { q: 'Jak zgłosić nieodpowiednią treść?', a: 'Użyj przycisku zgłaszania przy danym poście lub napisz do nas wiadomość e-mail.' },
                  { q: 'Ile trwa weryfikacja posta?', a: 'Zazwyczaj od kilku minut do paru godzin, w zależności od pory dnia.' },
                  { q: 'Czy moje dane są bezpieczne?', a: 'Tak, wszystkie media są szyfrowane, a dane przetwarzamy zgodnie z RODO.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                    <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{item.q}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest text-center">
                Wsparcie techniczne: Pon-Pt 9:00 - 17:00 (E-mail) • Biuro: kontakt@szoniska.xyz
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
