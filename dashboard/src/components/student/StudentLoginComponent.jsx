// dashboard/src/components/student/StudentLoginComponent.jsx
// NEW: Student Authentication Portal

import { useState } from 'react';

export default function StudentLoginComponent({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ uid: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      
      if (res.ok) {
        onLoginSuccess(data.token, data.examData, data.studentUid);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🛡️</div>
        <h1 className="text-2xl font-bold text-white tracking-widest">SENTINEL EXAM PORTAL</h1>
        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Self-Contained Secure Client</p>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Student UID</label>
            <input 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-700 outline-none focus:border-blue-500 transition-colors"
              placeholder="EXAM-ST-XXXXX" 
              required
              onChange={e => setCredentials({...credentials, uid: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Access Password</label>
            <input 
              type="password"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-700 outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••" 
              required
              onChange={e => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold bg-red-900/20 p-3 rounded-lg border border-red-900/40">⚠️ {error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-900/40 transition-all transform active:scale-95"
          >
            {isLoading ? 'SECURE LOGIN...' : 'VERIFY & ENTER EXAM'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-[10px] mt-6 leading-relaxed">
          BY LOGGING IN, YOU ACKNOWLEDGE THIS SESSION IS MONITORED BY SENTINEL AI OVERLAY DETECTION AND OS-LEVEL BACKGROUND PROCESS FORENSICS.
        </p>
      </div>
    </div>
  );
}
