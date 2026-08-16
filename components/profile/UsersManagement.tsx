'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBan, FaExclamationTriangle, FaEye, FaLock, FaUnlock, FaTimes, FaEdit, FaTrash, FaNewspaper, FaSearch, FaUserShield, FaHistory, FaChevronRight, FaPlus, FaMinus, FaCheck, FaClock } from 'react-icons/fa';
import EditPostModal from './EditPostModal';

interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  isBlocked: boolean;
  isRestricted: boolean;
  createdAt: string;
  _count: {
    posts: number;
    warnings: number;
  };
}

interface Warning {
  id: string;
  message: string;
  createdAt: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [viewWarningsUser, setViewWarningsUser] = useState<User | null>(null);
  const [userWarnings, setUserWarnings] = useState<Warning[]>([]);
  const [editingWarning, setEditingWarning] = useState<Warning | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [deletingWarning, setDeletingWarning] = useState<Warning | null>(null);
  const [viewPostsUser, setViewPostsUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [previewPost, setPreviewPost] = useState<any>(null);
  const [deletingPost, setDeletingPost] = useState<any>(null);
  const [warningPost, setWarningPost] = useState<any>(null);
  const [postWarningMessage, setPostWarningMessage] = useState('');
  const [viewPostWarnings, setViewPostWarnings] = useState<any>(null);
  const [editingPostWarning, setEditingPostWarning] = useState<any>(null);
  const [editPostWarningMessage, setEditPostWarningMessage] = useState('');
  const [deletingPostWarning, setDeletingPostWarning] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRestrictUser = async (userId: string, restrict: boolean) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/restrict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restrict }),
      });

      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error restricting user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleWarnUser = async (userId: string) => {
    if (!warningMessage.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: warningMessage }),
      });

      if (res.ok) {
        setWarningMessage('');
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error warning user:', error);
    } finally {
      setProcessing(false);
    }
  };

  const fetchUserWarnings = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/warnings`);
      if (res.ok) {
        const data = await res.json();
        setUserWarnings(data);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    }
  };

  const handleViewWarnings = async (user: User) => {
    setViewWarningsUser(user);
    await fetchUserWarnings(user.id);
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/posts`);
      if (res.ok) {
        const data = await res.json();
        setUserPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleViewPosts = async (user: User) => {
    setViewPostsUser(user);
    await fetchUserPosts(user.id);
  };

  const handleEditWarning = (warning: Warning) => {
    setEditingWarning(warning);
    setEditMessage(warning.message);
  };

  const handleUpdateWarning = async () => {
    if (!editingWarning || !editMessage.trim()) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/warnings/${editingWarning.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editMessage }),
      });

      if (res.ok) {
        setEditingWarning(null);
        setEditMessage('');
        if (viewWarningsUser) {
          await fetchUserWarnings(viewWarningsUser.id);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteWarning = async (warningId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/warnings/${warningId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingWarning(null);
        if (viewWarningsUser) {
          await fetchUserWarnings(viewWarningsUser.id);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingPost(null);
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleWarnPost = async (postId: string) => {
    if (!postWarningMessage.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: postWarningMessage }),
      });

      if (res.ok) {
        setWarningPost(null);
        setPostWarningMessage('');
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
      }
    } catch (error) {
      console.error('Error warning post:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditPostWarning = async (postId: string, warningId: string) => {
    if (!editPostWarningMessage.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warnings/${warningId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editPostWarningMessage }),
      });

      if (res.ok) {
        setEditingPostWarning(null);
        setEditPostWarningMessage('');
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
      }
    } catch (error) {
      console.error('Error editing post warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePostWarning = async (postId: string, warningId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/warnings/${warningId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingPostWarning(null);
        setViewPostWarnings(null);
        if (viewPostsUser) {
          await fetchUserPosts(viewPostsUser.id);
        }
      }
    } catch (error) {
      console.error('Error deleting post warning:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/delete`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeletingUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Nie można usunąć użytkownika');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Wystąpił błąd podczas usuwania użytkownika');
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
          className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
        />
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.id.toLowerCase().includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="space-y-12">
      {/* Search and Filter Section */}
      <section className="glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="flex-1 w-full space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Ewidencja Obywateli</h2>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors">
                <FaSearch size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Identyfikator, nazwa lub kontakt..."
                className="w-full glass-dark bg-black/40 border-2 border-white/5 focus:border-primary-500/50 rounded-[2rem] py-6 pl-16 pr-10 text-sm font-bold text-white placeholder:text-gray-600 focus:outline-none transition-all shadow-inner uppercase tracking-wider"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 glass rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-primary-500/5 border border-primary-500/20 rounded-[2.5rem] py-8 px-10 text-center min-w-[200px]">
            <span className="block text-[40px] font-black text-primary-400 leading-none tracking-tighter italic">{filteredUsers.length}</span>
            <span className="block text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Aktywnych Profilów</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <FaUserShield size={120} />
        </div>
      </section>

      {/* User Grid */}
      <div className="grid grid-cols-1 gap-8">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass rounded-[3.5rem] p-10 border-white/5 transition-all duration-500 group relative overflow-hidden ${
              user.isBlocked ? 'border-red-500/30' : user.isRestricted ? 'border-amber-500/30' : 'hover:border-primary-500/30'
            }`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">
              <div className="flex items-start gap-8 flex-1">
                <div className="relative shrink-0 group/avatar">
                  <div className={`absolute -inset-2 rounded-[2.5rem] blur opacity-20 transition duration-500 ${user.isBlocked ? 'bg-red-500' : 'bg-primary-500'}`} />
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-24 h-24 rounded-[2rem] object-cover border-2 border-white/10 relative z-10 shadow-2xl" />
                  ) : (
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-black text-4xl relative z-10 shadow-2xl italic">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{user.name}</h3>
                    {user.isBlocked && (
                      <span className="px-4 py-1.5 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                        Restrykcja Całkowita
                      </span>
                    )}
                    {user.isRestricted && (
                      <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-amber-500/20">
                        Ograniczony Dostęp
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                    {[
                      { label: 'Identyfikator', value: user.id },
                      { label: 'System Poczty', value: user.email || 'Brak danych' },
                      { label: 'Data Rejestracji', value: new Date(user.createdAt).toLocaleDateString('pl-PL') }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <span className="block text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">{item.label}</span>
                        <span className="block text-[11px] text-gray-400 font-bold tracking-wider truncate uppercase">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <div className="glass-dark px-6 py-4 rounded-3xl border-white/5 flex items-center gap-4 group/stat transition-colors hover:border-blue-500/30">
                      <FaNewspaper className="text-blue-400 group-hover/stat:scale-110 transition-transform" />
                      <div>
                        <span className="block text-white font-black text-lg leading-none">{user._count.posts}</span>
                        <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest">Szonów</span>
                      </div>
                    </div>
                    <div className="glass-dark px-6 py-4 rounded-3xl border-white/5 flex items-center gap-4 group/stat transition-colors hover:border-amber-500/30">
                      <FaExclamationTriangle className="text-amber-400 group-hover/stat:scale-110 transition-transform" />
                      <div>
                        <span className="block text-white font-black text-lg leading-none">{user._count.warnings}</span>
                        <span className="block text-[8px] text-gray-600 font-black uppercase tracking-widest">Ostrzeżeń</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                  <button onClick={() => handleViewPosts(user)} className="btn-action bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20" title="Archiwum postów">
                    <FaNewspaper /> <span className="lg:hidden text-[9px] font-black uppercase ml-2">Posty</span>
                  </button>
                  <button onClick={() => handleViewWarnings(user)} className="btn-action bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20" title="Historia naruszeń">
                    <FaHistory /> <span className="lg:hidden text-[9px] font-black uppercase ml-2">Historia</span>
                  </button>
                  <button onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)} className="btn-action bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20" title="Nadaj ostrzeżenie">
                    <FaExclamationTriangle /> <span className="lg:hidden text-[9px] font-black uppercase ml-2">Warn</span>
                  </button>
                  <button onClick={() => handleRestrictUser(user.id, !user.isRestricted)} className={`btn-action ${user.isRestricted ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`} title={user.isRestricted ? 'Przywróć uprawnienia' : 'Ogranicz aktywność'}>
                    {user.isRestricted ? <FaUnlock /> : <FaLock />} <span className="lg:hidden text-[9px] font-black uppercase ml-2">{user.isRestricted ? 'Odblokuj' : 'Blokuj'}</span>
                  </button>
                  <button onClick={() => handleBlockUser(user.id, !user.isBlocked)} className={`btn-action ${user.isBlocked ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`} title={user.isBlocked ? 'Zdmij blokadę konta' : 'Zablokuj definitywnie'}>
                    <FaBan /> <span className="lg:hidden text-[9px] font-black uppercase ml-2">{user.isBlocked ? 'Unban' : 'Ban'}</span>
                  </button>
                  <button onClick={() => setDeletingUser(user)} className="btn-action bg-red-900/20 text-red-500 hover:bg-red-900/40 border-red-500/20" title="Usuń z bazy">
                    <FaTrash /> <span className="lg:hidden text-[9px] font-black uppercase ml-2">Delete</span>
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {selectedUser?.id === user.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden border-t border-white/5 pt-10"
                >
                  <div className="glass-dark rounded-[2.5rem] p-10 border-amber-500/20 bg-amber-500/5 relative">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                      <div className="flex-1 w-full space-y-3">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2 italic">Protokół Naruszenia Regulaminu</label>
                        <textarea
                          value={warningMessage}
                          onChange={(e) => setWarningMessage(e.target.value)}
                          placeholder="Opisz powód nałożenia ostrzeżenia..."
                          className="input-field w-full text-xs min-h-[120px] py-6 px-8 leading-relaxed uppercase tracking-widest shadow-inner"
                        />
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                        <button
                          onClick={() => handleWarnUser(user.id)}
                          disabled={processing || !warningMessage.trim()}
                          className="btn-primary flex-1 py-5 px-10 bg-amber-600 hover:bg-amber-500 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 shadow-2xl shadow-amber-500/20"
                        >
                          Emituj Ostrzeżenie
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(null);
                            setWarningMessage('');
                          }}
                          className="glass py-5 px-10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white"
                        >
                          Poniechaj
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <style jsx global>{`
        .btn-action {
          @apply w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center transition-all border active:scale-90 shadow-xl;
        }
        .btn-action:hover {
          @apply -translate-y-1;
        }
      `}</style>
    </div>

      {/* Modal ostrzeżeń użytkownika */}
      <AnimatePresence>
        {viewWarningsUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => {
                setViewWarningsUser(null);
                setUserWarnings([]);
                setEditingWarning(null);
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="glass rounded-[3.5rem] p-12 max-w-4xl w-full max-h-[85vh] overflow-y-auto border-white/10 relative z-10 shadow-[0_0_150px_rgba(var(--primary-rgb),0.1)] scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner border border-purple-500/20">
                    <FaHistory size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Archiwum Naruszeń</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Dossier: <span className="text-white">{viewWarningsUser?.name}</span></p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setViewWarningsUser(null);
                    setUserWarnings([]);
                    setEditingWarning(null);
                  }} 
                  className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-xl"
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>

              {userWarnings.length === 0 ? (
                <div className="text-center py-20 glass-dark rounded-[3rem] border-dashed border-white/5">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto mb-6">
                    <FaCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest italic mb-2">Brak wpisów w kartotece</h3>
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Obywatel nie posiada aktywnych ostrzeżeń systemowych</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {userWarnings.map((warning, idx) => (
                    <motion.div
                      key={warning.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-dark border border-amber-500/10 rounded-[2.5rem] p-8 group relative overflow-hidden"
                    >
                      {editingWarning?.id === warning.id ? (
                        <div className="space-y-6">
                          <textarea
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            className="input-field w-full py-6 px-8 text-xs min-h-[120px] resize-none uppercase tracking-widest leading-relaxed"
                          />
                          <div className="flex gap-4">
                            <button
                              onClick={handleUpdateWarning}
                              disabled={processing || !editMessage.trim()}
                              className="btn-primary py-4 px-10 text-[10px] font-black uppercase tracking-widest"
                            >
                              Zatwierdź Korektę
                            </button>
                            <button
                              onClick={() => {
                                setEditingWarning(null);
                                setEditMessage('');
                              }}
                              className="glass py-4 px-10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white"
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-[10px] text-amber-500 font-black uppercase tracking-[0.3em]">Sygnatura Ostrzeżenia</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                            </div>
                            <p className="text-gray-300 text-sm font-bold leading-relaxed uppercase tracking-widest">{warning.message}</p>
                            <div className="mt-6 flex items-center gap-4 text-[9px] text-gray-600 font-black uppercase tracking-widest">
                              <FaClock className="text-primary-500" /> {new Date(warning.createdAt).toLocaleString('pl-PL')}
                            </div>
                          </div>
                          <div className="flex gap-3 shrink-0">
                            <button onClick={() => handleEditWarning(warning)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-blue-400 hover:bg-blue-500/10 transition-all border-white/5" title="Edytuj wpis">
                              <FaEdit size={18} />
                            </button>
                            <button onClick={() => setDeletingWarning(warning)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all border-white/5" title="Usuń z historii">
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform">
                        <FaExclamationTriangle size={60} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal potwierdzenia usunięcia ostrzeżenia */}
      <AnimatePresence>
        {deletingWarning && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setDeletingWarning(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass rounded-[3rem] p-10 max-w-lg w-full border-red-500/20 bg-red-900/5 relative z-10 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8 shadow-inner border border-red-500/20">
                <FaTrash size={32} />
              </div>
              
              <h3 className="text-3xl font-black text-white text-center uppercase tracking-tighter italic mb-4">Usuń Ostrzeżenie</h3>
              <p className="text-center text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-10 leading-relaxed">
                Potwierdź usunięcie wpisu z bazy danych. Ta operacja jest definitywna i nieodwracalna.
              </p>

              <div className="glass-dark rounded-2xl p-6 mb-10 border-white/5">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-3 italic">Treść naruszenia:</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">"{deletingWarning.message}"</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleDeleteWarning(deletingWarning.id)}
                  disabled={processing}
                  className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50"
                >
                  Usuń Wpis
                </button>
                <button
                  onClick={() => setDeletingWarning(null)}
                  className="flex-1 py-5 glass text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95"
                >
                  Poniechaj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal podglądu postów użytkownika */}
      <AnimatePresence>
        {viewPostsUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => {
                setViewPostsUser(null);
                setUserPosts([]);
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="glass rounded-[3.5rem] p-12 max-w-5xl w-full max-h-[90vh] overflow-y-auto border-white/10 relative z-10 shadow-2xl scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner border border-blue-500/20">
                    <FaNewspaper size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Archiwum Publikacji</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Autor: <span className="text-white">{viewPostsUser?.name}</span></p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setViewPostsUser(null);
                    setUserPosts([]);
                  }} 
                  className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-xl"
                >
                  <FaTimes size={24} />
                </motion.button>
              </div>

              {userPosts.length === 0 ? (
                <div className="text-center py-24 glass-dark rounded-[3rem] border-dashed border-white/5">
                  <FaNewspaper size={64} className="mx-auto text-gray-800 mb-6 opacity-20" />
                  <h3 className="text-xl font-black text-white uppercase tracking-widest italic mb-2">Brak aktywności</h3>
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Obywatel nie posiada jeszcze żadnych postów w systemie</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {userPosts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`glass-dark rounded-[3rem] p-8 border group transition-all duration-500 hover:border-primary-500/30 ${
                        post.status === 'APPROVED' ? 'border-green-500/10' : post.status === 'REJECTED' ? 'border-red-500/10' : 'border-amber-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="space-y-3">
                          <h3 className="text-xl font-black text-white uppercase tracking-tight italic group-hover:text-primary-400 transition-colors">{post.title}</h3>
                          <div className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                            post.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                            post.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {post.status === 'APPROVED' ? 'Status: Aktywny' : post.status === 'REJECTED' ? 'Status: Odrzucony' : 'Status: Weryfikacja'}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString('pl-PL')}</span>
                      </div>

                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-3 mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                        {post.description}
                      </p>

                      {post.images && post.images.length > 0 && (
                        <div className="flex gap-3 mb-8">
                          {post.images.slice(0, 3).map((img: string, i: number) => (
                            <img key={i} src={img} className="w-16 h-12 object-cover rounded-xl border border-white/10 shadow-lg" />
                          ))}
                          {post.images.length > 3 && (
                            <div className="w-16 h-12 glass rounded-xl flex items-center justify-center text-[10px] font-black text-gray-500">+{post.images.length - 3}</div>
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
                        <button onClick={() => setPreviewPost(post)} className="glass py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all border-white/5">
                          <FaEye size={12} /> Podgląd
                        </button>
                        <button onClick={() => setEditingPost(post)} className="glass py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-500/10 transition-all border-white/5">
                          <FaEdit size={12} /> Edycja
                        </button>
                        <button onClick={() => setWarningPost(post)} className="glass py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-400 hover:bg-amber-500/10 transition-all border-white/5">
                          <FaExclamationTriangle size={12} /> Ostrzeż
                        </button>
                        <button onClick={() => setDeletingPost(post)} className="glass py-4 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all border-white/5">
                          <FaTrash size={12} /> Usuń
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal podglądu posta */}
      <AnimatePresence>
        {previewPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
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
              className="glass rounded-[4rem] p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-white/10 relative z-10 shadow-[0_0_200px_rgba(0,0,0,0.5)] scrollbar-hide"
            >
               <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                    <FaEye size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Wgląd w Archiwum</h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Pełna ekspozycja danych publikacji</p>
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

              <div className="glass-dark rounded-[3.5rem] overflow-hidden border-white/5 shadow-2xl">
                {previewPost.images && previewPost.images.length > 0 && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img src={previewPost.images[0]} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                       <h3 className="text-5xl font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-2xl">{previewPost.title}</h3>
                    </div>
                  </div>
                )}
                
                <div className="p-12 space-y-10">
                  <div className="flex items-center gap-4 p-6 glass rounded-3xl border-white/5 bg-white/5">
                    {previewPost.user?.image ? (
                      <img src={previewPost.user.image} className="w-14 h-14 rounded-2xl border-2 border-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-2xl italic">{previewPost.user?.name?.charAt(0) || 'U'}</div>
                    )}
                    <div>
                      <p className="text-white font-black text-lg uppercase tracking-tight">{previewPost.user?.name || 'Autor Nieznany'}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{new Date(previewPost.createdAt).toLocaleDateString('pl-PL')}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg font-medium leading-relaxed whitespace-pre-wrap uppercase tracking-wider">{previewPost.description}</p>
                  
                  {previewPost.images && previewPost.images.length > 1 && (
                    <div className="grid grid-cols-2 gap-6">
                      {previewPost.images.slice(1).map((img: string, i: number) => (
                        <img key={i} src={img} className="w-full aspect-[4/3] object-cover rounded-[2.5rem] border border-white/5 shadow-xl" />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5">
                    {[
                      { url: previewPost.facebookUrl, label: 'Meta', color: 'bg-blue-500' },
                      { url: previewPost.instagramUrl, label: 'Insta', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600' },
                      { url: previewPost.tiktokUrl, label: 'TikTok', color: 'bg-black border-white/10' }
                    ].filter(s => s.url).map((s, i) => (
                      <span key={i} className="px-8 py-3 glass rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${s.color}`} /> {s.label} Link
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal ostrzeżenia dla posta */}
      <AnimatePresence>
        {warningPost && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => {
                setWarningPost(null);
                setPostWarningMessage('');
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass rounded-[3.5rem] p-12 max-w-xl w-full border-amber-500/20 bg-amber-900/5 relative z-10 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-10 shadow-inner border border-amber-500/20">
                <FaExclamationTriangle size={32} />
              </div>
              
              <h3 className="text-3xl font-black text-white text-center uppercase tracking-tighter italic mb-10 leading-none">Ostrzeżenie Publikacji</h3>
              
              <div className="space-y-6">
                <div className="glass-dark rounded-3xl p-8 border-white/5">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3">Tytuł publikacji:</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{warningPost.title}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-2">Uzasadnienie Moderacyjne</label>
                  <textarea
                    value={postWarningMessage}
                    onChange={(e) => setPostWarningMessage(e.target.value)}
                    placeholder="Wprowadź powód sankcji dla tego postu..."
                    className="input-field w-full py-6 px-8 text-xs min-h-[140px] resize-none uppercase tracking-widest leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button
                  onClick={() => handleWarnPost(warningPost.id)}
                  disabled={processing || !postWarningMessage.trim()}
                  className="flex-1 py-5 bg-amber-600 hover:bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-amber-900/20 disabled:opacity-50 active:scale-95"
                >
                  Nadaj Warn
                </button>
                <button
                  onClick={() => {
                    setWarningPost(null);
                    setPostWarningMessage('');
                  }}
                  className="flex-1 py-5 glass text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95"
                >
                  Poniechaj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal usuwania posta */}
      <AnimatePresence>
        {deletingPost && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setDeletingPost(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass rounded-[3.5rem] p-12 max-w-xl w-full border-red-500/20 bg-red-900/5 relative z-10 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-10 shadow-inner border border-red-500/20">
                <FaTrash size={32} />
              </div>
              
              <h3 className="text-3xl font-black text-white text-center uppercase tracking-tighter italic mb-10 leading-none">Eliminacja Publikacji</h3>
              
              <div className="glass-dark rounded-3xl p-8 border-white/5 mb-10">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-3">Post do usunięcia:</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{deletingPost.title}</p>
              </div>

              <p className="text-center text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-12 leading-relaxed">
                UWAGA: Wszystkie asocjacje, media i dane powiązane z tym szonem zostaną permanentnie usunięte z rejestru.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleDeletePost(deletingPost.id)}
                  disabled={processing}
                  className="flex-1 py-6 bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95 disabled:opacity-50"
                >
                  Potwierdź Kasację
                </button>
                <button
                  onClick={() => setDeletingPost(null)}
                  className="flex-1 py-6 glass text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95"
                >
                  Anuluj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal podglądu ostrzeżeń posta */}
      <AnimatePresence>
        {viewPostWarnings && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setViewPostWarnings(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="glass rounded-[3.5rem] p-12 max-w-2xl w-full max-h-[80vh] overflow-y-auto border-amber-500/20 relative z-10 shadow-2xl scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <FaExclamationTriangle size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Sankcje Publikacji</h2>
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-2">Przegląd naruszeń dla postu</p>
                  </div>
                </div>
                <button onClick={() => setViewPostWarnings(null)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all shadow-xl">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {viewPostWarnings.warnings.map((warning: any, idx: number) => (
                  <motion.div
                    key={warning.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-dark border border-amber-500/10 rounded-[2.5rem] p-8 group"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{new Date(warning.createdAt).toLocaleString('pl-PL')}</span>
                          <span className="w-1 h-1 rounded-full bg-amber-500" />
                        </div>
                        <p className="text-amber-200 text-sm font-bold uppercase tracking-widest leading-relaxed">{warning.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPostWarning(warning); setEditPostWarningMessage(warning.message); }} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-blue-400 hover:bg-blue-500/10 border-white/5 transition-all">
                          <FaEdit size={14} />
                        </button>
                        <button onClick={() => setDeletingPostWarning(warning)} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 border-white/5 transition-all">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingPostWarning && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => { setEditingPostWarning(null); setEditPostWarningMessage(''); }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass rounded-[3rem] p-10 max-w-md w-full border-blue-500/20 bg-blue-900/5 relative z-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8 text-center leading-none">Edycja Sankcji</h3>
              <textarea
                value={editPostWarningMessage}
                onChange={(e) => setEditPostWarningMessage(e.target.value)}
                className="input-field w-full py-6 px-8 text-xs min-h-[160px] resize-none uppercase tracking-widest leading-relaxed shadow-inner"
              />
              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => handleEditPostWarning(viewPostWarnings.id, editingPostWarning.id)}
                  disabled={processing || !editPostWarningMessage.trim()}
                  className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 active:scale-95"
                >
                  Zapisz Korektę
                </button>
                <button
                  onClick={() => { setEditingPostWarning(null); setEditPostWarningMessage(''); }}
                  className="flex-1 py-5 glass text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95"
                >
                  Poniechaj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingPostWarning && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setDeletingPostWarning(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass rounded-[3rem] p-10 max-w-md w-full border-red-500/20 bg-red-900/5 relative z-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                <FaTrash size={24} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-4 leading-none">Kasacja Sankcji</h3>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-10 leading-relaxed px-4">
                Potwierdź usunięcie sankcji z rejestru publikacji. Operacja jest nieodwracalna.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDeletePostWarning(viewPostWarnings.id, deletingPostWarning.id)}
                  disabled={processing}
                  className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95"
                >
                  Usuń Wpis
                </button>
                <button
                  onClick={() => setDeletingPostWarning(null)}
                  className="flex-1 py-5 glass text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all active:scale-95"
                >
                  Anuluj
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal edycji posta */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={() => {
            setEditingPost(null);
            if (viewPostsUser) {
              fetchUserPosts(viewPostsUser.id);
            }
          }}
        />
      )}

      {/* Modal potwierdzenia usunięcia użytkownika */}
      <AnimatePresence>
        {deletingUser && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
              onClick={() => setDeletingUser(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="glass rounded-[4rem] p-14 max-w-2xl w-full border-red-500/30 bg-red-950/20 relative z-10 shadow-[0_0_150px_rgba(220,38,38,0.2)] text-center"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-10 shadow-2xl border border-red-500/30 animate-pulse">
                <FaBan size={40} />
              </div>
              
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-6 leading-none">Terminacja Profilu</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-12 leading-relaxed">
                Inicjujesz procedurę usuwania konta użytkownika: <span className="text-red-500">{deletingUser.name}</span>. 
                Wszystkie szony, dane i uprawnienia zostaną bezpowrotnie usunięte z platformy Szoniska.
              </p>

              <div className="flex gap-6">
                <button
                  onClick={() => handleDeleteUser(deletingUser.id)}
                  disabled={processing}
                  className="flex-1 py-6 bg-red-600 hover:bg-red-700 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-2xl shadow-red-900/40 active:scale-95 disabled:opacity-50"
                >
                  DESTRUKCJA PROFILU
                </button>
                <button
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 py-6 glass text-gray-500 hover:text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all active:scale-95"
                >
                  ANULUJ OPERACJĘ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
