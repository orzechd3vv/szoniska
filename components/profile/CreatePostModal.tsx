'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaFacebook, FaInstagram, FaTiktok, FaVideo, FaImage, FaPlus, FaCheck, FaGlobe, FaUserSecret, FaInfoCircle, FaChevronRight } from 'react-icons/fa';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [enableFacebook, setEnableFacebook] = useState(false);
  const [enableInstagram, setEnableInstagram] = useState(false);
  const [enableTiktok, setEnableTiktok] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefVideo = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      setError('Maksymalnie 10 zdjęć');
      return;
    }
    setImages([...images, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (videos.length + files.length > 5) {
      setError('Maksymalnie 5 filmów');
      return;
    }
    setVideos([...videos, ...files]);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setVideoPreviews((prev) => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    if (imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    URL.revokeObjectURL(videoPreviews[index]);
    setVideos(videos.filter((_, i) => i !== index));
    setVideoPreviews(videoPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !description.trim()) {
      setError('Tytuł i opis są wymagane');
      return;
    }
    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}));
          throw new Error(errorData.error || `Błąd podczas przesyłania zdjęcia: ${uploadRes.statusText}`);
        }

        const { url } = await uploadRes.json();
        if (!url) throw new Error('Nie otrzymano adresu URL dla przesłanego zdjęcia');
        imageUrls.push(url);
      }

      const videoUrls: string[] = [];
      for (const video of videos) {
        const formData = new FormData();
        formData.append('file', video);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}));
          const errorMessage = errorData.error || `Błąd podczas przesyłania filmu: ${uploadRes.statusText}`;
          const detailedMessage = errorData.details ? `${errorMessage} (${errorData.details})` : errorMessage;
          throw new Error(detailedMessage);
        }

        const { url } = await uploadRes.json();
        if (!url) throw new Error('Nie otrzymano adresu URL dla przesłanego filmu');
        videoUrls.push(url);
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, images: imageUrls, videos: videoUrls,
          facebookUrl: enableFacebook ? facebookUrl : null,
          instagramUrl: enableInstagram ? instagramUrl : null,
          tiktokUrl: enableTiktok ? tiktokUrl : null,
          isAnonymous,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Błąd serwera (${res.status}): Nie udało się utworzyć posta`);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Post creation error:', err);
      setError(err.message || 'Wystąpił nieoczekiwany błąd podczas tworzenia posta');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop - Deep Dark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl h-full max-h-[90vh] bg-[#050505] border border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-10 py-7 flex items-center justify-between border-b border-white/5 bg-black/50 shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20 shadow-inner">
                <FaPlus size={24} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Dodaj Publikację</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  Tworzenie Posta
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all hover:rotate-90 hover:scale-110 active:scale-95 border-white/10"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-16">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 glass rounded-3xl border-red-500/30 bg-red-500/5 text-red-400 font-black text-xs uppercase tracking-[0.2em] text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Title & Description Card */}
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] ml-2">Tytuł</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-7 text-2xl font-black text-white placeholder:text-gray-700 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all"
                    placeholder="Wpisz tytuł..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] ml-2">Opis</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] px-8 py-8 text-lg font-medium text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all resize-none leading-relaxed"
                    placeholder="Opisz co się wydarzyło, podaj fakty..."
                  />
                </div>
              </div>

              {/* Media Hub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Images Hub */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <FaImage className="text-primary-500" />
                      <span className="text-[10px] text-white font-black uppercase tracking-[0.3em]">Prześlij Zdjęcie</span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{images.length}/10</span>
                  </div>

                  <div
                    onClick={() => fileInputRefImage.current?.click()}
                    className="group relative h-48 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary-500/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <FaUpload className="text-gray-600 group-hover:text-primary-500 group-hover:-translate-y-2 transition-all duration-500" size={32} />
                    <p className="mt-4 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Wrzuć Zdjęcie</p>
                    <input ref={fileInputRefImage} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pt-2">
                    {imagePreviews.map((preview, idx) => (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={idx} className="relative w-28 h-28 shrink-0 group">
                        <img src={preview} className="w-full h-full object-cover rounded-2xl border border-white/10" alt="" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all"><FaTimes size={12} /></button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Video Hub */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <FaVideo className="text-blue-500" />
                      <span className="text-[10px] text-white font-black uppercase tracking-[0.3em]">Prześlij Video</span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{videos.length}/5</span>
                  </div>

                  <div
                    className="group relative h-48 rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01] transition-all flex flex-col items-center justify-center cursor-not-allowed overflow-hidden opacity-50"
                  >
                    <FaVideo className="text-gray-700" size={32} />
                    <p className="mt-4 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Wkrótce</p>
                    <div className="absolute inset-0 bg-black/20" />
                    <input ref={fileInputRefVideo} type="file" accept="video/*" multiple onChange={handleVideoChange} className="hidden" disabled />
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pt-2">
                    {videoPreviews.map((preview, idx) => (
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={idx} className="relative w-40 h-28 shrink-0 group">
                        <div className="w-full h-full rounded-2xl border border-white/10 bg-black overflow-hidden shadow-2xl relative">
                          <video
                            src={preview}
                            className="w-full h-full object-cover"
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedData={(e) => {
                              e.currentTarget.currentTime = 0.1;
                            }}
                            onError={(e) => {
                              // If video fails to load preview, show a fallback icon
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = "absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-gray-500 p-2 text-center";
                                fallback.innerHTML = `
                                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V174.9l14.2-9.5 96-64c9.9-6.6 22.6-7.1 32.9-1.6z"></path></svg>
                                  <span class="text-[8px] font-black uppercase mt-2">Plik gotowy do wysyłki</span>
                                  <span class="text-[7px] text-gray-600 uppercase mt-1">(Brak podglądu w przeglądarce)</span>
                                `;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                        <button type="button" onClick={() => removeVideo(idx)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all z-10"><FaTimes size={12} /></button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Intel Section */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                    <FaGlobe size={18} />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Powiązane Profile</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <SocialCard icon={<FaFacebook className="text-[#1877F2]" />} label="Facebook" value={facebookUrl} setValue={setFacebookUrl} active={enableFacebook} setActive={setEnableFacebook} />
                  <SocialCard icon={<FaInstagram className="text-[#E4405F]" />} label="Instagram" value={instagramUrl} setValue={setInstagramUrl} active={enableInstagram} setActive={setEnableInstagram} />
                  <SocialCard icon={<FaTiktok className="text-white" />} label="TikTok" value={tiktokUrl} setValue={setTiktokUrl} active={enableTiktok} setActive={setEnableTiktok} />
                </div>
              </div>

              {/* Legal Notice */}
              <div className="p-8 glass rounded-[2.5rem] border-white/5 bg-white/[0.01] flex items-start gap-6 shadow-xl">
                <FaInfoCircle className="text-primary-500 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Uwaga Moderacyjna</h4>
                  <p className="text-[11px] text-gray-500 font-bold leading-relaxed uppercase tracking-[0.15em]">
                    Wszystkie materiały są weryfikowane przez <span className="text-white">Zespół Kontroli Szoniska</span>. Publikowanie treści niezgodnych z regulaminem grozi natychmiastową blokadą ID obywatela.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer Bar */}
          <div className="px-10 py-7 border-t border-white/5 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
            <div className="flex items-center gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`w-14 h-7 rounded-full transition-all flex items-center p-1 ${isAnonymous ? 'bg-primary-500 shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-white/10'}`}
                  >
                    <motion.div animate={{ x: isAnonymous ? 28 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-lg" />
                  </button>
                  <div className="flex items-center gap-3">
                    <FaUserSecret className={isAnonymous ? 'text-primary-400' : 'text-gray-700'} size={18} />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Tryb Ghost</span>
                  </div>
                </div>
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest ml-[72px]">Tożsamość zostanie ukryta</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="hidden sm:block px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-white transition-colors"
              >
                Anuluj
              </button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 sm:flex-none bg-white text-black px-16 py-6 font-black text-[11px] uppercase tracking-[0.5em] rounded-3xl flex items-center justify-center gap-4 group"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>NADAJ <FaChevronRight size={12} className="group-hover:translate-x-2 transition-transform" /></>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

function SocialCard({ icon, label, value, setValue, active, setActive }: any) {
  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => setActive(!active)}
        className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all border ${active ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
          }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-500'}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
        </div>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${active ? 'bg-primary-500 text-white scale-110' : 'border border-gray-700'}`}>
          {active && <FaCheck size={8} />}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Wklej link..."
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-[10px] text-white focus:outline-none focus:border-primary-500/50"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
