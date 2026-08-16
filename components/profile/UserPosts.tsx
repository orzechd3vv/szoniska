'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaComment, FaCalendarAlt, FaExclamationTriangle, FaClipboardList, FaLayerGroup, FaChevronRight } from 'react-icons/fa';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import type { Post } from '@/types/post';

export default function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [userStatus, setUserStatus] = useState<{ isBlocked: boolean; isRestricted: boolean } | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchUserStatus();
  }, []);

  const fetchUserStatus = async () => {
    try {
      const res = await fetch('/api/user/stats');
      if (res.ok) {
        const data = await res.json();
        setUserStatus({
          isBlocked: data.isBlocked,
          isRestricted: data.isRestricted,
        });
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/user/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingPost(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getStatusConfig = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    const configs = {
      PENDING: {
        label: 'W weryfikacji',
        styles: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        dot: 'bg-amber-500'
      },
      APPROVED: {
        label: 'Opublikowany',
        styles: 'bg-green-500/10 text-green-500 border-green-500/20',
        dot: 'bg-green-500'
      },
      REJECTED: {
        label: 'Odrzucony',
        styles: 'bg-red-500/10 text-red-500 border-red-500/20',
        dot: 'bg-red-500'
      },
    };
    return configs[status] || configs.PENDING;
  };

  if (loading || statusLoading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
            <FaLayerGroup size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Moja twórczość</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Zarządzanie Twoimi publikacjami</p>
          </div>
        </div>
        
        {!userStatus?.isBlocked && !userStatus?.isRestricted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="btn-primary py-4 px-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <FaPlus /> Utwórz nowy szon
          </motion.button>
        )}
      </div>

      {/* Status Notifications */}
      {(userStatus?.isBlocked || userStatus?.isRestricted) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-[2rem] border ${
            userStatus.isBlocked
              ? 'bg-red-500/5 border-red-500/20 text-red-400'
              : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
          } flex items-start gap-5 shadow-2xl`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            userStatus.isBlocked ? 'bg-red-500/10' : 'bg-amber-500/10'
          }`}>
            <FaExclamationTriangle size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Status ograniczenia</h4>
            <p className="text-[11px] font-medium leading-relaxed opacity-80 uppercase tracking-wider">
              {userStatus.isBlocked
                ? 'Twoje konto zostało zablokowane. Możliwość dodawania i edycji treści jest obecnie wyłączona. Kontaktuj się z administracją.'
                : 'Twoje konto posiada ograniczenia funkcjonalne. Możesz przeglądać swoje posty, ale dodawanie nowych jest zablokowane.'}
            </p>
          </div>
        </motion.div>
      )}

      {posts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 glass rounded-[3.5rem] border-white/5"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700 mx-auto mb-8">
            <FaClipboardList size={36} />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-3 uppercase">Pusto tutaj...</h3>
          <p className="text-gray-500 text-xs font-medium max-w-xs mx-auto uppercase tracking-widest leading-loose">
            Nie masz jeszcze żadnych opublikowanych treści. Zacznij dzielić się nimi już teraz!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group glass rounded-[3rem] p-8 border-white/5 hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* Media Preview Container */}
                <div className="w-full lg:w-60 h-60 rounded-[2.5rem] overflow-hidden relative shrink-0 bg-black/40 border border-white/10 group-hover:border-primary-500/30 transition-colors">
                  {post.images?.[0] ? (
                    <img src={post.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  ) : post.videos?.[0] ? (
                    <video src={post.videos[0]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 gap-2">
                      <FaLayerGroup size={32} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Brak mediów</span>
                    </div>
                  )}
                  
                  {/* Media Counter Badge */}
                  {(post.images?.length || 0) + (post.videos?.length || 0) > 1 && (
                    <div className="absolute top-4 left-4 glass-dark px-3 py-1.5 rounded-xl text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                      {(post.images?.length || 0) + (post.videos?.length || 0)} plików
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FaChevronRight className="text-white translate-x-[-20px] group-hover:translate-x-0 transition-transform duration-500" size={24} />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 py-2">
                  <div className="flex flex-wrap items-center gap-4 mb-5">
                    <h3 className="text-3xl font-black text-white tracking-tighter truncate max-w-lg leading-tight uppercase italic group-hover:text-primary-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.status && (
                      <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] ${getStatusConfig(post.status).styles}`}>
                        <div className={`w-2 h-2 rounded-full ${getStatusConfig(post.status).dot} shadow-[0_0_8px_currentColor] animate-pulse`} />
                        {getStatusConfig(post.status).label}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-xs font-medium mb-8 line-clamp-3 leading-relaxed uppercase tracking-widest opacity-80">
                    {post.description}
                  </p>

                  {/* Stats & Metadata */}
                  <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-primary-400 border border-white/5">
                        <FaCalendarAlt size={12} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Opublikowano</span>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString('pl-PL')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/5">
                        <FaEye size={12} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Zasięgi</span>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">{post.views || 0} wyświetleń</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-green-400 border border-white/5">
                        <FaComment size={12} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Dyskusja</span>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">{post.comments?.length || 0} odpowiedzi</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Action Column */}
                <div className="flex lg:flex-col gap-3 shrink-0 self-center lg:self-start lg:pt-4">
                  {!userStatus?.isBlocked && !userStatus?.isRestricted && (
                    <motion.button
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingPost(post)}
                      className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-blue-400 border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all shadow-xl"
                      title="Edytuj post"
                    >
                      <FaEdit size={20} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeletingPost(post)}
                    className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-red-500 border-white/5 hover:border-red-500/50 hover:bg-red-500/10 transition-all shadow-xl"
                    title="Usuń post"
                  >
                    <FaTrash size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Admin Feedback Section */}
              {post.warnings && post.warnings.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-10 p-6 glass-dark border-amber-500/20 bg-amber-500/5 rounded-3xl"
                >
                  <div className="flex items-center gap-3 text-amber-500 mb-3">
                    <FaExclamationTriangle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Uwagi administratora</span>
                  </div>
                  <div className="space-y-2">
                    {post.warnings.map((w) => (
                      <p key={w.id} className="text-gray-400 text-[11px] font-medium leading-relaxed uppercase tracking-wider">{w.message}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePostModal onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); fetchPosts(); }} />
        )}
        {editingPost && (
          <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onSuccess={() => { setEditingPost(null); fetchPosts(); }} />
        )}
        {deletingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
              onClick={() => setDeletingPost(null)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }} 
              className="glass rounded-[3.5rem] p-12 max-w-md w-full relative border-red-500/20 shadow-[0_0_100px_rgba(239,68,68,0.1)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner">
                <FaTrash size={36} />
              </div>
              <h3 className="text-3xl font-black text-white text-center mb-3 uppercase tracking-tighter">Potwierdź usunięcie</h3>
              <p className="text-gray-500 text-center text-xs font-black uppercase tracking-widest mb-12 leading-relaxed opacity-80">
                Usunięcie posta jest nieodwracalne. Wszystkie media oraz komentarze zostaną trwale skasowane.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => handleDelete(deletingPost.id)} 
                  className="w-full bg-red-600 hover:bg-red-700 py-5 rounded-[1.5rem] font-black text-[10px] text-white uppercase tracking-[0.3em] transition-all shadow-lg shadow-red-600/20 active:scale-95"
                >
                  Usuń bezpowrotnie
                </button>
                <button 
                  onClick={() => setDeletingPost(null)} 
                  className="w-full glass py-5 rounded-[1.5rem] font-black text-[10px] text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-all active:scale-95"
                >
                  Anuluj operację
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


