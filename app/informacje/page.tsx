'use client';

import { motion } from 'framer-motion';
import { FaInfoCircle, FaCogs, FaHandshake, FaChartBar, FaQuestionCircle, FaShieldAlt, FaUsers, FaFire, FaLock, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function InformacjePage() {
  return (
    <main className="min-h-screen pb-32 bg-cyber-grid relative overflow-hidden text-white">
      {/* Background Cosmic Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary-600/20 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border-primary-500/40 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <FaInfoCircle className="text-primary-400" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-200">Centrum Wiedzy • Szoniska</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter mb-6 text-glow"
          >
            INFORMACJE O <span className="text-primary-400">SERWISIE</span>
          </motion.h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Wszystko, co musisz wiedzieć o działaniu platformy, naszych partnerach, statystykach społeczności oraz najczęściej zadawanych pytaniach.
          </p>
        </div>

        {/* 1. JAK DZIAŁA STRONA */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-3 h-10 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight">1. Jak działa strona?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-[2.5rem] p-8 border-white/10 relative group hover:border-primary-500/50 transition-all shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400 mb-6 border border-primary-500/30">
                <FaCogs size={26} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-3">Publikacja Kontentu</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Użytkownicy mogą dodawać posty zawierające materiały multimedialne (zdjęcia, wideo) oraz odnośniki do mediów społecznościowych. Każdy post przechodzi wstępną moderację.
              </p>
            </div>

            <div className="glass rounded-[2.5rem] p-8 border-white/10 relative group hover:border-primary-500/50 transition-all shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/30">
                <FaFire size={26} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-3">System Głosowania</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Społeczność decyduje o popularności materiałów za pomocą natychmiastowych sygnałów (Upvote/Downvote). Najlepiej oceniane posty trafiają na szczyt listy Popularnych.
              </p>
            </div>

            <div className="glass rounded-[2.5rem] p-8 border-white/10 relative group hover:border-primary-500/50 transition-all shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/30">
                <FaShieldAlt size={26} />
              </div>
              <h3 className="text-xl font-black uppercase italic mb-3">Bezpieczeństwo 18+</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Serwis jest w pełni chroniony i przeznaczony wyłącznie dla osób dorosłych. Wdrożyliśmy rygorystyczne procedury weryfikacji wieku oraz usuwania naruszeń.
              </p>
            </div>
          </div>
        </section>

        {/* 2. PARTNERZY */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-3 h-10 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight">2. Nasi Partnerzy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {['MVP Entertainment', 'Zyvalis Group', 'CyberMedia Network', 'DarkWeb Security'].map((partner, idx) => (
              <div key={idx} className="glass rounded-[2rem] p-6 text-center border-white/10 hover:border-primary-500/40 transition-all flex flex-col items-center justify-center shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-300 font-black mb-4 border border-white/10">
                  <FaHandshake size={22} />
                </div>
                <h4 className="font-black uppercase tracking-wider text-sm text-white">{partner}</h4>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Oficjalny Partner</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. STATYSTYKI */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-3 h-10 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight">3. Statystyki Sieci</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass rounded-[2.5rem] p-8 text-center border-white/10 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-black text-primary-400 mb-2 text-glow">24.5K+</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400">Aktywnych Użytkowników</div>
            </div>
            <div className="glass rounded-[2.5rem] p-8 text-center border-white/10 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-2 text-glow">120K+</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400">Przetworzonych Postów</div>
            </div>
            <div className="glass rounded-[2.5rem] p-8 text-center border-white/10 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-black text-indigo-400 mb-2 text-glow">1.2M+</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400">Miesięcznych Odsłon</div>
            </div>
            <div className="glass rounded-[2.5rem] p-8 text-center border-white/10 shadow-2xl">
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2 text-glow">99.9%</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400">Dostępność Serwera</div>
            </div>
          </div>
        </section>

        {/* 4. NAJCZĘŚCIEJ ZADAWANE PYTANIA (FAQ) */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-3 h-10 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight">4. Najczęściej Zadawane Pytania (FAQ)</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Czy korzystanie z serwisu jest w pełni darmowe?",
                a: "Tak, przeglądanie treści, głosowanie oraz podstawowe publikowanie postów jest całkowicie darmowe dla zarejestrowanych użytkowników."
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
              <div key={idx} className="glass rounded-[2.5rem] p-8 border-white/10 shadow-xl">
                <h3 className="text-lg sm:text-xl font-black text-white uppercase italic mb-3 flex items-center gap-3">
                  <FaQuestionCircle className="text-primary-400 shrink-0" size={20} />
                  {faq.q}
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium pl-8">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
