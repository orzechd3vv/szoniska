'use client';

import { motion } from 'framer-motion';
import { FaBalanceScale, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function LawPage() {
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
              <FaBalanceScale size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">Aspekty Prawne</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Informacje i obowiązki</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">01.</span> Odpowiedzialność
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-medium">
                Użytkownik publikujący treść (post, komentarz, zdjęcie) oświadcza, że posiada wszelkie niezbędne prawa do jej udostępnienia i ponosi wyłączną odpowiedzialność za jej treść. Portal nie ponosi odpowiedzialności za opinie, dane oraz materiały zamieszczane przez użytkowników. W przypadku wystąpienia przez osoby trzecie z roszczeniami przeciwko administratorowi strony, użytkownik odpowiedzialny za publikację zobowiązuje się do pełnego pokrycia kosztów ewentualnych sporów prawnych i odszkodowań.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">02.</span> Prawa autorskie
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-medium">
                Zabrania się publikowania materiałów (zdjęć, grafik, tekstów), które nie są własnością użytkownika lub do których nie posiada on stosownej licencji. Fakt, że dane zdjęcie jest dostępne publicznie w mediach społecznościowych (Facebook, Instagram, LinkedIn), nie oznacza, że można je swobodnie kopiować i powielać w naszym serwisie. Użytkownik przesyłający materiał gwarantuje, że nie narusza on autorskich praw majątkowych ani osobistych osób trzecich.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">03.</span> Ochrona wizerunku
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg font-medium">
                Publikacja wizerunku (twarzy) osób trzecich wymaga ich wyraźnej zgody. Wyjątek stanowią osoby powszechnie znane, o ile zdjęcie zostało wykonane w związku z pełnieniem przez nie funkcji publicznych, a publikacja nie narusza ich prywatności. Użytkownik jest zobowiązany upewnić się, że publikacja wizerunku danej osoby jest zgodna z art. 81 Ustawy o prawie autorskim i prawach pokrewnych. Wykorzystywanie wizerunku osób trzecich w celach komercyjnych lub bezprawnych jest surowo zabronione.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="text-primary-500">04.</span> RODO (Ochrona danych osobowych)
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                Publikując imiona, nazwiska lub inne dane identyfikacyjne, użytkownik staje się ich administratorem w rozumieniu przepisów RODO w zakresie, w jakim decyduje o celu i sposobie ich udostępnienia. Zabrania się publikowania danych osób prywatnych bez ich zgody (tzw. doxing). Użytkownik ponosi pełną odpowiedzialność za zgodność przetwarzania tych danych z aktualnie obowiązującymi przepisami o ochronie danych osobowych. Administrator serwisu zastrzega sobie prawo do usunięcia danych, co do których istnieje podejrzenie naruszenia przepisów RODO.
              </p>
            </section>

            <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10">
              <p className="text-gray-500 text-sm italic text-center">
                Powyższe zapisy stanowią integralną część regulaminu korzystania z serwisu Szoniska.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
