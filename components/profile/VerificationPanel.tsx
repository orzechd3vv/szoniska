'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaExclamationTriangle, FaEye, FaShieldAlt, FaUser, FaClock, FaExternalLinkAlt, FaChevronRight, FaLayerGroup } from 'react-icons/fa';
import type { Post } from '@/types/post';
import Image from 'next/image';

export default function VerificationPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      const res = await fetch('/api/admin/pending-posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (postId: string, withWarning: boolean = false) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warning: withWarning ? warningMessage : null,
        }),
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        setSelectedPost(null);
        setWarningMessage('');
      }
    } catch (error) {
      console.error('Error approving post:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (postId: string) => {
    if (!confirm('Czy na pewno chcesz odrzucić ten post?')) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/reject`, {
        method: 'POST',
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
        setSelectedPost(null);
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-32 glass rounded-[3.5rem] border-dashed border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-8 shadow-inner">
            <FaCheck size={36} />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">System Czysty</h3>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Wszystkie publikacje zostały zweryfikowane</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20 shadow-xl">
            <FaShieldAlt size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Kolejka moderacji</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Oczekuje <span className="text-primary-400">{posts.length}</span> zgłoszeń do weryfikacji</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-[3rem] overflow-hidden border-white/5 flex flex-col lg:flex-row group hover:border-primary-500/30 transition-all duration-500 shadow-2xl"
          >
            <div className="flex-1 p-10 lg:border-r border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative group/avatar">
                    <div className="absolute -inset-1 bg-primary-500 rounded-2xl blur opacity-0 group-hover/avatar:opacity-30 transition duration-500" />
                    {post.user.image ? (
                      <img src={post.user.image} className="w-12 h-12 rounded-2xl object-cover border border-white/10 relative z-10" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-lg relative z-10">
                        {post.user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-tight">{post.user.name}</p>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">
                      <FaClock className="text-primary-500" /> {new Date(post.createdAt).toLocaleString('pl-PL')}
                    </div>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPreviewPost(post)}
                  className="w-12 h-12 glass rounded-2xl text-primary-400 flex items-center justify-center hover:bg-primary-500/20 border-white/5 shadow-xl transition-all"
                  title="Pełny podgląd"
                >
                  <FaEye size={18} />
                </motion.button>
              </div>

              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic group-hover:text-primary-400 transition-colors leading-tight">{post.title}</h3>
              <p className="text-gray-400 text-[11px] font-medium mb-8 line-clamp-3 leading-relaxed uppercase tracking-widest opacity-80">{post.description}</p>

              {post.images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pt-2">
                  {post.images.map((img, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative w-40 h-28 shrink-0 rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-lg group/img"
                      onClick={() => window.open(img, '_blank')}
                    >
                      <img src={img} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-96 p-10 bg-white/[0.02] flex flex-col gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Uwagi moderacyjne</label>
                  <span className="text-[9px] text-primary-500 font-black uppercase tracking-widest">Opcjonalnie</span>
                </div>
                <textarea
                  value={selectedPost?.id === post.id ? warningMessage : ''}
                  onChange={(e) => {
                    setSelectedPost(post);
                    setWarningMessage(e.target.value);
                  }}
                  placeholder="Zalecenia dla autora szona..."
                  className="input-field w-full text-xs min-h-[120px] resize-none py-5 px-6 leading-relaxed uppercase tracking-widest"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 mt-auto pt-6 border-t border-white/5">
                <button
                  onClick={() => handleApprove(post.id, !!warningMessage)}
                  disabled={processing}
                  className={`group py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                    warningMessage && selectedPost?.id === post.id 
                    ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20' 
                    : 'bg-green-600 text-white hover:bg-green-500 shadow-green-600/20'
                  }`}
                >
                  <FaCheck className="group-hover:scale-125 transition-transform" /> 
                  {warningMessage && selectedPost?.id === post.id ? 'Warunkowo' : 'Zatwierdź szona'}
                </button>
                <button
                  onClick={() => handleReject(post.id)}
                  disabled={processing}
                  className="py-5 rounded-[1.5rem] glass border-red-500/20 text-red-500 hover:bg-red-500/10 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
                >
                  <FaTimes /> Odrzuć trwale
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {previewPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setPreviewPost(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="glass rounded-[3.5rem] p-12 max-w-5xl w-full max-h-[90vh] overflow-y-auto border-white/10 relative z-10 scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary-500/10 flex items-center justify-center text-primary-400 shadow-inner">
                    <FaEye size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Full Access Preview</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Audit przed publikacją globalną</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPreviewPost(null)} 
                  className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-xl"
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>

              <div className="glass rounded-[4rem] border-white/5 overflow-hidden bg-black/40 shadow-2xl relative">
                {previewPost.images && previewPost.images.length > 0 && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img src={previewPost.images[0]} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                      <div className="flex items-center gap-4 mb-6">
                         {previewPost.user.image ? (
                          <img src={previewPost.user.image} className="w-12 h-12 rounded-2xl border-2 border-white/20 shadow-2xl" />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-xl shadow-2xl">{previewPost.user.name.charAt(0)}</div>
                        )}
                        <div>
                          <span className="block text-white font-black text-lg uppercase tracking-tight">{previewPost.user.name}</span>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Obywatel Szoniska</span>
                        </div>
                      </div>
                      <h3 className="text-5xl font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-2xl">{previewPost.title}</h3>
                    </div>
                  </div>
                )}
                
                <div className="p-12 space-y-10">
                  <p className="text-gray-300 text-xl font-medium leading-relaxed whitespace-pre-wrap uppercase tracking-wider">{previewPost.description}</p>
                  
                  {previewPost.images.length > 1 && (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {previewPost.images.slice(1).map((img, i) => (
                        <motion.img 
                          key={i} 
                          whileHover={{ scale: 1.02 }}
                          src={img} 
                          className="w-full aspect-[4/3] object-cover rounded-[2rem] border border-white/10 shadow-xl" 
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5">
                    {[
                      { url: previewPost.facebookUrl, label: 'Meta', color: 'bg-blue-500' },
                      { url: previewPost.instagramUrl, label: 'Insta', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600' },
                      { url: previewPost.tiktokUrl, label: 'TikTok', color: 'bg-black border-white/20' }
                    ].filter(s => s.url).map((s, i) => (
                      <span key={i} className={`px-8 py-3 glass rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} /> {s.label} Link
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 glass rounded-[2.5rem] border-primary-500/20 bg-primary-500/5 flex items-center gap-6 shadow-xl relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
                  <FaShieldAlt size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">Status Symulacji</h4>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest opacity-80">Tak będzie prezentował się post po Twoim zatwierdzeniu. Sprawdź czy wszystkie media i opisy są poprawne przed emisją.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

