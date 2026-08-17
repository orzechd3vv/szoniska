'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from './LoginModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaUser, FaShieldAlt, FaCrown } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isPostPage = pathname?.startsWith('/posts/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (isPostPage) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-3 bg-[#03000a]/90 backdrop-blur-3xl border-b border-white/[0.12] shadow-[0_15px_40px_rgba(0,0,0,0.7)]' 
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 sm:gap-4 cursor-pointer touch-manipulation"
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 glass rounded-2xl flex items-center justify-center overflow-hidden border-primary-500/60 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-purple-800/30 blur-md" />
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={30}
                    height={30}
                    className="relative z-10 object-contain drop-shadow-[0_0_12px_rgba(192,132,252,0.9)] sm:w-[34px] sm:h-[34px]"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-none uppercase italic">
                    SZONISKA<span className="text-primary-400">.</span>
                  </h1>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-primary-300 font-extrabold mt-1">Made by MVP</span>
                </div>
              </motion.div>
            </Link>

            <nav className="flex items-center gap-3">
              {session ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-1.5 sm:px-3.5 sm:py-2 glass hover:bg-white/[0.10] rounded-2xl border-white/[0.15] transition-all shadow-xl touch-manipulation cursor-pointer"
                  >
                    <div className="relative">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border-2 border-primary-500/80 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-primary-600 to-purple-900 flex items-center justify-center text-white font-black border-2 border-primary-500/80 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-[#03000a] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                    </div>
                    <div className="flex flex-col items-start hidden lg:flex">
                      <span className="text-sm font-black text-white truncate max-w-[130px]">
                        {session.user?.name}
                      </span>
                      <span className="text-[10px] text-primary-300 font-extrabold uppercase tracking-wider">
                        {session.user?.isAdmin ? 'Cyber Admin' : 'Zweryfikowany'}
                      </span>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none" onClick={() => setShowUserMenu(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute right-0 mt-3 w-72 sm:w-80 glass-dark rounded-[2.5rem] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-50 p-3.5"
                        >
                          <div className="px-4 py-3 border-b border-white/10 mb-2">
                            <p className="text-[10px] text-primary-300 font-bold uppercase tracking-widest">Zalogowany jako</p>
                            <p className="text-sm font-black text-white truncate">{session.user?.email || session.user?.name}</p>
                          </div>

                          <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                            <div className="flex items-center gap-4 p-4 hover:bg-white/[0.1] rounded-2xl transition-all group touch-manipulation">
                              <div className="w-11 h-11 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-300 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <FaUser size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-white text-sm">Mój Profil</span>
                                <span className="text-[10px] text-gray-400 font-medium">Zarządzaj kontem</span>
                              </div>
                            </div>
                          </Link>

                          {session.user?.isAdmin && (
                            <Link href="/profile?tab=admin" onClick={() => setShowUserMenu(false)}>
                              <div className="flex items-center gap-4 p-4 hover:bg-white/[0.1] rounded-2xl transition-all group touch-manipulation">
                                <div className="w-11 h-11 rounded-xl bg-amber-500/25 flex items-center justify-center text-amber-300 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                  <FaShieldAlt size={18} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-white text-sm">Panel Admina</span>
                                  <span className="text-[10px] text-gray-400 font-medium">Moderacja sieci</span>
                                </div>
                              </div>
                            </Link>
                          )}
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 hover:bg-red-500/20 rounded-2xl transition-all group mt-1 touch-manipulation"
                          >
                            <div className="w-11 h-11 rounded-xl bg-red-500/25 flex items-center justify-center text-red-300 group-hover:bg-red-500 group-hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                              <FaSignOutAlt size={18} />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-bold text-white text-sm">Wyloguj się</span>
                              <span className="text-[10px] text-gray-400 font-medium">Zakończ sesję</span>
                            </div>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLoginModal(true)}
                    className="btn-primary py-3 px-6 sm:px-8 text-xs flex items-center gap-2.5 shadow-[0_0_35px_rgba(168,85,247,0.5)] touch-manipulation"
                  >
                    <FaCrown className="text-amber-300 animate-pulse" size={14} />
                    <span>Zaloguj</span>
                  </motion.button>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Announcement Cyber Bar */}
        {!isScrolled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 bg-gradient-to-r from-primary-950/80 via-purple-900/40 to-primary-950/80 border-y border-primary-500/40 py-2.5 backdrop-blur-2xl shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-3 text-center">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping shrink-0" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] sm:tracking-[0.45em] text-glow truncate">
                NOWA ODSŁONA <span className="text-primary-400 mx-1.5">•</span> SZONISKA
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping shrink-0" />
            </div>
          </motion.div>
        )}
      </motion.header>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
