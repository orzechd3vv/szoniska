'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTools, FaPlus, FaTrash, FaClock, FaCheckCircle, FaBullhorn, FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckSquare, FaChevronDown, FaCalendarAlt } from 'react-icons/fa';

interface Maintenance {
  id: string;
  type: string;
  reason: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}

interface Announcement {
  id: string;
  message: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

export default function TechnicalManagement() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'profile',
    reason: '',
    hours: 1,
  });
  const [announcementData, setAnnouncementData] = useState({
    message: '',
    type: 'info',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchMaintenances();
    fetchAnnouncement();
    const interval = setInterval(fetchMaintenances, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMaintenances = async () => {
    try {
      const res = await fetch('/api/admin/maintenance');
      if (res.ok) {
        const data = await res.json();
        setMaintenances(data);
      }
    } catch (error) {
      console.error('Error fetching maintenances:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncement = async () => {
    try {
      const res = await fetch('/api/admin/announcement');
      if (res.ok) {
        const data = await res.json();
        setAnnouncement(data);
      }
    } catch (error) {
      console.error('Error fetching announcement:', error);
    }
  };

  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason.trim()) return;

    setProcessing(true);
    try {
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + formData.hours);

      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          reason: formData.reason,
          endTime: endTime.toISOString(),
        }),
      });

      if (res.ok) {
        setFormData({ type: 'profile', reason: '', hours: 1 });
        setShowAddForm(false);
        fetchMaintenances();
      }
    } catch (error) {
      console.error('Error adding maintenance:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteMaintenance = async (id: string) => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/maintenance/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchMaintenances();
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementData.message.trim()) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData),
      });

      if (res.ok) {
        setAnnouncementData({ message: '', type: 'info' });
        setShowAnnouncementForm(false);
        fetchAnnouncement();
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'DELETE',
      });

      if (res.ok) {
        setAnnouncement(null);
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Wygasło';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getAnnouncementConfig = (type: string) => {
    const configs = {
      info: { styles: 'bg-blue-500/10 border-blue-500/20 text-blue-400', icon: FaInfoCircle },
      warning: { styles: 'bg-amber-500/10 border-amber-500/20 text-amber-400', icon: FaExclamationTriangle },
      error: { styles: 'bg-red-500/10 border-red-500/20 text-red-400', icon: FaExclamationCircle },
      success: { styles: 'bg-green-500/10 border-green-500/20 text-green-400', icon: FaCheckSquare },
    };
    return (configs as any)[type] || configs.info;
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
    <div className="space-y-12">
      {/* Announcement Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
              <FaBullhorn size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">System ogłoszeń</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Komunikaty dla wszystkich</p>
            </div>
          </div>
          {!announcement && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="btn-primary py-3 px-6 flex items-center gap-2 text-sm"
            >
              <FaPlus /> Dodaj ogłoszenie
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showAnnouncementForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-[2rem] p-8 border-white/5 mb-8"
            >
              <form onSubmit={handleAddAnnouncement} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Typ komunikatu</label>
                    <select
                      value={announcementData.type}
                      onChange={(e) => setAnnouncementData({ ...announcementData, type: e.target.value })}
                      className="input-field w-full appearance-none cursor-pointer"
                    >
                      <option value="info">Informacyjny</option>
                      <option value="warning">Ostrzeżenie</option>
                      <option value="error">Błąd systemowy</option>
                      <option value="success">Sukces</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Treść ogłoszenia</label>
                    <input
                      type="text"
                      value={announcementData.message}
                      onChange={(e) => setAnnouncementData({ ...announcementData, message: e.target.value })}
                      placeholder="np. Przerwa techniczna o 22:00..."
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAnnouncementForm(false)} className="px-6 py-2 text-gray-500 font-bold hover:text-white transition-colors">Anuluj</button>
                  <button type="submit" disabled={processing} className="btn-primary py-2 px-8">Opublikuj</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {announcement ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-dark rounded-[2.5rem] p-8 border-2 ${getAnnouncementConfig(announcement.type).styles} relative overflow-hidden`}
          >
            <div className="flex items-center gap-6 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-black/20 ${getAnnouncementConfig(announcement.type).text}`}>
                {getAnnouncementConfig(announcement.type).icon({ size: 32 })}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg leading-tight">{announcement.message}</p>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">
                  Dodano: {new Date(announcement.createdAt).toLocaleString('pl-PL')}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDeleteAnnouncement}
                className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-red-500"
              >
                <FaTrash />
              </motion.button>
            </div>
          </motion.div>
        ) : !showAnnouncementForm && (
          <div className="p-12 glass rounded-[2.5rem] border-dashed border-white/10 text-center">
            <FaBullhorn className="text-gray-700 mx-auto mb-4" size={32} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Brak aktywnych ogłoszeń</p>
          </div>
        )}
      </section>

      {/* Maintenance Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FaTools size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Zarządzanie usługami</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Przerwy techniczne</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary py-3 px-6 flex items-center gap-2 text-sm bg-amber-600 hover:bg-amber-500 shadow-amber-600/20"
          >
            <FaPlus /> Zaplanuj przerwę
          </motion.button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-[2rem] p-8 border-white/5 mb-8"
            >
              <form onSubmit={handleAddMaintenance} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Moduł do wyłączenia</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="input-field w-full cursor-pointer"
                    >
                      <option value="profile">Profile użytkowników</option>
                      <option value="chat">Chat globalny</option>
                      <option value="all">Cała platforma</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Czas trwania</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.hours}
                        onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) })}
                        className="input-field w-full pr-12"
                        min="1"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-[10px] font-black uppercase">godz.</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Powód</label>
                    <input
                      type="text"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="input-field w-full"
                      placeholder="np. Aktualizacja bazy danych..."
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 text-gray-500 font-bold hover:text-white transition-colors">Anuluj</button>
                  <button type="submit" disabled={processing} className="btn-primary py-2 px-8 bg-amber-600 hover:bg-amber-500 shadow-amber-600/20">Uruchom</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-6">
          {maintenances.length === 0 ? (
            <div className="p-12 glass rounded-[2.5rem] border-dashed border-white/10 text-center">
              <FaTools className="text-gray-700 mx-auto mb-4" size={32} />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Brak aktywnych przerw</p>
            </div>
          ) : (
            maintenances.map((m) => {
              const isExpired = new Date(m.endTime) <= new Date();
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass rounded-[2rem] p-6 border-white/5 relative overflow-hidden group ${isExpired ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${isExpired ? 'bg-gray-800' : 'bg-amber-500/10 text-amber-500'}`}>
                      {isExpired ? <FaCheckCircle size={24} /> : <FaTools size={24} className="animate-spin-slow" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest">{m.type === 'profile' ? 'Profile użytkowników' : m.type}</h4>
                        {!isExpired && <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded">Aktywne</span>}
                      </div>
                      <p className="text-gray-400 font-bold text-lg mb-4 truncate">{m.reason}</p>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                          <FaClock className="text-primary-500" /> Pozostało: {getTimeRemaining(m.endTime)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                          <FaCalendarAlt className="text-primary-500" /> Koniec: {new Date(m.endTime).toLocaleString('pl-PL')}
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteMaintenance(m.id)}
                      className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-red-500 border-white/5"
                    >
                      <FaTrash size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </section>
    </div>
  );
}

