'use client';

import { motion } from 'framer-motion';
import { FaFileContract, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function RegulaminPage() {
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
              <FaFileContract size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">Regulamin</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Zasady korzystania z serwisu</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">01.</span> Postanowienia ogólne
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>1.1. Niniejszy regulamin określa zasady korzystania z platformy Szoniska.</p>
                <p>1.2. Platforma przeznaczona jest dla osób, które ukończyły 18 rok życia.</p>
                <p>1.3. Korzystanie z Platformy oznacza pełną akceptację niniejszego regulaminu.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">02.</span> Konto użytkownika
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>2.1. Rejestracja wymaga poprawnej weryfikacji tożsamości poprzez dostępne systemy (np. Google).</p>
                <p>2.2. Użytkownik jest zobowiązany do zachowania poufności swoich danych dostępowych.</p>
                <p>2.3. Zabrania się udostępniania kont osobom trzecim oraz tworzenia multikont w celach omijania blokad.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">03.</span> Zasady publikacji
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>3.1. Użytkownicy mogą publikować treści wyłącznie zgodne z obowiązującym prawem.</p>
                <p>3.2. Surowo zabrania się publikowania treści promujących nienawiść, przemoc oraz materiałów nielegalnych.</p>
                <p>3.3. Wszystkie posty podlegają moderacji przed lub po publikacji.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">04.</span> Sankcje i moderacja
              </h2>
              <div className="text-gray-400 leading-relaxed text-lg space-y-3">
                <p>4.1. Naruszenie regulaminu może skutkować ostrzeżeniem, czasowym zawieszeniem lub trwałą blokadą konta.</p>
                <p>4.2. Administrator ma prawo do usunięcia dowolnej treści bez podania przyczyny, jeśli uzna ją za szkodliwą.</p>
              </div>
            </section>

            <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-500 text-sm italic text-center">
                Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}. <br />
                Administrator zastrzega sobie prawo do zmiany regulaminu w dowolnym momencie.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
