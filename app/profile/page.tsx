'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaClipboardList, FaShieldAlt, FaLock, 
  FaBullhorn, FaTools, FaChevronRight, FaCamera,
  FaChartLine, FaBell, FaSignOutAlt
} from 'react-icons/fa';
import ProfileInfo from '@/components/profile/ProfileInfo';
import UserPosts from '@/components/profile/UserPosts';
import AdminPanel from '@/components/profile/AdminPanel';
import UserWarnings from '@/components/profile/UserWarnings';
import SecuritySettings from '@/components/profile/SecuritySettings';
import UpdatesList from '@/components/profile/UpdatesList';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'posts' | 'warnings' | 'security' | 'updates' | 'admin'>('info');
  const [showEditModal, setShowEditModal] = useState(false);
  const [maintenance, setMaintenance] = useState<any>(null);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    checkMaintenance();
  }, []);

  const checkMaintenance = async () => {
    try {
      const res = await fetch('/api/maintenance/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.isMaintenance) {
          setMaintenance(data);
        }
      }
    } catch (error) {
      console.error('Error checking maintenance:', error);
    } finally {
      setLoadingMaintenance(false);
    }
  };

  if (status === 'loading' || loadingMaintenance) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020202]">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full shadow-[0_0_20px_rgba(100,17,255,0.3)]"
        />
      </div>
    );
  }

  if (!session) return null;

  type TabType = 'info' | 'posts' | 'warnings' | 'security' | 'updates' | 'admin';

  const menuItems: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'info', label: 'Profil', icon: FaUser, color: 'text-blue-400' },
    { id: 'posts', label: 'Moje Posty', icon: FaClipboardList, color: 'text-primary-400' },
    { id: 'security', label: 'Bezpieczeństwo', icon: FaLock, color: 'text-green-400' },
    { id: 'updates', label: 'Aktualizacje', icon: FaBullhorn, color: 'text-purple-400' },
  ];

  if (session.user.isAdmin) {
    menuItems.push({ id: 'admin', label: 'Panel Admina', icon: FaShieldAlt, color: 'text-amber-400' });
  }

  return (
    <div className="min-h-screen bg-[#020202] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* User Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[2rem] p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-blue-600" />
            
            <div className="relative inline-block mb-4 group cursor-pointer" onClick={() => setShowEditModal(true)}>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-24 h-24 rounded-3xl border-2 border-primary-500/30 group-hover:border-primary-500 transition-all object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-primary-600 flex items-center justify-center text-white font-black text-4xl border-2 border-primary-500/30 group-hover:border-primary-500 transition-all">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center text-white">
                <FaCamera size={20} />
              </div>
            </div>

            <h2 className="text-xl font-black text-white mb-1">{session.user.name}</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">
              {session.user.isAdmin ? 'Administrator' : 'Użytkownik Premium'}
            </p>
            
            <div className="grid grid-cols-2 gap-2 mt-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Posty</p>
                <p className="text-lg font-black text-white">{stats?.postsCount ?? '...'}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Reputacja</p>
                <p className="text-lg font-black text-primary-400">{stats?.reputation ?? '...'}</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-[2rem] p-4 space-y-2"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activeTab === item.id 
                    ? 'bg-primary-600 text-white shadow-[0_0_20px_rgba(100,17,255,0.3)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className={activeTab === item.id ? 'text-white' : item.color} />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <FaChevronRight size={12} className={`transition-transform ${activeTab === item.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>
            ))}

            <div className="h-px bg-white/5 my-4 mx-4" />

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
            >
              <FaSignOutAlt />
              Wyloguj się
            </button>
          </motion.nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-[3rem] p-10 min-h-[600px] border-white/5"
            >
              {/* Content Header */}
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                    {menuItems.find(m => m.id === activeTab)?.icon({ size: 24 })}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                      {menuItems.find(m => m.id === activeTab)?.label}
                    </h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Zarządzaj swoją obecnością</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <FaBell />
                  </button>
                  <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                    <FaChartLine />
                  </button>
                </div>
              </div>

              {/* Dynamic Component Rendering */}
              {activeTab === 'info' && <ProfileInfo />}
              {activeTab === 'posts' && <UserPosts />}
              {activeTab === 'warnings' && <UserWarnings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'updates' && <UpdatesList />}
              {activeTab === 'admin' && session.user.isAdmin && <AdminPanel />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          onSuccess={() => console.log('Profile updated')}
        />
      )}
    </div>
  );
}

