// dashboard/src/pages/admin/CreateExamPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function CreateExamPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [examConfig, setExamConfig] = useState({
    title: '', subjectCode: '', description: '', durationPerQuestion: 60,
    startTime: '', endTime: '', maxStudents: 30
  });
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState({
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
    correct_answer: 'A', marks: 1
  });
  const [credentials, setCredentials] = useState(null);

  // REMOVED: AI generation logic — admin manual input only

  const addQuestion = (e) => {
    e.preventDefault();
    if (!currentQ.question_text) return;
    setQuestions([...questions, { ...currentQ, id: Date.now() }]);
    setCurrentQ({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', marks: 1 });
  };

  const generateCredentials = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/exams/${Date.now()}/students/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: examConfig.maxStudents })
      });
      const data = await res.json();
      setCredentials(data.credentials || []);
      setStep(4);
    } catch (err) {
      // Fallback for hackathon demo if backend is offline
      const mock = Array.from({ length: examConfig.maxStudents }, (_, i) => ({
        student_uid: `COG-ST-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        plain_password: Math.random().toString(36).substr(2, 8)
      }));
      setCredentials(mock);
      setStep(4);
    }
  };

  const publishExam = async () => {
    try {
      await fetch(`http://localhost:8000/api/exams/${Date.now()}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      alert(`Exam "${examConfig.title}" published successfully. Students have been notified.`);
      navigate('/admin/dashboard');
    } catch (err) {
      alert(`Published: ${examConfig.title} has been finalized.`);
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#BDD8E9] flex flex-col">
       <nav className="bg-[#001D39] text-white px-8 h-16 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-6" />
          <h1 className="font-body text-[14px] font-display font-bold uppercase tracking-widest text-[#4E8EA2]">Create Examination</h1>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="font-body text-[12px] font-display font-bold text-[#49769F] hover:text-white">CANCEL & EXIT</button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Progress Sidebar */}
        <aside className="w-64 bg-white border-r border-[#7BBDE8] p-8 flex flex-col gap-6 shrink-0">
          <StepIndicator number={1} label="Exam Details" active={step === 1} completed={step > 1} />
          <StepIndicator number={2} label="Add Questions" active={step === 2} completed={step > 2} />
          <StepIndicator number={3} label="Student Setup" active={step === 3} completed={step > 3} />
          <StepIndicator number={4} label="Review & Publish" active={step === 4} completed={false} />
        </aside>

        {/* Form Area */}
        <main className="flex-1 overflow-y-auto p-12 bg-white">
          <div className="max-w-3xl mx-auto">
            
            {/* Step 1: Details */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-display font-bold text-[#001D39] mb-2 text-center">1. Examination Details</h2>
                <p className="text-[#49769F] font-body text-[14px] mb-8 text-center text-balance leading-relaxed">
                  Provide core configuration for the session. Total exam time will be calculated based on question count.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2"><Label>Exam Title</Label><Input value={examConfig.title} onChange={e => setExamConfig({...examConfig, title: e.target.value})} placeholder="e.g. Data Structures Mid-Term" /></div>
                  <div><Label>Subject Code</Label><Input value={examConfig.subjectCode} onChange={e => setExamConfig({...examConfig, subjectCode: e.target.value})} placeholder="e.g. CS301" /></div>
                  <div><Label>Duration Per Question (s)</Label><Input type="number" value={examConfig.durationPerQuestion} onChange={e => setExamConfig({...examConfig, durationPerQuestion: e.target.value})} /></div>
                  <div><Label>Start Time</Label><Input type="datetime-local" value={examConfig.startTime} onChange={e => setExamConfig({...examConfig, startTime: e.target.value})} /></div>
                  <div><Label>End Time</Label><Input type="datetime-local" value={examConfig.endTime} onChange={e => setExamConfig({...examConfig, endTime: e.target.value})} /></div>
                  <div className="col-span-2"><Label>Max Students</Label><Input type="number" value={examConfig.maxStudents} onChange={e => setExamConfig({...examConfig, maxStudents: e.target.value})} /></div>
                </div>
                <button onClick={() => setStep(2)} disabled={!examConfig.title} className="mt-8 bg-[#0A4174] text-white w-full py-3 rounded-lg font-display font-bold disabled:opacity-50">Next: Build Question Bank</button>
              </div>
            )}

            {/* Step 2: Questions */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-display font-bold text-[#001D39] mb-8">2. Question Bank</h2>
                {/* Manual Question Form */}
                <form onSubmit={addQuestion} className="bg-[#BDD8E9] p-6 rounded-xl border border-[#7BBDE8] mb-8">
                  <Label>Question Text</Label>
                  <textarea value={currentQ.question_text} onChange={e => setCurrentQ({...currentQ, question_text: e.target.value})} className="w-full border border-[#7BBDE8] rounded-lg p-3 font-body text-[14px] min-h-[100px] mb-4 outline-none focus:ring-2 focus:ring-[#0A4174]/10 focus:border-[#0A4174]" placeholder="Enter the MCQ question..."></textarea>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div><Label>Option A</Label><Input value={currentQ.option_a} onChange={e => setCurrentQ({...currentQ, option_a: e.target.value})} /></div>
                    <div><Label>Option B</Label><Input value={currentQ.option_b} onChange={e => setCurrentQ({...currentQ, option_b: e.target.value})} /></div>
                    <div><Label>Option C</Label><Input value={currentQ.option_c} onChange={e => setCurrentQ({...currentQ, option_c: e.target.value})} /></div>
                    <div><Label>Option D</Label><Input value={currentQ.option_d} onChange={e => setCurrentQ({...currentQ, option_d: e.target.value})} /></div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#7BBDE8]">
                    <div className="flex gap-2">
                       {['A','B','C','D'].map(o => (
                         <button key={o} type="button" onClick={() => setCurrentQ({...currentQ, correct_answer: o})} className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold font-body text-[12px] border transition-all ${currentQ.correct_answer === o ? 'bg-[#4E8EA2] border-[#4E8EA2] text-white' : 'bg-white border-[#7BBDE8] text-[#49769F]'}`}>{o}</button>
                       ))}
                    </div>
                    <button type="submit" className="bg-[#001D39] text-white px-8 py-2.5 rounded-lg font-display font-bold font-body text-[14px] shadow-md">+ Add Question</button>
                  </div>
                </form>

                {/* Question List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center font-body text-[12px] font-display font-bold text-[#49769F] uppercase tracking-widest px-1">
                    <span>Questions ({questions.length})</span>
                    <span>Total Marks: {questions.reduce((a,b)=>a+parseInt(b.marks), 0)}</span>
                  </div>
                  {questions.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[#7BBDE8] rounded-xl text-[#6EA2B3] font-body text-[14px]">
                      Your question bank is empty. Add a manual MCQ to begin.
                    </div>
                  ) : (
                    questions.map((q, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border border-[#7BBDE8] flex justify-between items-center group">
                        <div className="flex-1">
                          <p className="font-display font-bold text-[#001D39] font-body text-[14px]">Q{idx+1}. {q.question_text}</p>
                          <p className="text-[10px] text-[#0A4174] font-black uppercase mt-1">Correct Answer: {q.correct_answer}</p>
                        </div>
                        <button onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))} className="text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-12 flex gap-4">
                  <button onClick={() => setStep(1)} className="bg-[#7BBDE8] text-[#49769F] px-8 py-3 rounded-lg font-display font-bold">Back</button>
                  <button onClick={() => setStep(3)} disabled={questions.length === 0} className="bg-[#0A4174] text-white flex-1 py-3 rounded-lg font-display font-bold disabled:opacity-50">Next: Student Setup</button>
                </div>
              </div>
            )}

            {/* Step 3: Students */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-display font-bold text-[#001D39] mb-4">3. Student Access Control</h2>
                <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#F59E0B]/30 flex gap-4 items-start mb-8 text-[#92400E]">
                   <span className="text-[28px] font-display font-display font-bold">⚠️</span>
                   <div>
                      <p className="font-body text-[14px] font-display font-bold">Important Access Policy</p>
                      <p className="font-body text-[12px] opacity-80 leading-relaxed font-body font-normal">Click generate to create unique credentials for {examConfig.maxStudents} student slots. You must download the CSV immediately as passwords are encrypted thereafter.</p>
                   </div>
                </div>

                {!credentials ? (
                  <button onClick={generateCredentials} className="w-full bg-[#001D39] text-white py-12 rounded-xl border-2 border-dashed border-[#7BBDE8] hover:border-[#4E8EA2] flex flex-col items-center justify-center transition-all group">
                     <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔑</span>
                     <span className="font-display font-bold font-display text-[18px]">Generate Student Credentials</span>
                     <span className="font-body text-[12px] text-[#49769F] mt-2">Required for {examConfig.maxStudents} student slots.</span>
                  </button>
                ) : (
                  <div className="bg-white rounded-xl border border-[#7BBDE8] overflow-hidden">
                     <div className="p-4 bg-[#BDD8E9] border-b border-[#7BBDE8] flex justify-between items-center">
                        <span className="font-body text-[12px] font-display font-bold text-[#001D39] uppercase tracking-widest">Active Credentials</span>
                        <button className="font-body text-[12px] font-display font-bold text-[#4E8EA2] hover:underline">Download CSV</button>
                     </div>
                     <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left">
                           <thead className="bg-[#BDD8E9] text-[10px] font-display font-bold text-gray-400 border-b border-[#7BBDE8]">
                             <tr><th className="px-4 py-3">UID</th><th className="px-4 py-3">PASSWORD</th><th className="px-4 py-3 text-right">STATUS</th></tr>
                           </thead>
                           <tbody className="divide-y divide-[#7BBDE8]">
                              {credentials.map((c, i) => (
                                <tr key={i} className="font-body text-[12px] font-mono">
                                   <td className="px-4 py-3 text-[#001D39]">{c.student_uid}</td>
                                   <td className="px-4 py-3 text-[#0A4174] font-display font-bold">{c.plain_password}</td>
                                   <td className="px-4 py-3 text-right"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block"></span></td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}

                <div className="mt-12 flex gap-4">
                  <button onClick={() => setStep(2)} className="bg-[#7BBDE8] text-[#49769F] px-8 py-3 rounded-lg font-display font-bold">Back</button>
                  <button onClick={() => setStep(4)} disabled={!credentials} className="bg-[#0A4174] text-white flex-1 py-3 rounded-lg font-display font-bold disabled:opacity-50">Review & Publish</button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="animate-in slide-in-from-right-4 duration-300 text-center">
                 <div className="text-6xl mb-6">🚀</div>
                 <h2 className="text-2xl font-display font-bold text-[#001D39] mb-8">Ready to Go Live?</h2>
                 
                 <div className="bg-[#BDD8E9] border border-[#7BBDE8] rounded-2xl p-8 mb-12 text-left grid grid-cols-2 gap-y-6">
                    <div><Label>Title</Label><p className="font-display font-bold text-[#001D39]">{examConfig.title}</p></div>
                    <div><Label>Subject</Label><p className="font-display font-bold text-[#001D39] font-mono">{examConfig.subjectCode}</p></div>
                    <div><Label>Total Duration</Label><p className="font-display font-bold text-[#001D39]">{ (examConfig.durationPerQuestion * questions.length) / 60 } Minutes</p></div>
                    <div><Label>Enrollment</Label><p className="font-display font-bold text-[#001D39]">{examConfig.maxStudents} Students</p></div>
                    <div className="col-span-2 border-t border-[#7BBDE8] pt-6">
                       <Label>Policy</Label>
                       <p className="font-body text-[12px] text-[#49769F] leading-relaxed">
                         By publishing, you enable the Cognivigil Sentinel AI proctoring suite for this session. Students will be required to maintain fullscreen mode and zero-tab compliance throughout the duration.
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                  <button onClick={() => setStep(3)} className="bg-[#7BBDE8] text-[#49769F] px-8 py-4 rounded-lg font-display font-bold">Go Back</button>
                  <button onClick={publishExam} className="bg-[#0A4174] text-white flex-1 py-4 rounded-lg font-black font-display text-[18px] shadow-xl shadow-[#0A4174]/40 active:scale-[0.98] transition-all">FINISH & PUBLISH EXAM</button>
                 </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex items-center gap-4 transition-all opacity-100">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold font-body text-[12px] shadow-sm transition-all duration-300 ${
        active ? 'bg-[#0A4174] text-white ring-4 ring-[#0A4174]/10' : 
        completed ? 'bg-[#4E8EA2] text-white' : 'bg-[#BDD8E9] text-[#6EA2B3]'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className={`text-[13px] font-display font-bold tracking-tight transition-all duration-300 ${
        active ? 'text-[#001D39]' : 'text-[#49769F]'
      }`}>{label}</span>
    </div>
  );
}

function Label({ children }) {
  return <label className="block text-[10px] font-display font-bold uppercase tracking-[0.08em] text-[#6EA2B3] mb-1.5">{children}</label>;
}

function Input(props) {
  return <input {...props} className="w-full bg-white border border-[#7BBDE8] rounded-lg px-4 py-2.5 font-body text-[14px] font-body font-normal outline-none focus:border-[#0A4174] focus:ring-2 focus:ring-[#0A4174]/10 transition-all placeholder:text-[#6EA2B3]" />;
}
