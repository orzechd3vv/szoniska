'use client';

import { motion } from 'framer-motion';
import { FaInfoCircle, FaCogs, FaHandshake, FaQuestionCircle, FaShieldAlt, FaFire, FaCrown, FaServer, FaStar, FaUpload } from 'react-icons/fa';
import Link from 'next/link';

export default function InformacjePage() {
  return (
    <main className="min-h-screen pb-36 bg-cyber-grid relative overflow-hidden text-white">
      {/* Immersive Cosmic Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary-600/25 blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-40 left-[10%] w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-80 right-[10%] w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full border-primary-500/50 mb-8 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          >
            <FaCrown className="text-amber-400 animate-bounce" size={16} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-200">Centrum Wiedzy • Oficjalne Informacje</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black uppercase italic tracking-tighter mb-6 text-glow leading-[0.9]"
          >
            CENTRUM <span className="text-primary-400">WIEDZY</span>
          </motion.h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Poznaj architekturę platformy, elitarnych partnerów strategicznych oraz dowiedz się wszystkiego z bazy FAQ.
          </p>
        </div>

        {/* 1. JAK DZIAŁA STRONA */}
        <section className="mb-28">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3.5 h-12 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.9)]" />
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight">1. Jak Działa Strona?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-[3rem] p-10 border-white/10 relative group hover:border-primary-500/60 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-gradient-to-b from-white/[0.06] to-transparent"
            >
              <div className="absolute top-8 right-8 text-4xl font-black text-white/10 italic">01</div>
              <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400 mb-8 border border-primary-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <FaCogs size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-4 text-white">Publikacja & Kontent</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                Użytkownicy dzielą się materiałami z zachowaniem pełnej dynamiki społecznościowej. System akceptuje zdjęcia, wideo w wysokiej rozdzielczości oraz odnośniki społecznościowe.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-[3rem] p-10 border-white/10 relative group hover:border-primary-500/60 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-gradient-to-b from-white/[0.06] to-transparent"
            >
              <div className="absolute top-8 right-8 text-4xl font-black text-white/10 italic">02</div>
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <FaFire size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-4 text-white">Sygnały i Ranking</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                Błyskawiczne głosowanie (Upvote/Downvote) w czasie rzeczywistym. Algorytm natychmiastowo wyłania najpopularniejsze profile i materiały na szczyt listy.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-[3rem] p-10 border-white/10 relative group hover:border-primary-500/60 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.7)] bg-gradient-to-b from-white/[0.06] to-transparent"
            >
              <div className="absolute top-8 right-8 text-4xl font-black text-white/10 italic">03</div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/40 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <FaShieldAlt size={28} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-4 text-white">Bezpieczeństwo 18+</h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                Zaawansowane protokoły weryfikacji wieku oraz moderacji administratorów gwarantują najwyższe standardy bezpieczeństwa i zgodności z prawem.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 2. PARTNERZY I SPONSORZY */}
        <section className="mb-28">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3.5 h-12 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.9)]" />
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight">2. Partnerzy i Sponsorzy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* MVP Entertainment */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass rounded-[3rem] p-10 border-primary-500/40 relative overflow-hidden shadow-[0_20px_60px_rgba(168,85,247,0.25)] bg-gradient-to-b from-primary-950/40 to-transparent flex flex-col items-center text-center"
            >
              <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-bl-2xl shadow-lg">
                Infrastruktura
              </div>
              <div className="w-20 h-20 rounded-3xl bg-primary-500/20 flex items-center justify-center text-primary-300 mb-6 border border-primary-500/50 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                <FaServer size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-white mb-2">MVP Entertainment</h3>
              <p className="text-primary-300 font-extrabold text-xs uppercase tracking-[0.2em] mb-6">Partner Techniczny</p>
              
              {/* Logo Slot */}
              <div className="w-full h-36 rounded-2xl bg-black/60 border-2 border-dashed border-primary-500/40 flex items-center justify-center relative overflow-hidden p-2">
                <img 
                  src="/mvp.png" 
                  alt="MVP Entertainment" 
                  className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" 
                />
              </div>
            </motion.div>

            {/* 777 - Główny sponsor */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass rounded-[3rem] p-10 border-amber-500/40 relative overflow-hidden shadow-[0_20px_60px_rgba(245,158,11,0.25)] bg-gradient-to-b from-amber-950/40 to-transparent flex flex-col items-center text-center"
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-bl-2xl shadow-lg">
                Exclusive Sponsor
              </div>
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-6 border border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                <FaStar size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-white mb-2">777</h3>
              <p className="text-amber-400 font-extrabold text-xs uppercase tracking-[0.2em] mb-6">Główny Sponsor</p>
              
              {/* Logo Slot */}
              <div className="w-full h-36 rounded-2xl bg-black/60 border-2 border-dashed border-amber-500/40 flex items-center justify-center relative overflow-hidden p-2">
                <img 
                  src="/777.jpg" 
                  alt="777 Sponsor" 
                  className="max-h-full max-w-full object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" 
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* 3. NAJCZĘŚCIEJ ZADAWANE PYTANIA (FAQ) */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-3.5 h-12 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.9)]" />
            <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight">3. Najczęściej Zadawane Pytania (FAQ)</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Czy korzystanie z serwisu jest w pełni darmowe?",
                a: "Tak, przeglądanie treści, głosowanie oraz podstawowe publikowanie postów jest całkowicie darmowe dla zweryfikowanych użytkowników."
              },
              {
                q: "Jak mogę zgłosić naruszenie lub usunąć post na mój temat?",
                a: "Możesz skorzystać z zakładki Kontakt lub podstrony Prawo i Zgłoszenia, gdzie znajdziesz dedykowany formularz szybkiego usuwania treści."
              },
              {
                q: "Czy moje konto i dane są bezpieczne?",
                a: "Tak, stosujemy szyfrowanie SSL, bezpieczne uwierzytelnianie NextAuth oraz opcjonalną weryfikację dwuetapową (2FA). Twoje dane są chronione."
              },
              {
                q: "Kto może dodawać posty na platformie?",
                a: "Każdy zweryfikowany użytkownik, który ukończył 18 lat i zaakceptował regulamin serwisu, może publikować i komentować treści."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="glass rounded-[2.5rem] p-8 sm:p-10 border-white/10 shadow-2xl bg-gradient-to-r from-white/[0.04] to-transparent"
              >
                <h3 className="text-lg sm:text-xl font-black text-white uppercase italic mb-3 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center shrink-0 border border-primary-500/30">?</span>
                  {faq.q}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium pl-12">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
