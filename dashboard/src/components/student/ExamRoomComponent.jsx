// dashboard/src/components/student/ExamRoomComponent.jsx
// NEW: Self-Contained Exam Engine with Sentinel Integration

import { useState, useEffect, useCallback } from 'react';

export default function ExamRoomComponent({ examData, studentUid, sessionId, onComplete }) {
  const [sentinelReady, setSentinelReady] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(examData.duration * 60);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // ── SENTINEL ACTIVATION ────────────────────────────────────
  useEffect(() => {
    // 1. Send activation message to extension
    if (window.chrome?.runtime?.sendMessage) {
      window.chrome.runtime.sendMessage({ 
        type: 'SENTINEL_ACTIVATE', 
        sessionId, 
        studentUid 
      }, (res) => {
        if (res?.sentinelActive) setSentinelReady(true);
      });

      // 2. Listen for real-time violation updates from background.js
      const listener = (msg) => {
        if (msg.type === 'VIOLATION_COUNT_UPDATE') {
          setViolationCount(msg.count);
          if (msg.count === 3) setShowWarning(true);
          if (msg.count > 3) alert(`Violation Detected! Score Deduction Applied.`);
        }
      };
      window.chrome.runtime.onMessage.addListener(listener);
      return () => {
         window.chrome.runtime.onMessage.removeListener(listener);
         window.chrome.runtime.sendMessage({ type: 'SENTINEL_DEACTIVATE' });
      };
    } else {
      alert('SENTINEL CRITICAL ERROR: Extension not detected. Return to proctor.');
    }
  }, [sessionId, studentUid]);

  // ── TIMER ──────────────────────────────────────────────────
  useEffect(() => {
    if (!sentinelReady) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sentinelReady]);

  const handleSubmit = useCallback(async () => {
    const res = await fetch('http://localhost:8000/api/student/exam/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${window.sessionStorage.getItem('examToken')}` },
      body: JSON.stringify({ studentUid, answers, sessionId })
    });
    const data = await res.json();
    onComplete(data.report);
  }, [studentUid, answers, sessionId, onComplete]);

  const questions = examData.questions || [];
  const currentQ = questions[currentIdx];

  if (!sentinelReady) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
        <h2 className="text-xl font-bold text-white tracking-widest">INITIALISING SENTINEL...</h2>
        <p className="text-gray-500 text-sm mt-2">Connecting to Secure Proctoring Client</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex font-sans">
      {/* Question Navigator */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Navigator</h2>
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, idx) => (
            <button
               key={idx}
               onClick={() => setCurrentIdx(idx)}
               className={`h-10 rounded-lg text-xs font-bold transition-all ${
                 currentIdx === idx ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' :
                 answers[questions[idx].id] ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-400'
               }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-gray-800">
           <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold text-white shadow-xl shadow-blue-900/20 text-sm">Submit Exam</button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col">
        {/* Header Bar */}
        <header className="h-20 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8">
          <div>
            <h1 className="text-lg font-bold text-white">{examData.title}</h1>
            <p className="text-[10px] text-gray-500 uppercase font-mono">{studentUid}</p>
          </div>
          <div className="flex items-center gap-8">
             <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase mb-1">Time Remaining</p>
                <p className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </p>
             </div>
             <div className="flex flex-col items-center">
                <p className="text-[10px] text-gray-500 uppercase mb-1">Violations</p>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${violationCount > 2 ? 'bg-red-600 text-white animate-bounce' : 'bg-gray-800 text-gray-400'}`}>
                  {violationCount}
                </div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        {currentQ && (
          <div className="flex-1 p-12 max-w-4xl">
             <p className="text-gray-500 text-sm mb-2 font-mono uppercase tracking-widest">Question {currentIdx + 1} of {questions.length}</p>
             <h3 className="text-2xl font-bold text-white leading-relaxed mb-12">{currentQ.question_text}</h3>
             
             <div className="space-y-4">
                {['a','b','c','d'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAnswers({...answers, [currentQ.id]: opt.toUpperCase()})}
                    className={`w-full group text-left px-6 py-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      answers[currentQ.id] === opt.toUpperCase() 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                       answers[currentQ.id] === opt.toUpperCase() ? 'bg-blue-400 text-white' : 'bg-gray-800 group-hover:bg-gray-700 text-gray-400'
                    }`}>
                      {opt.toUpperCase()}
                    </div>
                    {currentQ[`option_${opt}`]}
                  </button>
                ))}
             </div>

             <div className="mt-12 flex justify-between">
                <button 
                  disabled={currentIdx === 0} 
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="px-8 py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-30"
                >
                  Previous
                </button>
                <button 
                  disabled={currentIdx === questions.length - 1} 
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-xl shadow-blue-900/20"
                >
                  Next Question
                </button>
             </div>
          </div>
        )}
      </main>

      {/* ── VIOLATION WARNING MODAL ── */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2147483645] flex items-center justify-center p-6">
           <div className="bg-red-950 border-2 border-red-600 p-10 rounded-3xl max-w-md text-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
              <div className="text-6xl mb-6 scale-125 animate-pulse">⚠️</div>
              <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter">CRITICAL WARNING</h2>
              <div className="space-y-4 text-red-200">
                <p className="font-bold text-xl">THREE VIOLATIONS DETECTED</p>
                <p className="text-sm opacity-80 leading-relaxed font-semibold">
                  EVERY ADDITIONAL BREACH WILL RESULT IN A MANDATORY SCORE DEDUCTION. YOUR EXAMINER HAS BEEN NOTIFIED.
                </p>
              </div>
              <button 
                onClick={() => setShowWarning(false)}
                className="mt-10 bg-white text-red-900 px-10 py-4 rounded-xl font-black text-lg tracking-tight hover:scale-105 transition-transform"
              >
                I UNDERSTAND — PROCEED
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
