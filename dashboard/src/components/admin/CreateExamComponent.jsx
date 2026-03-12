// dashboard/src/components/admin/CreateExamComponent.jsx
import { useState } from 'react';

export default function CreateExamComponent() {
  const [examInfo, setExamInfo] = useState({ 
    title: '', 
    subject_code: '', 
    duration_minutes: 60, 
    start_time: '', 
    end_time: '' 
  });
  const [questions, setQuestions] = useState([]);
  const [aiParams, setAiParams] = useState({ topic: '', difficulty: 'medium', count: 5 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', '', '', ''], correct_option: 0, marks: 1 }]);
  };

  const generateAiQuestions = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:8000/api/exams/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiParams)
      });
      const data = await res.json();
      if (data.questions) {
        setQuestions([...questions, ...data.questions]);
      } else {
        alert('Failed to generate questions');
      }
    } catch (err) {
      alert('AI Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveExam = async () => {
    try {
      // 1. Create Question Paper
      const paperRes = await fetch('http://localhost:8000/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: examInfo.title, 
          subject_code: examInfo.subject_code, 
          questions 
        })
      });
      
      if (!paperRes.ok) {
        throw new Error('Failed to create question paper');
      }

      const paperData = await paperRes.json();

      // 2. Create Exam Session
      const sessionRes = await fetch('http://localhost:8000/api/exam-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject_code: examInfo.subject_code,
          start_time: examInfo.start_time || new Date().toISOString(),
          end_time: examInfo.end_time || new Date(Date.now() + examInfo.duration_minutes * 60000).toISOString(),
          duration_minutes: parseInt(examInfo.duration_minutes)
        })
      });

      if (!sessionRes.ok) {
        throw new Error('Failed to create exam session');
      }

      const sessionData = await sessionRes.json();
      setSuccessInfo(sessionData);
      
    } catch (err) {
      console.error(err);
      alert('Error saving exam: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 fade-in">
        
        <header className="mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight premium-gradient-text uppercase italic mb-2">Configure Sentinel Exam</h1>
          <p className="text-slate-500 font-mono tracking-widest text-[10px] uppercase">Secure Subject Allocation & Intelligence Generation</p>
        </header>

        {/* Exam Setup Section */}
        <section className="glass-panel p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h2 className="text-sm font-black text-blue-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="text-xl">1.</span> Meta Information
          </h2>
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Title</label>
              <input className="w-full bg-[#030816] border border-white/5 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-medium text-sm" placeholder="e.g. Data Structures 101" onChange={e => setExamInfo({...examInfo, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Code</label>
              <input className="w-full bg-[#030816] border border-white/5 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-medium text-sm uppercase" placeholder="CS101" onChange={e => setExamInfo({...examInfo, subject_code: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
              <input className="w-full bg-[#030816] border border-white/5 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-medium text-sm text-slate-300" type="datetime-local" onChange={e => setExamInfo({...examInfo, start_time: new Date(e.target.value).toISOString()})} />
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration (Min)</label>
                <input className="w-full bg-[#030816] border border-white/5 rounded-xl p-4 outline-none focus:border-blue-500/50 transition-all font-medium text-sm" type="number" value={examInfo.duration_minutes} onChange={e => setExamInfo({...examInfo, duration_minutes: e.target.value})} />
              </div>
            </div>
          </div>
        </section>

        {/* AI Question Generator Section */}
        <section className="glass-panel p-8 rounded-[32px] shadow-2xl relative overflow-hidden border border-purple-500/10">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <h2 className="text-sm font-black text-purple-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="text-xl">2.</span> Sentinel AI Generator
          </h2>
          <div className="flex gap-4 items-end relative z-10">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic Context</label>
              <input className="w-full bg-[#030816] border border-purple-500/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-medium text-sm placeholder:text-purple-900/40" placeholder="e.g. Database Indexing B-Trees" onChange={e => setAiParams({...aiParams, topic: e.target.value})} />
            </div>
            <div className="w-40 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complexity</label>
              <select className="w-full bg-[#030816] border border-purple-500/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-medium text-sm text-slate-300" onChange={e => setAiParams({...aiParams, difficulty: e.target.value})}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="w-32 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Count</label>
              <input className="w-full bg-[#030816] border border-purple-500/10 rounded-xl p-4 outline-none focus:border-purple-500/50 transition-all font-medium text-sm" type="number" min="1" max="20" value={aiParams.count} onChange={e => setAiParams({...aiParams, count: parseInt(e.target.value)})} />
            </div>
            <div>
              <button 
                  onClick={generateAiQuestions}
                  disabled={isGenerating}
                  className="bg-purple-600/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] min-w-[200px]"
              >
                {isGenerating ? 'Synthesizing...' : '✨ Generate AI Questions'}
              </button>
            </div>
          </div>
        </section>

        {/* Question List */}
        <section className="glass-panel p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="text-xl">3.</span> Corpus ({questions.length})
            </h2>
            <button onClick={addQuestion} className="bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all">
              + Add Override
            </button>
          </div>
          
          <div className="space-y-6 relative z-10">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-[#030816] p-6 rounded-[24px] border border-white/5 relative group">
                 <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                    {idx + 1}
                 </div>
                 <div className="ml-12">
                   <input className="w-full bg-transparent border-b border-white/10 pb-2 mb-4 focus:border-emerald-500 outline-none p-1 text-sm font-medium" value={q.question_text} placeholder="Matrix Question Parameter" onChange={e => {
                     const newQs = [...questions];
                     newQs[idx].question_text = e.target.value;
                     setQuestions(newQs);
                   }} />
                   
                   <div className="grid grid-cols-2 gap-4">
                     {q.options.map((optVal, optIdx) => (
                       <div key={optIdx} className={`flex items-center gap-3 p-2 rounded-xl border ${q.correct_option === optIdx ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5'}`}>
                         <button 
                           onClick={() => {
                             const newQs = [...questions];
                             newQs[idx].correct_option = optIdx;
                             setQuestions(newQs);
                           }}
                           className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black uppercase transition-colors ${q.correct_option === optIdx ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                         >
                           {String.fromCharCode(65 + optIdx)}
                         </button>
                         <input className="bg-transparent rounded p-1 flex-1 text-xs outline-none focus:border-b focus:border-white/20" value={optVal} placeholder={`Option ${optIdx + 1}`} onChange={e => {
                           const newQs = [...questions];
                           newQs[idx].options[optIdx] = e.target.value;
                           setQuestions(newQs);
                         }} />
                       </div>
                     ))}
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Save / Credentials Section */}
        <footer className="flex flex-col items-center gap-8 py-8 border-t border-white/5">
          <button onClick={saveExam} className="bg-blue-600 hover:bg-blue-500 px-16 py-5 rounded-2xl font-black text-[13px] text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)] tracking-[0.1em] uppercase transition-all duration-300 transform active:scale-[0.98]">
             Initialize Sentinel Protocol
          </button>
          
          {successInfo && (
            <div className="w-full bg-emerald-950/30 border border-emerald-500/20 p-8 rounded-[24px] fade-in relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-[40px] rounded-full"></div>
               <p className="text-emerald-400 text-xs mb-6 font-black tracking-[0.2em] uppercase flex items-center gap-3">
                 <span className="text-2xl">✅</span> Deployment Successful
               </p>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#020617] relative p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2">Subject Code</p>
                    <p className="text-2xl font-mono text-emerald-300 tracking-wider font-bold">{successInfo.subject_code}</p>
                  </div>
                  <div className="bg-[#020617] relative p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2">Active Session ID</p>
                    <p className="text-2xl font-mono text-emerald-300 tracking-wider font-bold">{successInfo.session_id}</p>
                  </div>
               </div>
               <p className="text-center text-emerald-500/50 text-[10px] uppercase font-bold tracking-widest mt-6">Share these credentials with candidates immediately.</p>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
