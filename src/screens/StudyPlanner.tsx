import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { generateStudyPlan } from '../lib/gemini';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Calendar, Zap, Target, BookOpen, Clock, AlertTriangle, ArrowLeft, RefreshCw, BarChart3 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getWeakestTopics } from '../lib/mastery';

export function StudyPlanner({ onBack }: { onBack: () => void }) {
  const { profile, user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const fetchPlan = async () => {
    if (!user) return;
    const planRef = doc(db, 'users', user.uid, 'studyPlan', 'current');
    try {
      const snap = await getDoc(planRef);
      if (snap.exists()) {
        setPlan(snap.data());
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, planRef.path);
    }
  };

  const createPlan = async () => {
    if (!profile || !user) return;
    setLoading(true);
    try {
      const examDate = profile.examDate ? new Date(profile.examDate) : new Date('2026-03-25');
      const daysLeft = Math.max(7, Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
      
      const weakTopics = getWeakestTopics();
      const strongTopics = Object.entries(JSON.parse(localStorage.getItem('akshara_strength_map') || '{}'))
        .filter(([_, s]) => (s as number) > 80)
        .map(([k, _]) => k.split(':')[1]);

      const newPlan = await generateStudyPlan({
        name: profile.name || 'Scholar',
        school: profile.school || 'Karnataka SSLC Board',
        days: daysLeft,
        hours: 4,
        completedList: [],
        weakList: weakTopics.length > 0 ? weakTopics.map(t => t.chapter) : ['Algebra', 'Electricity'],
        strongList: strongTopics.length > 0 ? strongTopics : ['Real Numbers'],
        subjectScores: {}
      });

      if (!newPlan || !newPlan.days) throw new Error("Invalid plan generated");

      const planRef = doc(db, 'users', user.uid, 'studyPlan', 'current');
      await setDoc(planRef, newPlan);
      setPlan(newPlan);
    } catch (err) {
      console.error("AI Plan Error:", err);
      // Fail-safe: Local basic plan if AI is down
      const fallbackPlan = {
        planTitle: "Standard Mission 2026",
        strategy: "Focusing on core subject mastery while the AI engine recalibrates.",
        days: [
          { day: 1, theme: "Foundation Building", priority: "RED", morning: { subject: "Mathematics", chapter: "Real Numbers" }, afternoon: { subject: "Science", chapter: "Chemical Reactions" }, evening: { task: "MCQ Drill", count: 20 }, motivationTip: "Consistency is key to the 2026 Mission." }
        ]
      };
      setPlan(fallbackPlan);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [user]);

  if (loading) return (
    <div className={`h-full flex flex-col items-center justify-center p-12 text-center rounded-[3rem] ${
      isDark ? 'bg-[#121212] border border-white/5' : 'bg-white'
    }`}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }} className="mb-8">
        <Calendar size={80} className={isDark ? 'text-[#D9FF00]' : 'text-blue-600'} />
      </motion.div>
      <h2 className={`text-3xl font-black mb-3 tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Creating Your Success Strategy...</h2>
      <p className="text-slate-500 font-medium text-lg max-w-sm">Calculating daily targets based on your weak areas and exam date.</p>
    </div>
  );

  return (
    <div className="app-container space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className={`app-heading ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Study Planner</h1>
          <p className="app-subheading max-w-lg">AI-optimised roadmap tailored specifically to your SSLC Board timeline.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={createPlan}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all shadow-sm active:scale-95 ${
              isDark ? 'bg-white/5 text-[#D9FF00] border-white/5 hover:bg-white/10' : 'bg-white text-blue-600 border-blue-50 hover:bg-blue-50'
            }`}
          >
            <RefreshCw size={18} /> Regenerate Plan
          </button>
        </div>
      </header>

      {!plan ? (
        <div className={`p-20 rounded-[4rem] shadow-2xl border text-center transition-all ${
          isDark ? 'bg-[#121212] border-white/5 shadow-black/40' : 'bg-white border-slate-50 shadow-blue-900/5'
        }`}>
            <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner ${
              isDark ? 'bg-white/5 text-[#D9FF00]' : 'bg-blue-50 text-blue-600'
            }`}>
                <Target size={56} />
            </div>
            <h2 className={`text-4xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>No Study Plan Detected</h2>
            <p className="text-slate-500 font-medium mb-12 max-w-md mx-auto text-lg leading-relaxed">
                Generate a personalised academic roadmap based on your current readiness and the days remaining for your Boards.
            </p>
            <button 
                onClick={createPlan}
                className={`px-12 py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 ${
                  isDark ? 'bg-[#D9FF00] text-black shadow-lime-500/20 hover:bg-[#c2e600]' : 'bg-[#2563EB] text-white shadow-blue-600/30 hover:bg-blue-700'
                }`}
            >
                Generate Smart Plan
            </button>
        </div>
      ) : (
        <div className="space-y-12">
            <div className={`p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden shadow-2xl transition-all duration-700 group ${
              isDark ? 'bg-[#D9FF00] text-black' : 'bg-[#0F172A] text-white shadow-slate-900/40'
            }`}>
                <div className="relative z-10 max-w-3xl">
                    <p className={`font-black uppercase tracking-[0.2em] text-[10px] mb-6 opacity-60`}>Mission Strategy</p>
                    <h2 className={`text-4xl md:text-5xl font-black mb-8 tracking-tighter leading-tight`}>{plan.planTitle}</h2>
                    <p className={`text-lg font-medium leading-relaxed opacity-90`}>{plan.strategy}</p>
                </div>
                <Zap className={`absolute -right-16 -bottom-16 opacity-[0.03] md:opacity-[0.05] group-hover:scale-110 transition-transform duration-1000`} size={380} />
                <div className={`absolute top-10 right-10 flex flex-col items-end`}>
                   <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-4 ${
                     isDark ? 'border-black/10 bg-black/5 text-black' : 'border-white/10 bg-white/5 text-white'
                   }`}>
                      <BarChart3 size={32} />
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plan.days.map((day: any, i: number) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        key={day.day}
                        className={`rounded-[3rem] border transition-all shadow-xl p-8 flex flex-col group hover:scale-[1.02] ${
                            isDark 
                              ? 'bg-[#121212] border-white/5' 
                              : (day.priority === 'RED' ? 'bg-white border-red-100' : day.priority === 'AMBER' ? 'bg-white border-orange-100' : 'bg-white border-slate-100')
                        }`}
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <p className={`px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-sm ${
                                    day.priority === 'RED' ? 'bg-red-500 text-white' : 
                                    day.priority === 'AMBER' ? 'bg-orange-500 text-white' : 
                                    'bg-emerald-500 text-white'
                                }`}>DAY {day.day}</p>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day.date}</span>
                            </div>
                            <div className={`w-3 h-3 rounded-full shadow-lg ${
                                day.priority === 'RED' ? 'bg-red-500' : 
                                day.priority === 'AMBER' ? 'bg-orange-500' : 
                                'bg-emerald-500'
                            }`} />
                        </div>

                        <h3 className={`text-2xl font-black leading-tight mb-8 min-h-[64px] tracking-tight group-hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{day.theme}</h3>

                        <div className="space-y-6 flex-1">
                            {['morning', 'afternoon'].map(time => (
                                <div key={time} className="space-y-2 p-5 rounded-3xl bg-slate-50 border border-slate-100 transition-colors group-hover:bg-blue-50/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                                        <Clock size={12} className="text-blue-600" /> {time}
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 leading-tight">
                                        <span className="text-blue-600">{day[time].subject}</span>: {day[time].chapter}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className={`mt-10 pt-8 border-t ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Evening Objective</p>
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                                  isDark ? 'bg-white/5 text-[#D9FF00]' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    <BookOpen size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className={`text-base font-black ${isDark ? 'text-slate-200' : 'text-blue-600'}`}>{day.evening.task}</p>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">{day.evening.count} Questions</p>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-8 p-6 rounded-3xl italic text-xs font-medium leading-relaxed transition-colors border ${
                          isDark ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-50/50 text-slate-600 border-transparent'
                        }`}>
                            "{day.motivationTip}"
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
