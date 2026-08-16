'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaEye, FaUsers, FaUserShield, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import UserDetailModal from './UserDetailModal';

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

export default function UsersManagementNew() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white">Zarządzanie społecznością</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
            Przeglądaj i moderuj konta użytkowników
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj (nazwa, email)..."
            className="input-field w-full pl-12 py-3.5 bg-white/5 border-white/5 rounded-2xl"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Wszyscy', value: users.length, icon: FaUsers, color: 'text-primary-400' },
          { label: 'Zablokowani', value: users.filter(u => u.isBlocked).length, icon: FaUserShield, color: 'text-red-400' },
          { label: 'Ograniczeni', value: users.filter(u => u.isRestricted).length, icon: FaExclamationCircle, color: 'text-amber-400' },
          { label: 'Aktywni', value: users.filter(u => !u.isBlocked && !u.isRestricted).length, icon: FaCheckCircle, color: 'text-green-400' },
        ].map((stat, idx) => (
          <div key={idx} className="glass p-4 rounded-2xl border-white/5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-lg font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="glass rounded-[2rem] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Użytkownik</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Kontakt</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Aktywność</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Działania</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                    Nie odnaleziono pasujących użytkowników
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {user.image ? (
                            <img src={user.image} className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:border-primary-500/50 transition-all" />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-black text-xl border border-white/10">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#020202] ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
                        </div>
                        <div>
                          <p className="text-white font-black text-sm">{user.name}</p>
                          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">
                            Dołączył: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {user.email && <p className="text-gray-400 text-xs font-medium mb-1">{user.email}</p>}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <p className="text-white font-black text-sm leading-none">{user._count.posts}</p>
                          <p className="text-[9px] text-gray-600 font-black uppercase mt-1">Posty</p>
                        </div>
                        <div className="text-center">
                          <p className={`font-black text-sm leading-none ${user._count.warnings > 0 ? 'text-red-400' : 'text-white'}`}>
                            {user._count.warnings}
                          </p>
                          <p className="text-[9px] text-gray-600 font-black uppercase mt-1">Uwagi</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        {user.isBlocked ? (
                          <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[9px] font-black uppercase tracking-widest">Zablokowany</span>
                        ) : user.isRestricted ? (
                          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[9px] font-black uppercase tracking-widest">Ograniczony</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-[9px] font-black uppercase tracking-widest">Aktywny</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedUser(user)}
                        className="w-10 h-10 glass rounded-xl inline-flex items-center justify-center text-primary-400 hover:text-white transition-all border-white/5"
                      >
                        <FaEye size={16} />
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onUpdate={() => {
              fetchUsers();
              setSelectedUser(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

