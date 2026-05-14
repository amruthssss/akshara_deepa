import React from 'react';
import { motion } from 'motion/react';
import { LogIn, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Login() {
  const { signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-[#F1F5F9]'}`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-[-5%] left-[-5%] w-[70%] h-[70%] rounded-full blur-[60px] opacity-10 ${isDark ? 'bg-[#D9FF00]' : 'bg-blue-600'}`} />
        <div className={`absolute bottom-[-5%] right-[-5%] w-[70%] h-[70%] rounded-full blur-[60px] opacity-10 ${isDark ? 'bg-indigo-400' : 'bg-orange-300'}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[960px] w-full grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] md:rounded-[4.5rem] overflow-hidden shadow-2xl bg-white dark:bg-[#0A0A0A] border border-black/5 dark:border-white/5"
      >
        {/* Left Side: Branding & Vibe */}
        <div className={`relative p-8 md:p-14 lg:p-20 flex flex-col justify-between overflow-hidden transition-all duration-700 ${isDark ? 'bg-[#151515]' : 'bg-[#0F172A]'} min-h-[320px] lg:min-h-auto`}>
          <div className="absolute inset-0 opacity-5 lg:opacity-20 text-white">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,currentColor_1px,transparent_0)] bg-[size:32px_32px]" />
          </div>
          
          <div className="relative z-10 space-y-6 lg:space-y-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`w-14 h-14 lg:w-24 lg:h-24 rounded-2xl lg:rounded-[2.5rem] flex items-center justify-center shadow-2xl ${
                isDark ? 'bg-[#D9FF00] text-black shadow-lime-500/20' : 'bg-white text-[#0F172A] shadow-white/10'
              }`}
            >
              <GraduationCap size={28} className="lg:hidden" strokeWidth={2.5} />
              <GraduationCap size={48} className="hidden lg:block" strokeWidth={2.5} />
            </motion.div>
            
            <div className="space-y-3 lg:space-y-6">
              <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none">
                Akshara <span className={isDark ? 'text-[#D9FF00]' : 'text-blue-400'}>Deepa</span>
              </h1>
              <div className={`h-2 w-20 lg:w-32 rounded-full ${isDark ? 'bg-[#D9FF00]' : 'bg-blue-500'}`} />
            </div>
            
            <p className="text-lg lg:text-2xl text-white/80 font-medium leading-relaxed max-w-[260px] lg:max-w-sm tracking-tight">
              The AI-Powered Academic Matrix engineered for the 2026 Board Mission.
            </p>
          </div>

          <div className="relative z-10 pt-8 lg:pt-16 space-y-3 lg:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/50">
                <ShieldCheck size={16} />
              </div>
              <p className="text-[9px] lg:text-xs font-black text-white/40 uppercase tracking-[0.3em]">Encrypted Protocol</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/50">
                <Sparkles size={16} />
              </div>
              <p className="text-[9px] lg:text-xs font-black text-white/40 uppercase tracking-[0.3em]">Adaptive Neural Learning</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Action */}
        <div className={`p-8 md:p-14 lg:p-20 flex flex-col justify-center items-center text-center space-y-10 lg:space-y-16 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
          <div className="space-y-4 lg:space-y-8">
            <span className={`accent-label uppercase tracking-[0.5em] !text-[10px] lg:!text-sm font-black ${isDark ? 'text-white/20' : 'text-slate-400'}`}>Security Checkpoint</span>
            <h2 className={`text-4xl lg:text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>System Access</h2>
            <p className={`human-label max-w-[280px] lg:max-w-[320px] text-base lg:text-xl font-medium leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Synchronise your identity to access the syllabus repository.</p>
          </div>

          <div className="w-full space-y-6 lg:space-y-8">
            <button
              onClick={signInWithGoogle}
              className={`group w-full flex items-center justify-center gap-4 py-5 lg:py-10 px-6 lg:px-12 rounded-2xl lg:rounded-[3rem] font-black text-base lg:text-2xl transition-all shadow-xl active:scale-98 border-2 ${
                isDark 
                  ? 'bg-white text-black border-white'
                  : 'bg-[#0F172A] border-[#0F172A] text-white hover:bg-black'
              }`}
            >
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-white rounded-lg lg:rounded-[1rem] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 lg:w-7 lg:h-7" />
              </div>
              <span className="tracking-tight">Google Enter Secure Matrix</span>
            </button>
            
            <p className={`text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed px-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              By entering, you agree to the <br className="hidden lg:block" /> 
              Academic Terms of Engagement
            </p>
          </div>

          <div className="pt-4 lg:pt-12 w-full flex flex-col items-center">
            <div className="flex -space-x-3 lg:-space-x-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-10 h-10 lg:w-16 lg:h-16 rounded-full border-[3px] lg:border-[6px] ${isDark ? 'border-[#0A0A0A] bg-white/5' : 'border-white bg-slate-100'} flex items-center justify-center overflow-hidden shadow-sm`}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 342}`} alt="User" />
                </div>
              ))}
              <div className={`w-10 h-10 lg:w-16 lg:h-16 rounded-full border-[3px] lg:border-[6px] ${isDark ? 'border-[#0A0A0A] bg-[#D9FF00]' : 'border-white bg-[#0F172A]'} flex items-center justify-center text-[9px] lg:text-xs font-black ${isDark ? 'text-black' : 'text-white shadow-lg'}`}>
                +10K
              </div>
            </div>
            <p className={`text-[9px] lg:text-xs font-black uppercase tracking-[0.3em] mt-4 ${isDark ? 'text-white/30' : 'text-slate-400/80'}`}>Elite SSLC Scholars Joined</p>
          </div>
        </div>
      </motion.div>
    </div>

  );
}
