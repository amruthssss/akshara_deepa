import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Settings as SettingsIcon, LogOut, Moon, Bell, Globe, ArrowLeft, User, Shield } from 'lucide-react';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, LogOut, Moon, Bell, Globe, ArrowLeft, User, Shield, Save, CheckCircle2, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export function Settings({ onBack }: { onBack: () => void }) {
  const { logout, profile, user, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  // Local state for profile form
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    school: profile?.school || '',
    language: profile?.language || 'English'
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileRef = doc(db, 'users', user.uid, 'profile', 'data');
      await updateDoc(profileRef, formData);
      await refreshProfile();
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        setIsEditingProfile(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { 
      title: 'Account', 
      items: [
        {
          label: 'Profile Information',
          icon: User,
          desc: 'Manage your name, school, and district',
          action: () => setIsEditingProfile(true)
        },
        { label: 'Privacy & Security', icon: Shield, desc: 'Manage your data and parent access' }
      ]
    },
    { 
      title: 'Preferences', 
      items: [
        { label: 'Language', icon: Globe, desc: 'Switch between English and Kannada', value: profile?.language },
        { label: 'Dark Mode', icon: Moon, desc: 'Switch to a darker theme', toggle: true, isOn: isDark, onToggle: toggleTheme },
        { label: 'Notifications', icon: Bell, desc: 'Daily study reminders', toggle: true }
      ]
    }
  ];

  return (
    <div className="app-container max-w-4xl mx-auto space-y-10 pb-40 animate-in fade-in duration-500">
      <div className="flex items-center gap-6 pt-6">
        <button
          onClick={onBack}
          className={`p-4 rounded-2xl transition-all active:scale-90 border ${
            isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-black/5 text-slate-500 shadow-sm'
          }`}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Settings</h1>
      </div>

      <div className="space-y-10 md:space-y-12">
        {sections.map((section) => (
          <div key={section.title} className="space-y-5">
            <h2 className="accent-label px-4 md:px-6">{section.title}</h2>
            <div className={`app-card !p-0 !rounded-[2rem] md:!rounded-[2.5rem] border shadow-xl overflow-hidden ${
              isDark ? 'bg-[#0D0D0D] border-white/5' : 'bg-white border-slate-100 shadow-blue-900/5'
            }`}>
               {section.items.map((item, i) => (
                 <button
                    key={item.label}
                    onClick={item.action}
                    disabled={!item.action && !item.onToggle}
                    className={`w-full p-6 md:p-8 flex items-center justify-between transition-all text-left ${
                      i !== section.items.length - 1 ? (isDark ? 'border-b border-white/5' : 'border-b border-slate-50') : ''
                    } ${item.action || item.onToggle ? 'hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.99]' : 'cursor-default'}`}
                 >
                    <div className="flex items-center gap-4 md:gap-6">
                       <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-colors ${
                         isDark ? 'bg-white/5 text-[#D9FF00]' : 'bg-blue-50 text-blue-600'
                       }`}>
                          <item.icon size={22} className="md:w-6 md:h-6" />
                       </div>
                       <div>
                          <p className="font-black text-base md:text-xl tracking-tight leading-none mb-1 md:mb-2">{item.label}</p>
                          <p className="text-[10px] md:text-xs text-slate-400 font-medium">{item.desc}</p>
                       </div>
                    </div>

                    {item.value && (
                      <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${
                        isDark ? 'bg-white/5 text-slate-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {item.value}
                      </span>
                    )}

                    {item.toggle && (
                      <div
                        onClick={(e) => { e.stopPropagation(); item.onToggle?.(); }}
                        className={`w-12 h-7 md:w-14 md:h-8 rounded-full p-1 relative transition-colors duration-300 ${
                          item.isOn ? (isDark ? 'bg-[#D9FF00]' : 'bg-blue-600') : 'bg-slate-200 dark:bg-white/10'
                        }`}
                      >
                        <motion.div
                          animate={{ x: item.isOn ? (window.innerWidth < 768 ? 20 : 24) : 0 }}
                          className="w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-lg"
                        />
                      </div>
                    )}
                 </button>
               ))}
            </div>
          </div>
        ))}

        <div className="pt-6">
          <button 
            onClick={logout}
            className={`w-full flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              isDark ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-100'
            }`}
          >
            <LogOut size={20} />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setIsEditingProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-lg app-card !p-10 shadow-3xl ${isDark ? 'bg-[#121212]' : 'bg-white'}`}
            >
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-3xl font-black tracking-tighter">Edit Profile</h2>
                 <button onClick={() => setIsEditingProfile(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="accent-label px-2">Scholar Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full p-6 rounded-2xl font-bold outline-none border-2 transition-all ${
                      isDark ? 'bg-white/5 border-white/5 focus:border-[#D9FF00] text-white' : 'bg-slate-50 border-black/5 focus:border-blue-600'
                    }`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="accent-label px-2">Current School</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={e => setFormData({ ...formData, school: e.target.value })}
                    className={`w-full p-6 rounded-2xl font-bold outline-none border-2 transition-all ${
                      isDark ? 'bg-white/5 border-white/5 focus:border-[#D9FF00] text-white' : 'bg-slate-50 border-black/5 focus:border-blue-600'
                    }`}
                  />
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className={`w-full py-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${
                      saveStatus === 'success'
                        ? 'bg-emerald-500 text-white'
                        : (isDark ? 'bg-[#D9FF00] text-black' : 'bg-[#0F172A] text-white')
                    }`}
                  >
                    {saving ? <RefreshCw className="animate-spin" /> : (saveStatus === 'success' ? <CheckCircle2 /> : <Save />)}
                    {saveStatus === 'success' ? 'Saved' : 'Secure Updates'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
