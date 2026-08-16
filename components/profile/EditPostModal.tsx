'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaFacebook, FaInstagram, FaTiktok, FaVideo, FaImage, FaEdit, FaCheck, FaGlobe, FaUserSecret, FaInfoCircle, FaTrash } from 'react-icons/fa';
import type { Post } from '@/types/post';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditPostModal({ post, onClose, onSuccess }: EditPostModalProps) {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(post.images);
  const [existingVideos, setExistingVideos] = useState<string[]>(post.videos || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [enableFacebook, setEnableFacebook] = useState(!!post.facebookUrl);
  const [enableInstagram, setEnableInstagram] = useState(!!post.instagramUrl);
  const [enableTiktok, setEnableTiktok] = useState(!!post.tiktokUrl);
  const [facebookUrl, setFacebookUrl] = useState(post.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(post.instagramUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState(post.tiktokUrl || '');
  const [isAnonymous, setIsAnonymous] = useState(post.isAnonymous || false);
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
    if (existingImages.length + images.length + files.length > 10) {
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
    if (existingVideos.length + videos.length + files.length > 5) {
      setError('Maksymalnie 5 filmów');
      return;
    }
    setVideos([...videos, ...files]);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setVideoPreviews((prev) => [...prev, url]);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index: number) => {
    setExistingVideos(existingVideos.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index: number) => {
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
      const imageUrls: string[] = [...existingImages];
      for (const image of images) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const { url } = await uploadRes.json();
        imageUrls.push(url);
      }

      const videoUrls: string[] = [...existingVideos];
      for (const video of videos) {
        const formData = new FormData();
        formData.append('file', video);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Failed to upload video');
        const { url } = await uploadRes.json();
        videoUrls.push(url);
      }

      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          images: imageUrls,
          videos: videoUrls,
          facebookUrl: enableFacebook ? facebookUrl : null,
          instagramUrl: enableInstagram ? instagramUrl : null,
          tiktokUrl: enableTiktok ? tiktokUrl : null,
          isAnonymous,
        }),
      });

      if (!res.ok) throw new Error('Failed to update post');
      onSuccess();
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji posta');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          className="glass rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 bg-[#020202]/80 backdrop-blur-md px-12 py-8 flex items-center justify-between border-b border-white/5 z-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                <FaEdit size={20} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Edytuj publikację</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Aktualizacja treści szona</p>
              </div>
            </div>
            <button onClick={onClose} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all">
              <FaTimes size={20} />
            </button>
          </div>

          <div className="p-12">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-6 glass rounded-3xl border-red-500/20 bg-red-500/5 text-red-400 font-black text-xs uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              <section className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Tytuł publikacji</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field w-full text-xl py-6"
                    placeholder="Wpisz nowy tytuł..."
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1">Szczegółowy opis</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="input-field w-full py-6 resize-none"
                    placeholder="Wpisz nową treść..."
                    required
                  />
                </div>
              </section>

              {/* Media Section */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <FaImage className="text-primary-500" /> Zdjęcia ({existingImages.length + images.length}/10)
                  </label>
                  {existingImages.length + images.length < 10 && (
                    <div 
                      className="relative group h-32 glass rounded-[2rem] border-dashed border-2 border-white/10 hover:border-primary-500/50 transition-all flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => fileInputRefImage.current?.click()}
                    >
                      <FaUpload className="text-gray-600 group-hover:text-primary-500 mb-1 transition-colors" size={20} />
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Dodaj zdjęcia</span>
                      <input
                        ref={fileInputRefImage}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    {/* Existing */}
                    {existingImages.map((img, idx) => (
                      <div key={`existing-${idx}`} className="relative aspect-square group">
                        <img src={img} className="w-full h-full object-cover rounded-xl border border-white/5 opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                    {/* New */}
                    {imagePreviews.map((preview, idx) => (
                      <div key={`new-${idx}`} className="relative aspect-square group">
                        <img src={preview} className="w-full h-full object-cover rounded-xl border-2 border-primary-500/50 shadow-lg shadow-primary-500/20" alt="" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-4">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <FaVideo className="text-blue-500" /> Wideo ({existingVideos.length + videos.length}/5)
                  </label>
                  {existingVideos.length + videos.length < 5 && (
                    <div 
                      className="relative group h-32 glass rounded-[2rem] border-dashed border-2 border-white/10 hover:border-blue-500/50 transition-all flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => fileInputRefVideo.current?.click()}
                    >
                      <FaVideo className="text-gray-600 group-hover:text-blue-500 mb-1 transition-colors" size={20} />
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Dodaj wideo</span>
                      <input
                        ref={fileInputRefVideo}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {/* Existing */}
                    {existingVideos.map((video, idx) => (
                      <div key={`existing-v-${idx}`} className="relative aspect-video group">
                        <video src={video} className="w-full h-full object-cover rounded-xl border border-white/5 bg-black opacity-70 group-hover:opacity-100 transition-opacity" />
                        <button
                          type="button"
                          onClick={() => removeExistingVideo(idx)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                    {/* New */}
                    {videoPreviews.map((preview, idx) => (
                      <div key={`new-v-${idx}`} className="relative aspect-video group">
                        <video 
                          src={preview} 
                          className="w-full h-full object-cover rounded-xl border-2 border-blue-500/50 bg-black shadow-lg shadow-blue-500/20" 
                          controls
                          muted
                          onLoadedData={(e) => {
                            e.currentTarget.currentTime = 0.1;
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeNewVideo(idx)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Social Media Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                    <FaGlobe size={14} />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Linki społecznościowe</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FB */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaFacebook className="text-[#1877F2]" />
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Facebook</span>
                      </div>
                      <SocialToggle active={enableFacebook} onClick={() => setEnableFacebook(!enableFacebook)} />
                    </div>
                    <AnimatePresence>
                      {enableFacebook && (
                        <motion.input
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          type="url"
                          value={facebookUrl}
                          onChange={(e) => setFacebookUrl(e.target.value)}
                          className="input-field w-full text-xs"
                          placeholder="Link do profilu/posta"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* IG */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaInstagram className="text-[#E4405F]" />
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Instagram</span>
                      </div>
                      <SocialToggle active={enableInstagram} onClick={() => setEnableInstagram(!enableInstagram)} />
                    </div>
                    <AnimatePresence>
                      {enableInstagram && (
                        <motion.input
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          type="url"
                          value={instagramUrl}
                          onChange={(e) => setInstagramUrl(e.target.value)}
                          className="input-field w-full text-xs"
                          placeholder="Link do profilu"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* TT */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaTiktok className="text-white" />
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">TikTok</span>
                      </div>
                      <SocialToggle active={enableTiktok} onClick={() => setEnableTiktok(!enableTiktok)} />
                    </div>
                    <AnimatePresence>
                      {enableTiktok && (
                        <motion.input
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          type="url"
                          value={tiktokUrl}
                          onChange={(e) => setTiktokUrl(e.target.value)}
                          className="input-field w-full text-xs"
                          placeholder="Link @użytkownik"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </section>

              {/* Bottom Actions */}
              <section className="pt-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <button 
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`w-16 h-8 rounded-full transition-all flex items-center p-1 ${isAnonymous ? 'bg-primary-500' : 'bg-white/10'}`}
                    >
                      <motion.div 
                        animate={{ x: isAnonymous ? 32 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-[10px]"
                      >
                        {isAnonymous ? <FaCheck className="text-primary-500" size={10} /> : null}
                      </motion.div>
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <FaUserSecret className={isAnonymous ? 'text-primary-500' : 'text-gray-600'} />
                        <span className="text-xs font-black text-white uppercase tracking-widest">Tryb anonimowy</span>
                      </div>
                      <p className="text-[10px] text-gray-600 font-bold mt-1">Ukryj autora pod tą publikacją</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="flex-1 md:flex-none btn-primary px-12 py-5 font-black text-[10px] uppercase tracking-[0.3em]"
                    >
                      {submitting ? 'Zapisywanie...' : 'Zaktualizuj szon'}
                    </motion.button>
                  </div>
                </div>

                <div className="mt-8 p-6 glass rounded-3xl border-white/5 flex items-start gap-4">
                  <FaInfoCircle className="text-primary-500 shrink-0 mt-1" />
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-widest">
                    Zmienione treści zostaną ponownie <span className="text-white font-black">zweryfikowane</span> przez moderatorów. Podczas weryfikacji post może być tymczasowo niewidoczny dla innych.
                  </p>
                </div>
              </section>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

function SocialToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-white/5 text-gray-500 hover:text-white'
      }`}
    >
      {active ? 'Aktywne' : 'Dodaj'}
    </button>
  );
}

