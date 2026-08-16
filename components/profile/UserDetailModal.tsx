'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBan, FaExclamationTriangle, FaLock, FaUnlock, FaTrash, FaEdit, FaEye, FaNewspaper, FaChevronRight, FaPlus, FaUserShield, FaHistory, FaShieldAlt, FaIdBadge, FaCamera } from 'react-icons/fa';
import EditPostModal from './EditPostModal';

interface User {
  id: string;
  name: string;
  email?: string;
  image?: string;
  isBlocked: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
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

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserDetailModal({ user, onClose, onUpdate }: UserDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [newWarning, setNewWarning] = useState('');
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showRestrictForm, setShowRestrictForm] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState(user.restrictionReason || '');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    email: user.email || '',
    password: '',
  });
  const [editMessage, setEditMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchWarnings();
    fetchPosts();
    return () => setMounted(false);
  }, []);

  const fetchWarnings = async () => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/warnings`);
      if (res.ok) {
        const data = await res.json();
        setWarnings(data);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleBlock = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block: !user.isBlocked }),
      });
      if (res.ok) {
        onUpdate();
        setShowConfirmBlock(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestrict = async () => {
    if (user.isRestricted) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${user.id}/restrict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restrict: false, reason: null }),
        });
        if (res.ok) {
          setShowRestrictForm(false);
          onUpdate();
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setShowRestrictForm(true);
    }
  };

  const handleRestrictWithReason = async () => {
    if (!restrictionReason.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/restrict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restrict: true, reason: restrictionReason }),
      });
      if (res.ok) {
        setShowRestrictForm(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarning = async () => {
    if (!newWarning.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/warn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newWarning }),
      });
      if (res.ok) {
        setNewWarning('');
        fetchWarnings();
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWarning = async (warningId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to ostrzeżenie?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/warnings/${warningId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchWarnings();
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e?: React.FormEvent, removeAvatar = false) => {
    e?.preventDefault();
    setLoading(true);
    setEditMessage(null);
    try {
      const dataToSend: any = {};
      if (removeAvatar) {
        dataToSend.removeAvatar = true;
      } else {
        if (editFormData.name !== user.name) dataToSend.name = editFormData.name;
        if (editFormData.email !== user.email) dataToSend.email = editFormData.email;
        if (editFormData.password) dataToSend.password = editFormData.password;
      }

      if (Object.keys(dataToSend).length === 0) {
        setEditMessage({ type: 'error', text: 'Brak zmian' });
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/users/${user.id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        setEditMessage({ type: 'success', text: removeAvatar ? 'Avatar usunięty' : 'Zapisano' });
        onUpdate();
        if (!removeAvatar) setTimeout(() => setShowEditForm(false), 1500);
      }
    } catch (error) {
      setEditMessage({ type: 'error', text: 'Błąd' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Backdrop */}
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
          className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#050505] border border-white/10 rounded-[3rem] flex flex-col overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-10 py-7 flex items-center justify-between border-b border-white/5 bg-black/50 shrink-0">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl relative group/avatar">
                {user.image ? (
                  <>
                    <img src={user.image} className="w-full h-full object-cover rounded-2xl border border-white/10" alt="" />
                    <button 
                      onClick={() => handleEditUser(undefined, true)}
                      className="absolute inset-0 bg-red-600/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center rounded-2xl transition-all"
                      title="Usuń Avatar"
                    >
                      <FaTrash className="text-white" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-black text-2xl rounded-2xl border border-white/10 uppercase">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#050505] ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">{user.name}</h2>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{user.email || 'Brak email'}</p>
                </div>
              </div>
            </div>
            
            {/* ID Badge Display */}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-1.5 flex items-center gap-2">
                <FaIdBadge className="text-primary-500" /> Account Identifier
              </span>
              <div className="px-5 py-2 glass rounded-xl border-white/5 font-mono text-[10px] text-primary-400 font-bold select-all cursor-pointer hover:bg-white/5 transition-colors">
                {user.id}
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-gray-500 hover:text-white transition-all hover:rotate-90 hover:scale-110 active:scale-95 border-white/10 ml-6"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <div className="max-w-5xl mx-auto space-y-12">
              
              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard icon={<FaNewspaper />} label="Publikacje" value={user._count.posts} color="text-blue-400" />
                <StatCard icon={<FaExclamationTriangle />} label="Ostrzeżenia" value={user._count.warnings} color="text-amber-400" />
                <StatCard icon={<FaHistory />} label="Wiek Konta" value={`${Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dni`} color="text-purple-400" />
                <StatCard icon={<FaUserShield />} label="Status" value={user.isBlocked ? 'BAN' : user.isRestricted ? 'LIM' : 'OK'} color={user.isBlocked ? 'text-red-500' : 'text-green-500'} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column - Actions & Info */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Danger Zone / Quick Actions */}
                  <div className="space-y-4">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] ml-2">Zarządzanie kontem</label>
                    <div className="grid grid-cols-1 gap-3">
                      <ActionButton 
                        icon={<FaEdit />} 
                        label="Zmień dane konta" 
                        onClick={() => setShowEditForm(!showEditForm)} 
                        active={showEditForm}
                      />
                      <ActionButton 
                        icon={user.isBlocked ? <FaUnlock /> : <FaBan />} 
                        label={user.isBlocked ? "Odblokuj Konta" : "Zablokuj Konto"} 
                        onClick={() => setShowConfirmBlock(true)}
                        danger={!user.isBlocked}
                        success={user.isBlocked}
                      />
                      <ActionButton 
                        icon={user.isRestricted ? <FaUnlock /> : <FaLock />} 
                        label={user.isRestricted ? "Usuń Ograniczenie" : "Ogranicz Posty"} 
                        onClick={handleRestrict}
                        warning={!user.isRestricted}
                      />
                      <ActionButton 
                        icon={<FaTrash />} 
                        label="Usuń Użytkownika" 
                        onClick={() => setShowConfirmDelete(true)} 
                        danger 
                      />
                    </div>
                  </div>

                  {/* ID Info Mobile Only */}
                  <div className="md:hidden p-6 glass rounded-3xl border-white/5 space-y-3">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Account Identifier</p>
                    <code className="text-[10px] text-gray-400 font-mono break-all bg-black/40 p-3 rounded-xl block">{user.id}</code>
                  </div>
                </div>

                {/* Right Column - Warnings & Posts Management */}
                <div className="lg:col-span-8 space-y-12">
                  
                  {/* Edit Form (High-End Design) */}
                  <AnimatePresence>
                    {showEditForm && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="p-10 glass rounded-[3rem] border-primary-500/20 bg-primary-500/5 space-y-8 mb-10">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500">
                                <FaEdit size={18} />
                              </div>
                              Modyfikacja Danych
                            </h3>
                            {editMessage && (
                              <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${editMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {editMessage.text}
                              </motion.span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-4">Nazwa Użytkownika</label>
                              <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all" placeholder="Nazwa..." />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-4">Adres E-mail</label>
                              <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all" placeholder="Email..." />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-4">Nowe Hasło (Zostaw puste aby nie zmieniać)</label>
                            <input type="password" value={editFormData.password} onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all" placeholder="Hasło..." />
                          </div>

                          <div className="flex gap-4 pt-4">
                            <button onClick={handleEditUser} className="flex-1 py-4 bg-primary-600 hover:bg-primary-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all shadow-lg shadow-primary-950/20">Zapisz Zmiany</button>
                            <button onClick={() => setShowEditForm(false)} className="px-8 py-4 glass text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all border-white/10">Anuluj</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Restriction Form (Conditional) */}
                  <AnimatePresence>
                    {showRestrictForm && !user.isRestricted && (
                      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-10 glass rounded-[3rem] border-amber-500/20 bg-amber-500/5 space-y-8 mb-10">
                        <h3 className="text-xl font-black text-amber-500 uppercase tracking-tighter italic flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <FaLock size={18} />
                          </div>
                          Blokada Publikowania
                        </h3>
                        <textarea 
                          value={restrictionReason} 
                          onChange={(e) => setRestrictionReason(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] p-7 text-sm text-white focus:outline-none focus:border-amber-500/50 min-h-[150px]"
                          placeholder="Podaj powód ograniczenia widoczny dla moderatora..."
                        />
                        <div className="flex gap-4">
                          <button onClick={handleRestrictWithReason} className="px-10 py-4 bg-amber-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl">Nałóż Limity</button>
                          <button onClick={() => setShowRestrictForm(false)} className="btn-glass-small">Anuluj</button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Warnings Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-4">
                        <FaExclamationTriangle className="text-amber-500" /> Kartoteka Ostrzeżeń
                      </h3>
                    </div>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={newWarning} 
                        onChange={(e) => setNewWarning(e.target.value)}
                        placeholder="Treść nowego ostrzeżenia..."
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-6 py-5 text-xs text-white focus:outline-none focus:border-primary-500/50"
                      />
                      <button onClick={handleAddWarning} className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-widest border border-white/10">
                        Dodaj
                      </button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                      {warnings.map((w) => (
                        <div key={w.id} className="p-6 glass rounded-[2rem] border-white/5 flex items-center justify-between group bg-white/[0.01]">
                          <div>
                            <p className="text-gray-300 text-xs font-medium leading-relaxed">{w.message}</p>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-2 italic">{new Date(w.createdAt).toLocaleString('pl-PL')}</p>
                          </div>
                          <button onClick={() => handleDeleteWarning(w.id)} className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all border border-red-500/10">
                            <FaTrash size={16} />
                          </button>
                        </div>
                      ))}
                      {warnings.length === 0 && <p className="text-center py-10 text-[10px] text-gray-600 font-black uppercase tracking-widest italic opacity-50">Konto bez uwag</p>}
                    </div>
                  </div>

                  {/* User Posts Section */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-4">
                      <FaNewspaper className="text-blue-500" /> Opublikowane Treści ({posts.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {posts.map((post) => (
                        <div key={post.id} className="p-6 glass rounded-[2.5rem] border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex items-center gap-8 group">
                          <div className="w-20 h-20 rounded-2xl bg-black overflow-hidden shrink-0 border border-white/5">
                            {post.images?.[0] ? <img src={post.images[0]} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/[0.02]"><FaNewspaper /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-black text-sm uppercase tracking-tight truncate leading-none mb-2">{post.title}</h4>
                            <div className="flex items-center gap-4">
                              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${post.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {post.status}
                              </span>
                            </div>
                          </div>
                          <button onClick={() => window.open(`/posts/${post.id}`, '_blank')} className="w-12 h-12 rounded-2xl flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-all border border-blue-400/10">
                            <FaEye size={18} />
                          </button>
                        </div>
                      ))}
                      {posts.length === 0 && <p className="text-center py-10 text-[10px] text-gray-600 font-black uppercase tracking-widest">Brak aktywności</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer / Confirmations */}
          <div className="px-10 py-7 border-t border-white/5 bg-black/60 shrink-0">
            <AnimatePresence mode="wait">
              {showConfirmBlock ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex items-center justify-between">
                  <p className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-4">
                    <FaExclamationTriangle className="text-red-500" /> Potwierdź {user.isBlocked ? 'ODBLOKOWANIE' : 'BLOKADĘ'} konta?
                  </p>
                  <div className="flex gap-4">
                    <button onClick={handleBlock} className="px-10 py-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-950/20">TAK, WYKONAJ</button>
                    <button onClick={() => setShowConfirmBlock(false)} className="btn-glass-small border-white/10">ANULUJ</button>
                  </div>
                </motion.div>
              ) : showConfirmDelete ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex items-center justify-between">
                  <p className="text-sm font-black text-red-600 uppercase tracking-widest flex items-center gap-4">
                    <FaTrash className="text-red-600" /> CZY NA PEWNO USUNĄĆ CAŁE KONTO? (NIEODWRACALNE)
                  </p>
                  <div className="flex gap-4">
                    <button onClick={handleDeleteUser} className="px-10 py-3 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-950/20">USUŃ BEZPOWROTNIE</button>
                    <button onClick={() => setShowConfirmDelete(false)} className="btn-glass-small border-white/10">ANULUJ</button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  <div className="flex items-center gap-8">
                    <span className="flex items-center gap-3"><FaShieldAlt className="text-primary-500" /> ADM_AUTH_VERIFIED</span>
                    <span className="flex items-center gap-3 italic"><FaHistory className="opacity-50" /> OSTATNIA SESJA: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 text-primary-400">
                    <span className="opacity-50">INTERNAL_UID:</span> {user.id.slice(0, 16)}...
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="p-8 glass rounded-[2.5rem] border-white/5 bg-white/[0.02] flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none mb-2">{label}</p>
        <p className="text-2xl font-black text-white leading-none tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, active, danger, success, warning }: any) {
  const getColors = () => {
    if (active) return 'bg-primary-500 text-white border-primary-500/50 shadow-lg shadow-primary-950/20';
    if (danger) return 'text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50';
    if (success) return 'text-green-500 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/50';
    if (warning) return 'text-amber-500 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/50';
    return 'text-gray-400 border-white/5 hover:bg-white/5 hover:border-white/20';
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full py-5 px-7 rounded-[2rem] border flex items-center justify-between group transition-all duration-300 ${getColors()}`}
    >
      <div className="flex items-center gap-5">
        <span className="group-hover:scale-110 group-hover:rotate-6 transition-transform">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <FaChevronRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </button>
  );
}
