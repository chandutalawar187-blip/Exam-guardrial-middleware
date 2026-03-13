// dashboard/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoDark from '../assets/logo/Cognivigil_logo_full_dark.svg';

export default function LoginPage() {
  const [role, setRole] = useState('Student'); // Student | Admin
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (role === 'Admin') {
      if (uid === 'ADMIN001' && password === 'cognivigil@admin') {
        login('admin', uid, 'dummy-admin-token');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid Admin credentials.');
      }
      setIsLoading(false);
      return;
    }

    // Student Login
    try {
      const res = await fetch('http://localhost:8000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, password })
      });
      const data = await res.json();
      if (res.ok) {
        login('student', uid, data.token);
        navigate('/exam/waiting');
      } else {
        setError(data.error || 'Invalid credentials. Please check your Student ID and Password.');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0B1F3B] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Animated Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="ring-overlay animate-pulse-teal" style={{ width: '400px', height: '400px' }}></div>
          <div className="ring-overlay animate-pulse-teal" style={{ width: '600px', height: '600px', animationDelay: '1s' }}></div>
          <div className="ring-overlay animate-pulse-teal" style={{ width: '800px', height: '800px', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          <img src={logoDark} alt="Cognivigil Logo" className="h-24 mx-auto mb-6" />
          <p className="text-[#14B8A6] uppercase tracking-[0.2em] font-semibold text-sm mb-12">
            Intelligent Exam Integrity. Powered by AI.
          </p>
          <div className="flex gap-4 justify-center">
            <FeaturePill text="🛡 Sentinel Protection" />
            <FeaturePill text="🧠 AI Monitoring" />
            <FeaturePill text="📊 Instant Reports" />
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-[#E2E8F0]">
          {/* Role Toggle */}
          <div className="flex bg-[#F1F5F9] p-1 rounded-full mb-8 relative">
            <button 
              onClick={() => setRole('Student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all z-10 ${
                role === 'Student' ? 'text-white' : 'text-[#64748B]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              Student
            </button>
            <button 
              onClick={() => setRole('Admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all z-10 ${
                role === 'Admin' ? 'text-white' : 'text-[#64748B]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Admin
            </button>
            {/* Toggle Background Slide */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-all duration-200 ${
                role === 'Student' ? 'left-1 bg-[#2563EB]' : 'left-[calc(50%+2px)] bg-[#0B1F3B]'
              }`}
            ></div>
          </div>

          <h2 className="text-xl font-bold text-[#0B1F3B] mb-2">{role} Access</h2>
          <p className="text-[#64748B] text-sm mb-6">
            Please enter your credentials to {role === 'Student' ? 'enter the exam room' : 'access the portal'}.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#64748B] text-[12px] font-medium uppercase tracking-[0.06em] mb-1.5">
                {role === 'Student' ? 'Student UID' : 'Admin ID'}
              </label>
              <input 
                type="text" 
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder={role === 'Student' ? "Enter your unique exam ID" : "ADMIN001"}
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm font-medium focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all placeholder:text-[#cbd5e1]"
                required
              />
            </div>

            <div>
              <label className="block text-[#64748B] text-[12px] font-medium uppercase tracking-[0.06em] mb-1.5">
                Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 text-sm font-medium focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all placeholder:text-[#cbd5e1]"
                required
              />
            </div>

            {error && (
              <p className="text-[#EF4444] text-xs font-bold mt-2 leading-tight">
                ⚠️ {error}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-lg text-white font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                role === 'Student' ? 'bg-[#2563EB] hover:bg-[#1D4ED8]' : 'bg-[#0B1F3B] hover:bg-[#1E3A5F]'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {role === 'Student' ? 'Enter Exam Room' : 'Access Admin Portal'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center text-[#94A3B8] text-[11px] font-medium tracking-wide">
            COGNIVIGIL V2.0 — SECURE EXAM PLATFORM
          </footer>
        </div>
      </div>
    </div>
  );
}

function FeaturePill({ text }) {
  return (
    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
      <span className="text-white text-xs font-semibold">{text}</span>
    </div>
  );
}
