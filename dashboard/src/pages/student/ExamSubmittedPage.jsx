// dashboard/src/pages/student/ExamSubmittedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoDark from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function ExamSubmittedPage() {
  const navigate = useNavigate();
  const summary = {
    uid: 'COG-ST-A1B2C3',
    violations: 4,
    raw: 18,
    deductions: 1,
    final: 85,
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8 font-inter">
      <div className="max-w-xl w-full bg-white rounded-[32px] border border-[#E2E8F0] shadow-2xl overflow-hidden p-12 text-center">
        
        <div className="mb-10 relative">
           <div className="w-24 h-24 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto text-[#14B8A6]">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
           </div>
           <div className="absolute inset-x-0 top-0 flex items-center justify-center bg-[#14B8A6]/5 animate-ping w-24 h-24 rounded-full mx-auto -z-10"></div>
        </div>

        <h1 className="text-3xl font-black text-[#0B1F3B] tracking-tighter mb-2 italic uppercase">Submission Successful</h1>
        <p className="text-[#64748B] text-sm mb-12">Your responses have been securely logged and analyzed for integrity.</p>

        <div className="grid grid-cols-2 gap-4 mb-12">
           <Record label="Student UID" value={summary.uid} mono />
           <Record label="Time" value={summary.timestamp} />
           <Record label="Proctoring Log" value={`${summary.violations} Breaches Recorded`} danger={summary.violations > 0} />
           <Record label="Status" value="VERIFIED" success />
        </div>

        {/* Score Card */}
        <div className="bg-[#0B1F3B] rounded-2xl p-8 mb-12 flex items-center justify-between shadow-xl">
           <div className="text-left">
              <p className="text-[#64748B] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Final Performance</p>
              <h2 className="text-[#F8FAFC] text-4xl font-black">{summary.final}%</h2>
           </div>
           <div className="text-right space-y-1">
              <p className="text-white/40 text-[10px] font-bold">Raw Score: {summary.raw}/20</p>
              <p className="text-[#EF4444] text-[10px] font-bold italic">Deductions: -{summary.deductions}</p>
           </div>
        </div>

        <button 
           onClick={() => navigate('/')}
           className="text-[11px] font-black uppercase tracking-widest text-[#2563EB] hover:tracking-[0.3em] transition-all"
        >
           Return to Terminal Screen
        </button>

        <div className="mt-12 flex items-center justify-center gap-4 border-t border-[#E2E8F0] pt-8 grayscale opacity-50">
           <img src={logoDark} alt="Cognivigil" className="h-5" />
           <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Powered by Sentinel AI</p>
        </div>
      </div>
    </div>
  );
}

function Record({ label, value, mono, danger, success }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl text-left">
       <p className="text-[9px] font-black uppercase text-[#94A3B8] tracking-widest mb-1.5">{label}</p>
       <p className={`text-xs font-bold ${mono ? 'font-mono' : ''} ${danger ? 'text-[#EF4444]' : success ? 'text-[#14B8A6]' : 'text-[#0B1F3B]'}`}>{value}</p>
    </div>
  );
}
