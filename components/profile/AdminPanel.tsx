'use client';

import { useState } from 'react';
import { FaUsers, FaCheckCircle, FaComments, FaBullhorn, FaTools, FaChevronRight } from 'react-icons/fa';
import VerificationPanel from './VerificationPanel';
import UsersManagementNew from './UsersManagementNew';
import ChatManagement from '../admin/ChatManagement';
import UpdatesManagement from './UpdatesManagement';
import TechnicalManagement from './TechnicalManagement';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'verification' | 'users' | 'chat' | 'updates' | 'technical'>('verification');

  const tabs = [
    { id: 'verification', label: 'Weryfikacja', icon: FaCheckCircle, color: 'text-green-400' },
    { id: 'users', label: 'Użytkownicy', icon: FaUsers, color: 'text-blue-400' },
    { id: 'chat', label: 'Chat', icon: FaComments, color: 'text-purple-400' },
    { id: 'updates', label: 'Aktualizacje', icon: FaBullhorn, color: 'text-amber-400' },
    { id: 'technical', label: 'Ustawienia', icon: FaTools, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-3 p-2 glass rounded-3xl border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white shadow-inner'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className={activeTab === tab.id ? tab.color : 'text-gray-600'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {activeTab === 'verification' && <VerificationPanel />}
          {activeTab === 'users' && <UsersManagementNew />}
          {activeTab === 'chat' && <ChatManagement />}
          {activeTab === 'updates' && <UpdatesManagement />}
          {activeTab === 'technical' && <TechnicalManagement />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

