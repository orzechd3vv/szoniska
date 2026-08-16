'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbtack, FaPlus, FaTrash, FaEdit, FaHistory, FaCheckCircle, FaTimesCircle, FaPlusCircle } from 'react-icons/fa';

interface Update {
  id: string;
  version: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export default function UpdatesManagement() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [formData, setFormData] = useState({
    version: '',
    title: '',
    content: '',
    isPinned: false,
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await fetch('/api/updates');
      const data = await res.json();
      setUpdates(data);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingUpdate ? `/api/updates/${editingUpdate.id}` : '/api/updates';
      const method = editingUpdate ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingUpdate(null);
        setFormData({ version: '', title: '', content: '', isPinned: false });
        fetchUpdates();
      }
    } catch (error) {
      console.error('Error saving update:', error);
    }
  };

  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
    setFormData({
      version: update.version,
      title: update.title,
      content: update.content,
      isPinned: update.isPinned,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę aktualizację?')) return;

    try {
      const res = await fetch(`/api/updates/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchUpdates();
      }
    } catch (error) {
      console.error('Error deleting update:', error);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const res = await fetch(`/api/updates/${id}/pin`, {
        method: 'PATCH',
      });

      if (res.ok) {
        fetchUpdates();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Dziennik zmian</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
            Zarządzaj wersjami i aktualizacjami platformy
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowForm(!showForm);
            setEditingUpdate(null);
            setFormData({ version: '', title: '', content: '', isPinned: false });
          }}
          className={`btn-primary py-3 px-8 flex items-center gap-3 text-sm ${showForm ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : ''}`}
        >
          {showForm ? <><FaTimesCircle /> Anuluj</> : <><FaPlusCircle /> Nowa wersja</>}
        </motion.button>
      </div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-[2.5rem] p-8 border-white/5 bg-white/[0.02]">
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                {editingUpdate ? <><FaEdit className="text-primary-400" /> Edycja wersji</> : <><FaPlusCircle className="text-primary-400" /> Nowa aktualizacja</>}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Wersja</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="input-field w-full font-mono"
                      placeholder="v1.0.0"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Tytuł wydania</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field w-full"
                      placeholder="np. Cyberpunk Redesign..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Lista zmian (Markdown)</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input-field w-full min-h-[200px] resize-none"
                    placeholder="Opisz co zostało dodane, zmienione lub naprawione..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.isPinned}
                        onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-white/5 rounded-full border border-white/10 peer-checked:bg-amber-500/20 peer-checked:border-amber-500/50 transition-all" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-6 peer-checked:bg-amber-500 transition-all" />
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-amber-500 font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                      <FaThumbtack /> Przypnij jako priorytet
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="btn-primary py-2 px-10 text-xs"
                  >
                    {editingUpdate ? 'Zapisz zmiany' : 'Opublikuj aktualizację'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest w-24">Wersja</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Informacje</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest w-32">Data</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest w-48">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {updates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                    Nie opublikowano jeszcze żadnych aktualizacji
                  </td>
                </tr>
              ) : (
                updates.map((update) => (
                  <tr key={update.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-primary-400 font-black text-xs bg-primary-500/10 px-3 py-1 rounded-lg border border-primary-500/20">
                        {update.version}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-black text-sm">{update.title}</span>
                        {update.isPinned && (
                          <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <FaThumbtack /> Ważne
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-[10px] mt-1 truncate max-w-md font-medium">{update.content.substring(0, 80)}...</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        {new Date(update.createdAt).toLocaleDateString('pl-PL')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleTogglePin(update.id)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${
                            update.isPinned
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                              : 'glass border-white/5 text-gray-500 hover:text-amber-500'
                          }`}
                          title="Przypnij/Odepnij"
                        >
                          <FaThumbtack size={12} />
                        </button>
                        <button
                          onClick={() => handleEdit(update)}
                          className="w-9 h-9 glass flex items-center justify-center rounded-xl border-white/5 text-gray-500 hover:text-blue-400 transition-all"
                          title="Edytuj"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(update.id)}
                          className="w-9 h-9 glass flex items-center justify-center rounded-xl border-white/5 text-gray-500 hover:text-red-500 transition-all"
                          title="Usuń"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

