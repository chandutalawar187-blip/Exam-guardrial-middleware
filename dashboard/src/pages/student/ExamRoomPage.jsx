// dashboard/src/pages/student/ExamRoomPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function ExamRoomPage() {
  const navigate = useNavigate();
  const [init, setInit] = useState(false);
  const [curr, setCurr] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(3600); // 60 mins
  const [violations, setViolations] = useState(0);
  const [showWarn, setShowWarn] = useState(false);

  const studentUid = 'COG-ST-A1B2C3';
  const examTitle = 'Data Structures Advanced';
  const questions = [
    { id: 1, text: 'Which data structure is best for BFS implementation?', a: 'Stack', b: 'Queue', c: 'Heap', d: 'Tree', ans: 'B' },
    { id: 2, text: 'Time complexity of Merge Sort in average case?', a: 'O(n)', b: 'O(n²)', c: 'O(n log n)', d: 'O(log n)', ans: 'C' }
  ];

  // ── SENTINEL ACTIVATION ────────────────────────────────────
  useEffect(() => {
    const activateSentinel = () => {
      if (window.chrome?.runtime?.sendMessage) {
        window.chrome.runtime.sendMessage({ 
          type: 'SENTINEL_ACTIVATE', 
          sessionId: 'SES-99231', 
          studentUid 
        }, (res) => {
          if (res?.sentinelActive) setTimeout(() => setInit(true), 1500);
        });

        // Listen for violations from background
        const vListener = (msg) => {
          if (msg.type === 'VIOLATION_COUNT_UPDATE') {
            setViolations(msg.count);
            if (msg.count === 3) setShowWarn(true);
          }
        };
        window.chrome.runtime.onMessage.addListener(vListener);
        return () => window.chrome.runtime.onMessage.removeListener(vListener);
      } else {
        // Mock init for dev without extension
        setTimeout(() => setInit(true), 2000);
      }
    };
    activateSentinel();
  }, []);

  // ── TIMER ──────────────────────────────────────────────────
  useEffect(() => {
    if (!init) return;
    const t = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [init]);

  const handleSubmit = async () => {
    if (window.chrome?.runtime?.sendMessage) {
      window.chrome.runtime.sendMessage({ type: 'SENTINEL_DEACTIVATE' });
    }
    navigate('/exam/submitted');
  };

  if (!init) {
    return (
      <div className="min-h-screen bg-[#0B1F3B] flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div className="ring-overlay animate-pulse-teal" style={{ width: '500px', height: '500px' }}></div>
        </div>
        <img src={logoLight} alt="Cognivigil" className="h-16 mb-8 relative z-10 animate-pulse" />
        <div className="flex flex-col items-center relative z-10">
           <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mb-4"></div>
           <h2 className="text-[#F8FAFC] text-xl font-black italic tracking-tighter">Initialising Secure Proctored Environment...</h2>
           <p className="text-[#64748B] text-xs font-bold uppercase tracking-[0.2em] mt-2">Connecting to Sentinel AI Suite</p>
        </div>
      </div>
    );
  }

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Top Bar */}
      <header className="h-20 bg-[#0B1F3B] text-white flex items-center justify-between px-8 border-b-2 border-[#14B8A6] shrink-0">
        <div className="flex items-center gap-4">
          <img src={logoLight} alt="Icon" className="h-6" />
          <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
          <div>
            <h1 className="text-sm font-black italic">{examTitle}</h1>
            <p className="text-[10px] font-bold text-[#64748B] tracking-widest">CS301 • MID-TERM</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#64748B] mb-1">Time Remaining</p>
            <p className={`text-2xl font-black tabular-nums tracking-tighter ${timer < 300 ? 'text-[#EF4444] animate-pulse' : 'text-[#14B8A6]'}`}>{fmtTime(timer)}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
              <p className="text-[9px] font-black uppercase text-[#64748B]">UID</p>
              <p className="text-xs font-mono font-bold">{studentUid}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border shadow-lg flex items-center gap-2 ${violations > 2 ? 'bg-[#EF4444] border-[#EF4444] animate-bounce' : 'bg-white/10 border-white/20'}`}>
              <div className={`w-2 h-2 rounded-full ${violations > 2 ? 'bg-white' : 'bg-[#14B8A6] animate-pulse'}`}></div>
              <span className="text-xs font-black uppercase tracking-widest">{violations} Breaches</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Navigator Sidebar */}
        <aside className="w-[200px] border-r border-[#E2E8F0] p-6 shrink-0 bg-[#F8FAFC]">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-6">Question Navigator</p>
           <div className="grid grid-cols-4 gap-2">
             {questions.map((_, i) => (
               <button 
                  key={i} 
                  onClick={() => setCurr(i)}
                  className={`h-9 rounded-lg font-black text-[11px] transition-all ${
                    curr === i ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/40 scale-110' : 
                    answers[questions[i].id] ? 'bg-[#14B8A6] text-white' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                  }`}
               >
                 {i+1}
               </button>
             ))}
           </div>
           <button onClick={handleSubmit} className="mt-12 w-full bg-[#0B1F3B] hover:bg-[#1E3A5F] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md">Submit Exam</button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto p-12 bg-white flex flex-col items-center">
          <div className="max-w-2xl w-full">
             <div className="flex items-center gap-3 mb-4">
               <span className="text-[#2563EB] font-black text-sm tracking-tighter">QUESTION {curr+1} / {questions.length}</span>
               <div className="h-[1px] flex-1 bg-[#E2E8F0]"></div>
             </div>
             
             <h2 className="text-[22px] font-bold text-[#0B1F3B] leading-[1.4] mb-12">{questions[curr].text}</h2>
             
             <div className="space-y-4">
               {['a','b','c','d'].map(opt => (
                 <button
                    key={opt}
                    onClick={() => setAnswers({...answers, [questions[curr].id]: opt.toUpperCase()})}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      answers[questions[curr].id] === opt.toUpperCase() 
                      ? 'bg-[#EFF6FF] border-[#2563EB] border-2 shadow-sm' 
                      : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                         answers[questions[curr].id] === opt.toUpperCase() ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#E2E8F0]'
                       }`}>{opt.toUpperCase()}</div>
                       <span className={`font-semibold text-base ${answers[questions[curr].id] === opt.toUpperCase() ? 'text-[#0B1F3B]' : 'text-[#64748B]'}`}>{questions[curr][opt]}</span>
                    </div>
                    {answers[questions[curr].id] === opt.toUpperCase() && (
                      <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center">
                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                 </button>
               ))}
             </div>

             <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#E2E8F0]">
                <button onClick={() => setCurr(v => Math.max(0, v-1))} disabled={curr === 0} className="flex items-center gap-2 text-xs font-bold text-[#64748B] hover:text-[#0B1F3B] disabled:opacity-20 transition-all uppercase tracking-widest"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Previous</button>
                <div className="flex gap-2">
                   {questions.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${curr === i ? 'w-8 bg-[#2563EB]' : 'w-1.5 bg-[#E2E8F0]'}`}></div>)}
                </div>
                <button onClick={() => setCurr(v => Math.min(questions.length-1, v+1))} disabled={curr === questions.length-1} className="flex items-center gap-2 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] disabled:opacity-0 transition-all uppercase tracking-widest">Next <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
             </div>
          </div>
        </main>
      </div>

      {/* ── VIOLATION WARNING MODAL ── */}
      {showWarn && (
        <div className="fixed inset-0 bg-[#0B1F3B]/80 backdrop-blur-md z-[2147483645] flex items-center justify-center p-6">
           <div className="bg-[#0B1F3B] border-t-8 border-[#F59E0B] p-10 rounded-[28px] max-w-sm text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
              <div className="text-6xl mb-6 scale-125 animate-bounce">⚠️</div>
              <h2 className="text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Warning</h2>
              <p className="text-[#F8FAFC] font-bold text-sm mb-6 leading-relaxed">
                THREE VIOLATIONS DETECTED. EVERY FURTHER ACTION WILL RESULT IN A MANDATORY -1 MARK DEDUCTION.
              </p>
              <div className="bg-[#1E3A5F] p-4 rounded-xl text-xs text-[#F59E0B] font-bold uppercase tracking-widest mb-8 border border-[#F59E0B]/20">
                 DEDUCTIONS ARE ACTIVE
              </div>
              <button 
                onClick={() => setShowWarn(false)}
                className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-black text-sm tracking-widest uppercase hover:bg-[#1D4ED8] transition-all active:scale-95"
              >
                I Understand — PROCEED
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
