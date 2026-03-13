// dashboard/src/components/admin/CreateExamComponent.jsx
// NEW: Admin Exam Creation with AI Question Generator

import { useState } from 'react';

export default function CreateExamComponent() {
  const [examInfo, setExamInfo] = useState({ title: '', description: '', duration: 60, maxStudents: 10, scheduledAt: '' });
  const [questions, setQuestions] = useState([]);
  const [aiParams, setAiParams] = useState({ topic: '', difficulty: 'medium', count: 5 });
  const [credentials, setCredentials] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A', marks: 1 }]);
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
      setQuestions([...questions, ...data.questions]);
    } catch (err) {
      alert('AI Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveExam = async () => {
    const res = await fetch('http://localhost:8000/api/exams/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...examInfo, questions })
    });
    if (res.ok) {
        const data = await res.json();
        setCredentials(data.credentials);
        alert('Exam Created Successfully!');
    }
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-4">Create New Exam</h1>
      
      {/* Exam Setup Section */}
      <section className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">1. Exam Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <input className="bg-gray-800 border-gray-700 rounded-lg p-3" placeholder="Exam Title" onChange={e => setExamInfo({...examInfo, title: e.target.value})} />
          <input className="bg-gray-800 border-gray-700 rounded-lg p-3" type="datetime-local" onChange={e => setExamInfo({...examInfo, scheduledAt: e.target.value})} />
          <textarea className="bg-gray-800 border-gray-700 rounded-lg p-3 col-span-2" placeholder="Description" rows="3" onChange={e => setExamInfo({...examInfo, description: e.target.value})} />
          <div className="flex items-center gap-4">
            <label className="text-sm">Duration (Min):</label>
            <input className="bg-gray-800 border-gray-700 rounded-lg p-2 w-24" type="number" value={examInfo.duration} onChange={e => setExamInfo({...examInfo, duration: e.target.value})} />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm">Max Students:</label>
            <input className="bg-gray-800 border-gray-700 rounded-lg p-2 w-24" type="number" value={examInfo.maxStudents} onChange={e => setExamInfo({...examInfo, maxStudents: e.target.value})} />
          </div>
        </div>
      </section>

      {/* AI Question Generator Section */}
      <section className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">2. AI Question Generator</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-400 mb-1 block">Topic</label>
            <input className="bg-gray-800 border-gray-700 rounded-lg p-2 w-full" placeholder="e.g. Python Loops" onChange={e => setAiParams({...aiParams, topic: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Difficulty</label>
            <select className="bg-gray-800 border-gray-700 rounded-lg p-2" onChange={e => setAiParams({...aiParams, difficulty: e.target.value})}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <button 
                onClick={generateAiQuestions}
                disabled={isGenerating}
                className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg font-bold disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : '✨ Generate AI Questions'}
            </button>
          </div>
        </div>
      </section>

      {/* Question List */}
      <section className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-400">3. Questions ({questions.length})</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
               <input className="w-full bg-transparent border-b border-gray-600 mb-2 focus:border-blue-500 outline-none p-1" value={q.question_text} placeholder="Question Text" onChange={e => {
                 const newQs = [...questions];
                 newQs[idx].question_text = e.target.value;
                 setQuestions(newQs);
               }} />
               <div className="grid grid-cols-2 gap-2 text-sm">
                 {['a','b','c','d'].map(opt => (
                   <div key={opt} className="flex items-center gap-2">
                     <span className="uppercase text-gray-500">{opt}:</span>
                     <input className="bg-gray-700 rounded p-1 flex-1" value={q[`option_${opt}`]} onChange={e => {
                       const newQs = [...questions];
                       newQs[idx][`option_${opt}`] = e.target.value;
                       setQuestions(newQs);
                     }} />
                   </div>
                 ))}
               </div>
            </div>
          ))}
          <button onClick={addQuestion} className="w-full border-2 border-dashed border-gray-700 hover:border-blue-500 py-3 rounded-lg text-gray-500 hover:text-blue-400 transition-colors">+ Add Question Manually</button>
        </div>
      </section>

      {/* Save / Credentials Section */}
      <footer className="flex justify-between items-center">
        <button onClick={saveExam} className="bg-blue-600 hover:bg-blue-500 px-12 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/40">Finish and Generate Credentials</button>
        
        {credentials && (
          <div className="bg-green-900/20 border border-green-800 p-4 rounded-lg">
             <p className="text-green-400 text-sm mb-2 font-bold">⚠️ Copy these credentials now. They will not be shown again!</p>
             <div className="max-h-40 overflow-y-auto font-mono text-xs">
                {credentials.map((c, i) => (
                  <p key={i}>{c.student_uid} : {c.plain_password}</p>
                ))}
             </div>
          </div>
        )}
      </footer>
    </div>
  );
}
