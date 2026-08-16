'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function PolitykaPrywatnosciPage() {
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
              <FaShieldAlt size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">Prywatność</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Ochrona Twoich danych</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">01.</span> Zbieranie danych
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>1.1. Przetwarzamy wyłącznie dane niezbędne do prawidłowego funkcjonowania serwisu, takie jak nazwa użytkownika, adres e-mail oraz dane techniczne (IP).</p>
                <p>1.2. Dane zbierane są podczas rejestracji oraz interakcji z platformą (publikowanie postów, komentarzy).</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">02.</span> Wykorzystanie danych
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>2.1. Twoje dane są wykorzystywane do personalizacji konta, zapewnienia bezpieczeństwa oraz celów analitycznych.</p>
                <p>2.2. Nie sprzedajemy ani nie udostępniamy Twoich danych osobowych podmiotom trzecim w celach marketingowych.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">03.</span> Bezpieczeństwo
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>3.1. Stosujemy zaawansowane metody szyfrowania i zabezpieczenia serwerów, aby chronić Twoje dane przed nieautoryzowanym dostępem.</p>
                <p>3.2. Regularnie audytujemy nasze systemy pod kątem potencjalnych luk bezpieczeństwa.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">04.</span> Twoje prawa
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>4.1. Masz prawo do wglądu, poprawienia oraz żądania usunięcia swoich danych osobowych w dowolnym momencie.</p>
                <p>4.2. Możesz wycofać zgodę na przetwarzanie danych poprzez zamknięcie konta lub kontakt z administratorem.</p>
              </div>
            </section>

            <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-500 text-sm italic text-center">
                Zgodność z RODO (GDPR). <br />
                W przypadku pytań prosimy o kontakt poprzez formularz.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
