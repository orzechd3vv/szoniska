'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserSecret, FaCalendarAlt, FaShareAlt, FaComments, FaCheck, FaArrowLeft, FaUser, FaArrowUp, FaArrowDown, FaExpand } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import VideoPlayer from './VideoPlayer';
import CommentSection from './CommentSection';
import ImageLightbox from './ImageLightbox';

import { Post } from '@/types/post';

interface PostModalProps {
  post: Post;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function PostModal({ post: initialPost, onClose, onUpdate }: PostModalProps) {
  const { data: session } = useSession();
  const [post, setPost] = useState<Post>(initialPost);
  const [loading, setLoading] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [upvotes, setUpvotes] = useState(initialPost.upvotes || 0);
  const [downvotes, setDownvotes] = useState(initialPost.downvotes || 0);
  const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(initialPost.userVote || null);

  useEffect(() => {
    setPost(initialPost);
    setUpvotes(initialPost.upvotes || 0);
    setDownvotes(initialPost.downvotes || 0);
    setUserVote(initialPost.userVote || null);

    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, [initialPost]);

  const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (!session) return;

    // Save previous state for rollback
    const prevUserVote = userVote;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Calculate optimistic new state instantly (0ms latency)
    let newVote: 'UPVOTE' | 'DOWNVOTE' | null = type;
    let newUpvotes = prevUpvotes;
    let newDownvotes = prevDownvotes;

    if (prevUserVote === type) {
      newVote = null;
      if (type === 'UPVOTE') newUpvotes = Math.max(0, prevUpvotes - 1);
      else newDownvotes = Math.max(0, prevDownvotes - 1);
    } else {
      if (prevUserVote === 'UPVOTE') newUpvotes = Math.max(0, prevUpvotes - 1);
      if (prevUserVote === 'DOWNVOTE') newDownvotes = Math.max(0, prevDownvotes - 1);

      if (type === 'UPVOTE') newUpvotes += 1;
      if (type === 'DOWNVOTE') newDownvotes += 1;
    }

    // Apply instantly
    setUserVote(newVote);
    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);

    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setUserVote(data.userVote);
        if (onUpdate) onUpdate();
      } else {
        setUserVote(prevUserVote);
        setUpvotes(prevUpvotes);
        setDownvotes(prevDownvotes);
      }
    } catch (error) {
      console.error('Error voting:', error);
      setUserVote(prevUserVote);
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading || !post) return null;

  const allMedia = [
    ...(post.videos || []).map(url => ({ type: 'video' as const, url })),
    ...(post.images || []).map(url => ({ type: 'image' as const, url }))
  ];

  const imageStartIndex = post.videos?.length || 0;

  const openLightbox = () => {
    if (allMedia[currentMediaIndex]?.type === 'image' && post.images.length > 0) {
      setLightboxIndex(currentMediaIndex - imageStartIndex);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 overflow-hidden">
      {/* Background Glows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#03000a] backdrop-blur-3xl"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary-600/25 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary-900/10 via-transparent to-purple-900/10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        className="relative w-full h-full flex flex-col z-10"
      >
        {/* Cinematic Header */}
        <header className="w-full py-5 bg-transparent">
          <div className="max-w-8xl mx-auto px-6 sm:px-12">
            <div className="flex items-center justify-between">
              <div onClick={onClose} className="flex items-center gap-4 sm:gap-6 cursor-pointer group touch-manipulation">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center overflow-hidden border-primary-500/40 shadow-xl">
                    <img src="/logo.png" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase italic">SZONISKA<span className="text-primary-400">.</span></h1>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Content</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 text-gray-400 group-hover:text-white transition-all ml-2 sm:ml-4 border border-white/10">
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-[10px]" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Powrót</span>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <motion.button
                  onClick={handleShare}
                  animate={{
                    backgroundColor: isCopied ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: isCopied ? '#34d399' : 'rgba(255, 255, 255, 0.15)',
                  }}
                  className="relative flex items-center justify-center gap-3 px-6 sm:px-10 py-3 sm:py-3.5 text-white rounded-2xl transition-all border-2 touch-manipulation shadow-xl"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div key="copied" initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                        <FaCheck size={12} /> <span className="text-[10px] font-black uppercase tracking-widest">Skopiowano</span>
                      </motion.div>
                    ) : (
                      <motion.div key="share" initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3">
                        <FaShareAlt size={12} /> <span className="text-[10px] font-black uppercase tracking-widest">Udostępnij</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-6 scrollbar-hide">
          <div className="max-w-8xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 relative">

            {/* Left Column: Media */}
            <div className="lg:w-[60%] space-y-6">
              <div className="relative h-[45vh] sm:h-[60vh] lg:h-auto lg:aspect-video glass rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border-white/15 bg-black shadow-2xl group/media">
                <AnimatePresence mode="wait">
                  <motion.div key={currentMediaIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    {allMedia[currentMediaIndex]?.type === 'video' ? (
                      <VideoPlayer src={allMedia[currentMediaIndex].url} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center cursor-zoom-in" onClick={openLightbox}>
                        <img src={allMedia[currentMediaIndex]?.url} className="max-w-full max-h-full object-contain" alt="" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {allMedia[currentMediaIndex]?.type === 'image' && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={openLightbox}
                    className="absolute top-4 sm:top-5 right-4 sm:right-5 z-30 w-11 h-11 sm:w-12 sm:h-12 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl transition-all touch-manipulation"
                    title="Pełny ekran"
                  >
                    <FaExpand size={18} />
                  </motion.button>
                )}

                {allMedia.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-3 glass rounded-3xl border-white/15 z-20 overflow-x-auto max-w-[90%] scrollbar-hide">
                    {allMedia.map((media, idx) => (
                      <button key={idx} onClick={() => setCurrentMediaIndex(idx)} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 touch-manipulation ${currentMediaIndex === idx ? 'border-primary-500 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                        {media.type === 'video' ? <video src={media.url} className="w-full h-full object-cover" /> : <img src={media.url} className="w-full h-full object-cover" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* HORIZONTAL VOTING PANEL */}
              <div className="flex items-center gap-6 sm:gap-8 px-4 sm:px-8 py-2">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleVote('UPVOTE')}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all touch-manipulation ${userVote === 'UPVOTE'
                        ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-110'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                  >
                    <FaArrowUp size={20} />
                  </motion.button>

                  <div className="flex flex-col items-center min-w-[60px]">
                    <span className={`text-2xl sm:text-3xl font-black italic tracking-tighter ${upvotes - downvotes >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {upvotes - downvotes}
                    </span>
                    <span className="text-[7px] sm:text-[8px] text-gray-400 font-black uppercase tracking-widest">Sygnał</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleVote('DOWNVOTE')}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all touch-manipulation ${userVote === 'DOWNVOTE'
                        ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] scale-110'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                  >
                    <FaArrowDown size={20} />
                  </motion.button>
                </div>

                <div className="h-8 w-px bg-white/10 mx-2" />

                <div className="flex items-center gap-3 text-gray-400">
                  <FaComments size={18} className="text-primary-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sekcja Opinii</span>
                </div>
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="lg:w-[40%] space-y-8 sm:space-y-10">
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl relative shrink-0">
                    {post.isAnonymous ? (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-300 rounded-2xl border border-white/15"><FaUserSecret size={26} /></div>
                    ) : (
                      <img src={post.user.image || ''} className="w-full h-full object-cover rounded-2xl border-2 border-primary-500/50 shadow-md" alt="" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase italic leading-none mb-2">{post.isAnonymous ? 'Ghost Post' : post.user.name}</h3>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2"><FaCalendarAlt className="text-primary-400" /> {new Date(post.createdAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">{post.title}</h1>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-medium whitespace-pre-wrap italic border-l-2 border-primary-500/40 pl-6 sm:pl-8">{post.description}</p>
              </div>

              {/* Discussion */}
              <div className="pt-10 border-t border-white/10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-primary-400 to-purple-600 rounded-full" />
                  <h3 className="text-[11px] text-white font-black uppercase tracking-[0.4em]">Sekcja Komentarzy</h3>
                </div>
                <CommentSection postId={post.id} />
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {lightboxIndex !== null && post.images.length > 0 && (
        <ImageLightbox
          images={post.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          alt={post.title}
        />
      )}
    </div>,
    document.body
  );
}
