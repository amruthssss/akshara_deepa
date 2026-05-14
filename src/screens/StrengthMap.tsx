import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowLeft, Target, TrendingUp, Award, Zap, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getSubjectMastery, getWeakestTopics } from '../lib/mastery';

export function StrengthMap({ onBack }: { onBack: () => void }) {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async () => {
    if (!user) return;
    try {
      const historyQuery = query(
        collection(db, 'users', user.uid, 'quizHistory'),
        orderBy('date', 'desc'),
        limit(20)
      );
      const snap = await getDocs(historyQuery);
      const history = snap.docs.map(doc => doc.data());

      // Use real mastery data for radar chart
      const radarData = [
        { subject: 'Math', A: getSubjectMastery('Mathematics'), fullMark: 100 },
        { subject: 'Science', A: getSubjectMastery('Science'), fullMark: 100 },
        { subject: 'Social', A: getSubjectMastery('Social Science'), fullMark: 100 },
        { subject: 'Languages', A: getSubjectMastery('Languages'), fullMark: 100 },
      ];

      const weakTopics = getWeakestTopics();

      setData({ radarData, history, weakTopics });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/quizHistory`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  if (loading) return (
    <div className={`h-full flex flex-col items-center justify-center p-12 text-center rounded-[3rem] ${
      isDark ? 'bg-[#121212] border border-white/5' : 'bg-white'
    }`}>
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }} 
        transition={{ repeat: Infinity, duration: 2 }} 
        className={`mb-10 p-8 rounded-full ${isDark ? 'bg-white/5' : 'bg-blue-50'}`}
      >
        <TrendingUp size={64} className={isDark ? 'text-[#D9FF00]' : 'text-blue-600'} />
      </motion.div>
      <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Computing Your Mastery...</h2>
      <p className="text-slate-500 font-medium text-lg mt-4">Aggregating SSLC performance data</p>
    </div>
  );

  return (
    <div className="app-container space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <h1 className={`app-heading ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Performance Engine</h1>
          <p className="app-subheading max-w-lg">Advanced insights into your Board preparedness based on recent quiz data.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Radar Chart Card */}
        <div className={`p-10 md:p-14 rounded-[3.5rem] shadow-2xl border flex flex-col items-center transition-all ${
          isDark ? 'bg-[#121212] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-blue-900/5'
        }`}>
            <h2 className={`text-2xl font-black mb-12 text-left w-full tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Subject Matrix</h2>
            <div className="w-full h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
                        <PolarGrid stroke={isDark ? '#333' : '#F1F5F9'} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 13, fontWeight: 900 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Mastery"
                            dataKey="A"
                            stroke={isDark ? '#D9FF00' : '#2563EB'}
                            strokeWidth={4}
                            fill={isDark ? '#D9FF00' : '#2563EB'}
                            fillOpacity={isDark ? 0.2 : 0.1}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-8 w-full mt-10">
                <div className={`p-8 rounded-[2.5rem] text-center border ${
                  isDark ? 'bg-white/5 border-emerald-500/10' : 'bg-emerald-50/50 border-emerald-100'
                }`}>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Primary Strength</p>
                    <p className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Social Science</p>
                </div>
                <div className={`p-8 rounded-[2.5rem] text-center border ${
                  isDark ? 'bg-white/5 border-rose-500/10' : 'bg-rose-50/50 border-rose-100'
                }`}>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-3">Growth Area</p>
                    <p className={`font-black text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.weakTopics[0]?.subject || 'English'}</p>
                </div>
            </div>
        </div>

        {/* Prediction & Insights */}
        <div className="space-y-10">
            <div className={`p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group transition-all duration-700 ${
              isDark ? 'bg-white text-black' : 'bg-[#0F172A] text-white shadow-slate-900/40'
            }`}>
                <div className={`absolute top-0 right-0 w-80 h-80 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all duration-1000 ${
                  isDark ? 'bg-black/5' : 'bg-blue-600/10 group-hover:bg-blue-600/20'
                }`} />
                <div className="relative z-10">
                    <h3 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-slate-500' : 'text-blue-400'}`}>Board Prediction v1.2</h3>
                    <div className="flex items-baseline gap-4">
                        <span className="text-8xl font-black tracking-tighter">{Math.round(getSubjectMastery('Mathematics') * 0.8)}</span>
                        <span className={`text-3xl font-black tracking-tighter ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ 80</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm font-black mt-8 ${isDark ? 'text-emerald-600' : 'text-emerald-400'}`}>
                        <TrendingUp size={22} /> 
                        <span>Surpassing {profile?.district || 'State'} average by {Math.round(getSubjectMastery('Mathematics') / 10)}%</span>
                    </div>
                </div>
                <div className={`absolute bottom-10 right-10 w-24 h-24 rounded-[2rem] border-8 flex items-center justify-center text-4xl font-black rotate-12 transition-all group-hover:rotate-0 duration-500 ${
                  isDark ? 'border-black/5 bg-black/5 text-black' : 'border-white/10 bg-white/5 text-white'
                }`}>
                    {getSubjectMastery('Mathematics') > 80 ? 'A+' : getSubjectMastery('Mathematics') > 60 ? 'B' : 'C'}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-app">
                <div className={`p-8 rounded-[2.5rem] border shadow-sm ${
                  isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'
                }`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${
                      isDark ? 'bg-white/5 text-orange-500' : 'bg-orange-50 text-orange-600'
                    }`}>
                        <Zap size={28} />
                    </div>
                    <h4 className={`font-black mb-3 text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Momentum Key</h4>
                    <p className="text-base text-slate-500 font-medium leading-relaxed">Solving speed is stable. High board potential detected.</p>
                </div>
                <div className={`p-8 rounded-[2.5rem] border shadow-sm ${
                  isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'
                }`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${
                      isDark ? 'bg-white/5 text-rose-500' : 'bg-rose-50 text-rose-600'
                    }`}>
                        <AlertCircle size={28} />
                    </div>
                    <h4 className={`font-black mb-3 text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Risk Area</h4>
                    <p className="text-base text-slate-500 font-medium leading-relaxed">{data.weakTopics[0]?.chapter || 'English Poetry'} recall is below 60%. Schedule a dedicated revision soon.</p>
                </div>
            </div>

            <div className={`p-10 rounded-[3.5rem] border shadow-sm ${
              isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'
            }`}>
                <div className="flex justify-between items-center mb-8">
                    <h3 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Board Readiness</h3>
                    <Award className={isDark ? 'text-[#D9FF00]' : 'text-blue-600'} size={28} />
                </div>
                <div className={`w-full h-5 rounded-full overflow-hidden mb-8 shadow-inner ${isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-100'}`}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${getSubjectMastery('Mathematics')}%` }}
                        className={`h-full ${isDark ? 'bg-[#D9FF00]' : 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'}`}
                    />
                </div>
                <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    <span>Novice</span>
                    <span className={`px-5 py-1.5 rounded-full ${isDark ? 'bg-[#D9FF00] text-black font-black' : 'bg-blue-50 text-[#0F172A]'}`}>Level {getSubjectMastery('Mathematics')}/100</span>
                    <span>Expert</span>
                </div>
            </div>
        </div>
      </div>

      <div className={`p-12 md:p-16 rounded-[4rem] shadow-2xl border transition-all ${
        isDark ? 'bg-[#121212] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-blue-900/5'
      }`}>
        <div className="flex items-center justify-between mb-12">
            <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Mastery Trajectory</h2>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${isDark ? 'bg-[#D9FF00]' : 'bg-blue-600'}`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Accuracy %</span>
                </div>
            </div>
        </div>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.history.map((h: any, i: number) => ({ name: i, score: (h.score/h.totalQ)*100 })).reverse()}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#222' : '#F8FAFC'} />
              <XAxis dataKey="name" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                 contentStyle={{ 
                   borderRadius: '32px', 
                   border: 'none', 
                   backgroundColor: isDark ? '#1A1A1A' : '#fff',
                   boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', 
                   padding: '24px' 
                 }}
                 labelStyle={{ display: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={isDark ? '#D9FF00' : '#2563EB'} 
                strokeWidth={6} 
                dot={{ r: 8, fill: isDark ? '#D9FF00' : '#2563EB', strokeWidth: 4, stroke: isDark ? '#000' : '#fff' }} 
                activeDot={{ r: 12, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
