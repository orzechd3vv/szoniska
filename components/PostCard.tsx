'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTiktok, FaCalendarAlt, FaChevronRight, FaArrowUp, FaArrowDown, FaUserSecret } from 'react-icons/fa';
import type { Post } from '@/types/post';
import { useSession } from 'next-auth/react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const { data: session } = useSession();
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const [userVote, setUserVote] = useState<'UPVOTE' | 'DOWNVOTE' | null>(post.userVote || null);

  const totalMedia = post.images.length + (post.videos?.length || 0);
  const hasVideos = post.videos && post.videos.length > 0;

  const handleVote = async (e: React.MouseEvent, type: 'UPVOTE' | 'DOWNVOTE') => {
    e.stopPropagation();
    if (!session) return;

    // Save previous state for rollback
    const prevUserVote = userVote;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Calculate optimistic new state instantly
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

    // Update UI instantly (0ms latency)
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
      } else {
        // Rollback on server error
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.015 }}
      onClick={onClick}
      className="group relative glass rounded-[3rem] overflow-hidden cursor-pointer transition-all duration-500 hover:border-primary-500/70 hover:shadow-[0_20px_70px_rgba(168,85,247,0.4)] bg-gradient-to-b from-white/[0.07] to-transparent border border-white/10"
    >
      {/* Media Preview */}
      {totalMedia > 0 && (
        <div className="relative h-80 overflow-hidden bg-black/60">
          {hasVideos ? (() => {
            const videoUrl = post.videos![0];
            const optimizedVideoUrl = videoUrl.includes('cloudinary.com') && videoUrl.includes('/video/upload/')
              ? videoUrl.replace('/video/upload/', '/video/upload/f_auto,q_auto/')
              : videoUrl;
            
            return (
              <video
                src={optimizedVideoUrl}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                preload="metadata"
                muted
                onLoadedData={(e) => {
                  e.currentTarget.currentTime = 0.1;
                }}
              />
            );
          })() : (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          
          {/* Media Count Badge */}
          {totalMedia > 1 && (
            <div className="absolute top-5 right-5 glass-dark px-4 py-2 rounded-full text-[11px] font-black text-white border-white/20 tracking-widest uppercase shadow-2xl backdrop-blur-2xl">
              +{totalMedia - 1} Media
            </div>
          )}

          {/* Voting Controls - Overlay style */}
          <div className="absolute left-5 bottom-5 flex flex-col gap-2.5 z-20">
            <button
              onClick={(e) => handleVote(e, 'UPVOTE')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-2xl border transition-all shadow-2xl touch-manipulation ${
                userVote === 'UPVOTE' 
                  ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-110' 
                  : 'bg-black/70 border-white/20 text-white hover:bg-black/90 hover:border-primary-500/60'
              }`}
            >
              <FaArrowUp size={16} />
            </button>
            <button
              onClick={(e) => handleVote(e, 'DOWNVOTE')}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-2xl border transition-all shadow-2xl touch-manipulation ${
                userVote === 'DOWNVOTE' 
                  ? 'bg-red-500 border-red-400 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-110' 
                  : 'bg-black/70 border-white/20 text-white hover:bg-black/90 hover:border-red-500/60'
              }`}
            >
              <FaArrowDown size={16} />
            </button>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03000a] via-transparent to-transparent opacity-95" />
        </div>
      )}

      <div className="p-9 relative">
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {post.isAnonymous ? (
              <div className="w-14 h-14 rounded-2xl bg-white/[0.08] flex items-center justify-center text-gray-300 border border-white/15 shadow-lg">
                <FaUserSecret size={24} />
              </div>
            ) : (
              <div className="relative">
                {post.user.image ? (
                  <img
                    src={post.user.image}
                    alt={post.user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-500/60 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-900 flex items-center justify-center text-white font-black border-2 border-primary-500/60 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    {post.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-primary-500 border-2 border-[#03000a] rounded-full shadow-[0_0_10px_rgba(168,85,247,1)]" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <p className="font-black text-white text-lg leading-none">
                {post.isAnonymous ? 'Anonimowy' : post.user.name}
              </p>
              <div className="flex items-center gap-2 px-3 py-1 glass rounded-xl border-white/15 shadow-md">
                <div className={`w-2 h-2 rounded-full ${upvotes - downvotes >= 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]'}`} />
                <span className="text-xs font-black text-white">{upvotes - downvotes}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2 mt-2">
              <FaCalendarAlt className="text-primary-400" />
              {new Date(post.createdAt).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-3xl font-black text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary-300 transition-colors uppercase italic">
          {post.title}
        </h3>
        <p className="text-gray-300 text-base line-clamp-2 mb-8 font-medium leading-relaxed">
          {post.description}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/[0.08]">
          <div className="flex gap-3">
            {post.facebookUrl && (
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href={post.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-11 h-11 glass rounded-2xl flex items-center justify-center text-gray-300 hover:text-blue-400 hover:border-blue-500/60 transition-all shadow-lg touch-manipulation"
              >
                <FaFacebook size={18} />
              </motion.a>
            )}
            {post.instagramUrl && (
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href={post.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-11 h-11 glass rounded-2xl flex items-center justify-center text-gray-300 hover:text-pink-400 hover:border-pink-500/60 transition-all shadow-lg touch-manipulation"
              >
                <FaInstagram size={18} />
              </motion.a>
            )}
            {post.tiktokUrl && (
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href={post.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-11 h-11 glass rounded-2xl flex items-center justify-center text-gray-300 hover:text-white hover:border-white/60 transition-all shadow-lg touch-manipulation"
              >
                <FaTiktok size={16} />
              </motion.a>
            )}
          </div>

          <motion.div 
            whileHover={{ x: 6 }}
            className="flex items-center gap-2.5 text-primary-400 font-black text-xs uppercase tracking-widest text-glow"
          >
            Zobacz więcej <FaChevronRight size={12} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
