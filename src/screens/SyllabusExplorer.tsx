import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SYLLABUS, CHAPTER_CONTENT, BOARD_WEIGHTAGE } from '../constants';
import { BookOpen, Zap, Book, Search, ArrowRight, Target, Info, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SyllabusExplorerProps {
  onStartChapter: (subject: string, chapter: string, mode: 'study' | 'quiz', marks?: number, type?: string) => void;
  onBack: () => void;
}

export function SyllabusExplorer({ onStartChapter, onBack }: SyllabusExplorerProps) {
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const subjects = [
    { id: 'Mathematics', label: 'Mathematics', icon: Book, color: isDark ? 'text-[#D9FF00]' : 'text-blue-600', bg: isDark ? 'bg-[#D9FF00]/10' : 'bg-blue-50' },
    { id: 'Science', label: 'Science', icon: Zap, color: isDark ? 'text-white' : 'text-emerald-600', bg: isDark ? 'bg-white/10' : 'bg-emerald-50' },
    { id: 'Social Science', label: 'Social Science', icon: BookOpen, color: isDark ? 'text-white' : 'text-orange-600', bg: isDark ? 'bg-white/10' : 'bg-orange-50' },
  ];

  const getChapters = (subjectId: string) => {
    const data = SYLLABUS[subjectId];
    if (Array.isArray(data)) return data;
    return Object.values(data).flat() as string[];
  };

  const filteredChapters = getChapters(activeSubject).filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container space-y-20 pb-40 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="accent-label">Academic Repository</span>
            <div className="h-px w-12 bg-black/10 dark:bg-white/10" />
          </div>
          <h1 className="app-heading">Syllabus Hub</h1>
          <p className="app-subheading max-w-2xl">
            Every chapter, every concept, organized according to the <br />
            <span className={isDark ? 'text-[#D9FF00]' : 'text-blue-600 underline underline-offset-8 decoration-blue-600/30'}>
              KSEEB Blueprint 2025-26 Official Guidelines
            </span>.
          </p>
        </div>
        <div className="app-card !p-8 !rounded-[2rem] max-w-sm flex items-start gap-5">
           <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${isDark ? 'bg-[#D9FF00]/20 text-[#D9FF00]' : 'bg-blue-100 text-blue-600'}`}>
             <Info size={24} />
           </div>
           <p className="human-label !text-sm leading-relaxed">
             AI analyzes weightage and previous year trends to prioritize your study sequence.
           </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-80 shrink-0 space-y-6">
          <p className="accent-label px-4">Subject Focus</p>
          <div className="space-y-4">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSubject(s.id);
                  setSearchTerm('');
                }}
                className={`w-full p-8 rounded-[2.25rem] border transition-all flex items-center gap-6 text-left relative overflow-hidden group ${
                  activeSubject === s.id 
                    ? (isDark ? 'bg-white border-white text-black shadow-2xl scale-[1.05] z-10' : 'bg-[#0F172A] border-[#0F172A] text-white shadow-2xl shadow-slate-900/40 scale-[1.05] z-10') 
                    : (isDark ? 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10' : 'bg-[#F9F9F9] border-black/5 text-slate-600 hover:bg-white hover:border-black/10')
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  activeSubject === s.id 
                    ? (isDark ? 'bg-black/5 text-black' : 'bg-white/10 text-white') 
                    : (isDark ? 'bg-white/5 text-slate-500' : 'bg-white shadow-sm ' + s.color)
                }`}>
                  <s.icon size={32} strokeWidth={activeSubject === s.id ? 2.5 : 2} />
                </div>
                <div>
                  <p className="font-black text-2xl tracking-tighter leading-tight">{s.label}</p>
                  <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 opacity-40 transition-opacity ${activeSubject === s.id ? 'opacity-60' : ''}`}>
                    {getChapters(s.id).length} Chapters
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-12">
           <div className={`app-card !p-4 !rounded-full border shadow-2xl flex items-center gap-6 group transition-all duration-700 ${
             isDark ? 'focus-within:border-[#D9FF00]/30' : 'focus-within:border-blue-600/30'
           }`}>
              <Search className="text-slate-400 ml-8" size={24} />
              <input 
                type="text" 
                placeholder={`Filter ${activeSubject.toLowerCase()} units...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-6 outline-none font-black text-xl placeholder:opacity-20 placeholder:text-slate-900 dark:placeholder:text-white bg-transparent"
              />
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredChapters.map((chapter, i) => {
                  const hasContent = !!CHAPTER_CONTENT[chapter];
                  const weightage = BOARD_WEIGHTAGE[activeSubject]?.[chapter] || 0;
                  return (
                    <motion.div
                      layout
                      key={chapter}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.8 }}
                      className="app-card !p-8 md:!p-12 group hover:shadow-3xl hover:-translate-y-2 relative"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                             <span className="accent-label !opacity-60">Curriculum Unit</span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.1] group-hover:text-blue-600 transition-colors duration-500">
                            {chapter}
                          </h3>
                        </div>

                        {weightage > 0 && (
                          <div className="text-left md:text-right shrink-0">
                              <span className="accent-label !text-[9px]">Blueprint Weight</span>
                              <div className="flex items-baseline gap-1 pt-1 md:justify-end">
                                 <span className={`text-3xl md:text-4xl font-black tracking-tighter ${isDark ? 'text-[#D9FF00]' : 'text-blue-600'}`}>{weightage}</span>
                                 <span className="accent-label opacity-40">MKS</span>
                              </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-8">
                        <div className="flex flex-wrap gap-3">
                          {weightage >= 7 && (
                            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border transition-all ${
                              isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                              <Sparkles size={14} className="animate-spin-slow" />
                              <span className="text-[10px] font-black uppercase tracking-widest">High Impact</span>
                            </div>
                          )}
                          {hasContent && (
                            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border transition-all ${
                              isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              <Book size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Full Resources</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-16 grid grid-cols-2 gap-6">
                         <button 
                          onClick={() => onStartChapter(activeSubject, chapter, 'study')}
                          className={`py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                            isDark ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-slate-50 text-slate-900 border border-black/5 hover:bg-slate-100'
                          }`}
                         >
                            <Book size={18} /> Guide
                         </button>
                         <button 
                          onClick={() => onStartChapter(activeSubject, chapter, 'quiz', undefined, 'BOARD_PATTERN')}
                          className={`py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
                            isDark ? 'bg-[#D9FF00] text-black hover:bg-[#c2e600] shadow-lime-500/20' : 'bg-[#1A1A1A] text-white hover:bg-blue-600'
                          }`}
                         >
                            <Zap size={18} /> Exam Mode
                         </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
