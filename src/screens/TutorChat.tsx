import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, User, Brain, Info, RefreshCw } from 'lucide-react';
import { genAI, models } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../contexts/ThemeContext';

export function TutorChat({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: "Namaste! I'm Akshara, your AI SSLC specialist. Stressed about a concept? Stuck on a problem? Ask me anything about your syllabus!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({
        model: models.flash
      });

      const prompt = `You are Akshara, a premium AI academic companion for Class 10 Karnataka SSLC students.
Personality: Warm, encouraging, clear.
Expertise: FULL Karnataka State Board SSLC 2025-26 syllabus.
Rules: Respond in Kannada if asked in Kannada. Use analogies. ELI15 style.

User Query: ${userMsg}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setMessages(prev => [...prev, { role: 'model', content: response.text() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having a technical glitch. Could you try rephrasing that?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container flex flex-col h-full max-w-6xl`}>
      <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3 md:space-y-4">
          <h1 className={`app-heading ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>AI Tutor</h1>
          <p className="app-subheading max-w-lg">Get step-by-step help with complex SSLC concepts using Akshara's Board-aligned intelligence.</p>
        </div>
        <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl flex items-center gap-4 border transition-colors ${
          isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'
        }`}>
           <Info className={`${isDark ? 'text-[#D9FF00]' : 'text-blue-600'} md:w-6 md:h-6`} size={20} />
           <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Instant academic assistance available 24/7.</p>
        </div>
      </header>

      <div className={`flex-1 flex flex-col min-h-0 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-2xl overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#121212] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-blue-900/10'
      }`}>
        {/* Messages */}
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto p-5 md:p-12 space-y-6 md:space-y-8 custom-scrollbar ${
            isDark ? 'bg-[#0A0A0A]/50' : 'bg-slate-50/30'
          }`}
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] md:max-w-[85%] flex gap-3 md:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  m.role === 'user' ? (isDark ? 'bg-white text-black' : 'bg-[#0F172A] text-white') : (isDark ? 'bg-[#D9FF00] text-black' : 'bg-blue-600 text-white')
                }`}>
                  {m.role === 'user' ? <User size={16} className="md:w-5 md:h-5" /> : <Brain size={16} className="md:w-5 md:h-5" />}
                </div>
                <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-sm md:text-[15px] font-medium leading-relaxed prose prose-slate max-w-none ${
                  m.role === 'user' 
                    ? (isDark ? 'bg-[#D9FF00] text-black shadow-lime-500/10' : 'bg-blue-600 text-white shadow-blue-600/20')
                    : (isDark ? 'bg-white/5 text-slate-300 border border-white/5' : 'bg-white text-slate-800 shadow-sm border border-slate-100')
                }`}>
                  <ReactMarkdown className={m.role === 'user' ? 'text-inherit' : (isDark ? 'prose-invert text-slate-300' : 'text-slate-800')}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3 md:gap-4">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${isDark ? 'bg-[#D9FF00]' : 'bg-blue-600'} text-black`}>
                  <Brain size={16} className="md:w-5 md:h-5" />
                </div>
                <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border flex gap-1.5 transition-colors ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                  {[0, 1, 2].map(idx => (
                    <motion.div 
                      key={idx}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} 
                      transition={{ repeat: Infinity, duration: 1, delay: idx * 0.2 }} 
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#D9FF00]' : 'bg-blue-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`p-4 md:p-8 border-t transition-colors ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="relative max-w-4xl mx-auto group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a doubt..."
              className={`w-full pl-6 md:pl-8 pr-16 md:pr-20 py-4 md:py-6 text-base md:text-lg font-bold rounded-2xl md:rounded-[2.5rem] outline-none border-4 border-transparent transition-all shadow-inner ${
                isDark 
                  ? 'bg-white/5 focus:border-[#D9FF00] text-white placeholder:text-slate-600' 
                  : 'bg-slate-50 focus:border-blue-600 text-slate-800'
              }`}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`absolute right-2 md:right-3 top-2 md:top-3 p-3 md:p-4 rounded-xl md:rounded-3xl shadow-xl transition-all active:scale-90 disabled:opacity-50 ${
                isDark ? 'bg-[#D9FF00] text-black hover:bg-[#c2e600]' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Send size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
          <p className="text-[8px] md:text-[10px] text-center text-slate-500 mt-3 md:mt-5 font-black uppercase tracking-[0.2em] opacity-60">
            Akshara AI Companion • Karnataka Board SSLC Syllabus 2025-26
          </p>
        </div>
      </div>
    </div>
  );
}
