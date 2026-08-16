'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaUserSecret, FaCalendarAlt, FaExclamationTriangle, FaTrash, FaFacebook, FaInstagram, FaTiktok, FaShareAlt, FaPlus, FaComments, FaHistory, FaShieldAlt, FaCheck, FaShare } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import VideoPlayer from '@/components/VideoPlayer';
import CommentSection from '@/components/CommentSection';

interface Post {
  id: string;
  title: string;
  description: string;
  images?: string[];
  videos?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  createdAt: string;
  isAnonymous?: boolean;
  user: {
    id?: string;
    name: string;
    image?: string;
  };
  warnings: Array<{
    id: string;
    message: string;
    createdAt: string;
  }>;
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        setError('Nie znaleziono posta');
      }
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania posta');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-center">
        <div className="space-y-8 max-w-md mx-auto">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto" />
          <h1 className="text-3xl font-black text-white uppercase">{error || 'Post nie istnieje'}</h1>
          <button onClick={() => router.push('/')} className="btn-primary px-8 py-4 w-full">Wróć na stronę główną</button>
        </div>
      </div>
    );
  }

  const allMedia = [
    ...(post.videos || []).map(url => ({ type: 'video' as const, url })),
    ...(post.images || []).map(url => ({ type: 'image' as const, url }))
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary-500/30 overflow-x-hidden">
      {/* Cinematic Background Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[150px] rounded-full animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
        animate={isExiting ? { opacity: 0, scale: 0.9, filter: 'blur(30px)', y: 20 } : { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {/* IDENTICAL HEADER TO MAIN PAGE - TRANSPARENT */}
        <header className="w-full py-6 bg-transparent">
          <div className="max-w-8xl mx-auto px-12">
            <div className="flex items-center justify-between">
              {/* Logo / Back Link */}
              <div onClick={handleBack} className="flex items-center gap-6 cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 glass rounded-2xl flex items-center justify-center overflow-hidden border-primary-500/30">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(100,17,255,0.5)]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-black tracking-tighter text-white leading-none uppercase">
                      SZONISKA<span className="text-primary-500">.</span>
                    </h1>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Content</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-500 group-hover:text-white transition-all ml-4 border border-white/5">
                  <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-[10px]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Powrót</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Share Button with Animation & Border */}
                <motion.button
                  onClick={handleShare}
                  initial={false}
                  animate={{
                    backgroundColor: isCopied ? '#22c55e' : 'rgba(100, 17, 255, 0.2)',
                    borderColor: isCopied ? '#4ade80' : 'rgba(255, 255, 255, 0.1)',
                    scale: isCopied ? 1.05 : 1
                  }}
                  className="relative flex items-center justify-center gap-4 px-10 py-3.5 text-white rounded-2xl transition-all shadow-lg overflow-hidden min-w-[180px] border-2 backdrop-blur-md"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="copied"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2 font-mono"
                      >
                        <FaCheck className="text-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Skopiowano</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="share"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-4 font-mono"
                      >
                        <FaShare className="text-sm" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Udostępnij</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {session ? (
                  <div className="flex items-center gap-3 px-3 py-2 glass rounded-2xl border-white/10">
                    <div className="relative">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="w-9 h-9 rounded-xl object-cover border border-primary-500/50"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white font-black border border-primary-500/50">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start hidden sm:flex pr-2">
                      <span className="text-xs font-black text-white truncate max-w-[100px]">
                        {session.user?.name}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
                        {session.user?.isAdmin ? 'Administrator' : 'Użytkownik'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button className="btn-primary py-2.5 px-8 text-sm">Zaloguj się</button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-8xl mx-auto px-12 py-12">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left Column: Media Gallery */}
            <div className="lg:w-[60%] space-y-8">
              <div className="relative aspect-video glass rounded-[3rem] overflow-hidden border-white/10 bg-black shadow-[0_0_100px_rgba(0,0,0,0.8)] group/media">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMediaIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    {allMedia[currentMediaIndex]?.type === 'video' ? (
                      <VideoPlayer src={allMedia[currentMediaIndex].url} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img src={allMedia[currentMediaIndex]?.url} className="max-w-full max-h-full object-contain rounded-2xl" alt="" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Media Counter Overlay - Hidden unless hovering */}
                {allMedia.length > 1 && (
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 glass rounded-full border-white/10 text-white text-[10px] font-black uppercase tracking-widest z-[110] opacity-0 group-hover/media:opacity-100 transition-opacity duration-500">
                    {currentMediaIndex + 1} <span className="text-gray-600 mx-2">/</span> {allMedia.length}
                  </div>
                )}

                {/* Navigation Thumbnails - Hidden unless hovering */}
                {allMedia.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-3 glass rounded-3xl border-white/10 z-20 overflow-x-auto max-w-[90%] scrollbar-hide opacity-0 group-hover/media:opacity-100 translate-y-4 group-hover/media:translate-y-0 transition-all duration-500">
                    {allMedia.map((media) => (
                      <button
                        key={media.url}
                        onClick={() => setCurrentMediaIndex(allMedia.indexOf(media))}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${currentMediaIndex === allMedia.indexOf(media) ? 'border-primary-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        {media.type === 'video' ? (
                          <video src={media.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={media.url} className="w-full h-full object-cover" alt="" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Info & Discussion */}
            <div className="lg:w-[40%] space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl relative shrink-0">
                    {post.isAnonymous ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-400 rounded-2xl border border-white/10">
                        <FaUserSecret size={28} />
                      </div>
                    ) : (
                      post.user.image ? (
                        <img src={post.user.image} className="w-full h-full object-cover rounded-2xl border border-white/10" alt="" />
                      ) : (
                        <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-black text-2xl rounded-2xl border border-white/10 uppercase">
                          {post.user.name.charAt(0)}
                        </div>
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
                      {post.isAnonymous ? 'Użytkownik Anonimowy' : post.user.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <FaCalendarAlt className="text-primary-500/50" /> {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">{post.title}</h1>
                <p className="text-gray-400 text-lg leading-relaxed font-medium whitespace-pre-wrap">{post.description}</p>
              </div>

              {/* Socials */}
              {(post.facebookUrl || post.instagramUrl || post.tiktokUrl) && (
                <div className="flex flex-wrap gap-3">
                  {post.facebookUrl && <SocialButton icon={<FaFacebook />} label="Facebook" url={post.facebookUrl} color="bg-[#1877F2]" />}
                  {post.instagramUrl && <SocialButton icon={<FaInstagram />} label="Instagram" url={post.instagramUrl} color="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]" />}
                  {post.tiktokUrl && <SocialButton icon={<FaTiktok />} label="TikTok" url={post.tiktokUrl} color="bg-black border border-white/20" />}
                </div>
              )}

              {/* Discussion Section */}
              <div className="pt-12 border-t border-white/5 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                  <h3 className="text-[11px] text-white font-black uppercase tracking-[0.4em]">Sekcja Komentarzy</h3>
                </div>
                <CommentSection postId={post.id} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SocialButton({ icon, label, url, color }: any) {
  return (
    <motion.a
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-white transition-all shadow-xl ${color}`}
    >
      {icon}
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </motion.a>
  );
}
