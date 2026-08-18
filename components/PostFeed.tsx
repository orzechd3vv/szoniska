'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaThumbtack, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PostCard from './PostCard';
import PostModal from './PostModal';
import type { Post } from '@/types/post';

interface PostFeedProps {
  filter?: 'latest' | 'popular';
}

const POSTS_PER_PAGE = 6;

export default function PostFeed({ filter = 'latest' }: PostFeedProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async (search?: string) => {
    setSearching(true);
    try {
      let url = `/api/posts?filter=${filter}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url);
      
      if (res.status === 403) {
        const data = await res.json();
        setError(data.error);
        setLoading(false);
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchPosts();
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePinPost = async (postId: string, pin: boolean) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        fetchPosts(searchQuery || undefined);
      } else {
        const data = await res.json();
        alert(data.error || 'Nie udało się przypiąć posta');
      }
    } catch (error) {
      console.error('Error pinning post:', error);
      alert('Wystąpił błąd podczas przypinania posta');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="max-w-md mx-auto bg-gradient-to-br from-red-900/20 to-red-800/10 border-2 border-red-500/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Konto zablokowane</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Wyszukiwarka */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600/20 to-blue-600/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          
          <form onSubmit={handleSearch} className="relative glass rounded-[2.5rem] border-white/10 p-2 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-4 px-6 py-1">
              <FaSearch className="text-gray-400 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj po tytule lub autorze..."
                className="flex-1 bg-transparent text-white py-4 text-sm font-bold placeholder:text-gray-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all touch-manipulation"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={searching}
              className="md:w-48 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 disabled:bg-gray-800 text-white font-black text-xs uppercase tracking-[0.25em] rounded-[2rem] transition-all shadow-lg shadow-primary-900/20 touch-manipulation"
            >
              {searching ? 'Szukam...' : 'Wyszukaj'}
            </motion.button>
          </form>
        </div>

        {/* Szybkie filtry */}
        <div className="flex flex-wrap gap-4 mt-6 px-6">
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Szybkie filtry:</span>
          {['najnowsze', 'popularne', 'przypięte'].map((tag) => (
            <button 
              key={tag}
              onClick={() => {
                if (tag === 'najnowsze') {
                  setSearchQuery('');
                  fetchPosts();
                }
              }}
              className="text-[10px] text-gray-400 hover:text-primary-300 font-black uppercase tracking-widest transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </motion.div>

      {paginatedPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <h2 className="text-2xl text-gray-400 mb-4">Nie znaleziono postów</h2>
          <p className="text-gray-500">Spróbuj zmienić kryteria wyszukiwania</p>
        </motion.div>
      ) : (
      <>
        {/* Czysty, natychmiastowy grid postów bez podwójnych animacji i migotania */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <div key={post.id} className="relative">
              {post.isPinned && (
                <div className="absolute -top-2 -right-2 z-10 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <FaThumbtack />
                  Przypięte
                </div>
              )}
              <PostCard post={post} onClick={() => setSelectedPost(post)} />
              {session?.user?.isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinPost(post.id, !post.isPinned);
                  }}
                  className={`absolute top-2 left-2 z-10 p-2 rounded-full shadow-lg transition-colors ${
                    post.isPinned
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-gray-800/90 hover:bg-gray-700 text-gray-400'
                  }`}
                  title={post.isPinned ? 'Odepnij post' : 'Przypnij post'}
                >
                  <FaThumbtack />
                </motion.button>
              )}
            </div>
          ))}
        </div>

        {/* Nawigacja stron */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 glass rounded-2xl border-white/15 text-white font-black text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation shadow-lg"
            >
              <FaChevronLeft size={10} /> Poprzednia
            </motion.button>

            <div className="flex items-center gap-2 px-4 py-2 glass rounded-2xl border-white/10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all touch-manipulation ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.7)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-6 py-3 glass rounded-2xl border-white/15 text-white font-black text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation shadow-lg"
            >
              Następna <FaChevronRight size={10} />
            </motion.button>
          </div>
        )}
      </>
      )}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={() => fetchPosts(searchQuery || undefined)}
        />
      )}
    </>
  );
}
