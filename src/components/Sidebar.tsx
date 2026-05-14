import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, BarChart2, Calendar, MessageSquare, Award, Settings, LogOut, Home, X, Menu, Zap, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeScreen, setActiveScreen, isOpen, onClose }: SidebarProps) {
  const { logout, profile, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'syllabus', icon: BookOpen, label: 'Syllabus Hub' },
    { id: 'quiz', icon: Zap, label: 'Quiz Lab' },
    { id: 'planner', icon: Calendar, label: 'Study Planner' },
    { id: 'analytics', icon: BarChart2, label: 'Strength Map' },
    { id: 'tutor', icon: MessageSquare, label: 'AI Tutor' },
    { id: 'library', icon: BookOpen, label: 'Library' },
    { id: 'rewards', icon: Award, label: 'Rewards' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const content = (
    <div className={`w-72 md:w-80 flex flex-col h-full relative z-50 transition-colors duration-300 border-r ${
      theme === 'dark' ? 'bg-[#050505] border-white/5 text-[#F5F5F5]' : 'bg-[#FDFDFD] text-[#1A1A1A] border-black/5'
    }`}>
      <div className="p-8 pb-6 space-y-6 md:p-12 md:pb-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">
              <span className={theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}>Akshara</span>
              <span className={theme === 'dark' ? 'text-[#D9FF00]' : 'text-blue-600'}>Deepa</span>
            </h1>
            <p className="accent-label !text-[8px] md:!text-[10px]">Mission: SSLC 2026</p>
          </div>
          <button 
            onClick={toggleTheme}
            className={`p-3 md:p-4 rounded-xl md:rounded-[1.5rem] transition-all active:scale-95 border ${
              theme === 'dark' ? 'bg-white/5 text-[#D9FF00] border-white/5' : 'bg-black/5 text-[#0F172A] border-transparent'
            }`}
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-4 md:px-8 py-2 md:py-4 space-y-1 md:space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveScreen(item.id);
              onClose();
            }}
            className={`w-full flex items-center gap-4 md:gap-5 px-5 md:px-6 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] transition-all duration-300 group relative ${
              activeScreen === item.id 
                ? (theme === 'dark' ? 'bg-white text-black shadow-lg' : 'bg-[#0F172A] text-white shadow-xl shadow-slate-900/20')
                : 'text-slate-500 hover:text-blue-500'
            }`}
          >
            {activeScreen === item.id && (
              <motion.div 
                layoutId="nav-acc"
                className={`absolute left-0 w-1 h-5 rounded-r-full ${theme === 'dark' ? 'bg-lime-500' : 'bg-blue-600'}`}
              />
            )}
            <item.icon size={20} className="md:w-5 md:h-5" strokeWidth={activeScreen === item.id ? 2.5 : 2} />
            <span className={`text-xs md:text-sm tracking-tight ${activeScreen === item.id ? 'font-black' : 'font-bold'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-6 md:p-10 border-t ${theme === 'dark' ? 'border-white/5' : 'border-black/5 bg-slate-50/50'}`}>
        <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl font-black shadow-lg shrink-0 ${
            theme === 'dark' ? 'bg-white/5 text-[#D9FF00]' : 'bg-[#0F172A] text-white'
          }`}>
            {profile?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 overflow-hidden space-y-0.5">
            <p className="text-sm md:text-base font-black truncate tracking-tighter leading-none">{profile?.name || 'A. Scholar'}</p>
            <p className="accent-label !lowercase !tracking-normal !opacity-40 truncate !text-[8px] md:!text-[9px]">
              {profile?.district || 'Karnataka Board'}
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 md:gap-3 px-1 md:px-2 py-3 md:py-4 text-slate-500 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
        >
          <LogOut size={14} className="md:w-4 md:h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        {content}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 shadow-2xl"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 -right-12 p-2 bg-white rounded-full text-slate-900 shadow-xl"
              >
                <X size={20} />
              </button>
              {content}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
