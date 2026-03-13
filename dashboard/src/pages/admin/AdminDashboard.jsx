// dashboard/src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <nav className="bg-[#0B1F3B] text-[#F8FAFC] px-8 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-8" />
          <div className="flex gap-8 text-sm font-semibold tracking-wide h-16">
            <NavLink to="/admin/dashboard" label="Dashboard" active />
            <NavLink to="/admin/create-exam" label="Create Exam" />
            <NavLink to="/admin/students" label="Students" />
            <NavLink to="/admin/reports" label="Reports" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#14B8A6] px-3 py-1 rounded text-[10px] font-black uppercase">ADMIN001</div>
          <button onClick={() => navigate('/')} className="text-[#64748B] hover:text-[#F8FAFC] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1F3B]">Welcome back, Administrator</h1>
            <p className="text-[#64748B] text-sm mt-1">Monitor exam status and manage academic integrity in real-time.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/create-exam" className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#1D4ED8] transition-all">
              Create New Exam
            </Link>
            <Link to="/admin/reports" className="bg-[#0B1F3B] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#1E3A5F] transition-all">
              View All Reports
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Exams Created" value="12" icon="📋" color="#2563EB" />
          <StatCard label="Active Students" value="84" icon="👥" color="#14B8A6" />
          <StatCard label="Exams In Progress" value="3" icon="⏳" color="#F59E0B" />
          <StatCard label="Reports Generated" value="142" icon="📊" color="#0B1F3B" />
        </div>

        {/* Recent Exams Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
            <h2 className="font-bold text-[#0B1F3B]">Recent Examination Schedules</h2>
            <button className="text-[#2563EB] text-xs font-bold uppercase hover:underline">See All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-widest text-[#64748B] font-bold">
              <tr>
                <th className="px-6 py-4">Exam Title</th>
                <th className="px-6 py-4">Subject Code</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              <ExamRow title="Data Structures Advanced" code="CS301" date="Oct 24, 2025" students="45" status="active" />
              <ExamRow title="OS Theory Finals" code="CS402" date="Oct 23, 2025" students="32" status="completed" />
              <ExamRow title="Database Management" code="CS205" date="Oct 26, 2025" students="28" status="published" />
              <ExamRow title="AI Fundamentals" code="CS501" date="Nov 02, 2025" students="120" status="draft" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function NavLink({ to, label, active = false }) {
  return (
    <Link to={to} className={`flex items-center px-4 transition-all border-b-2 ${
      active ? 'border-[#14B8A6] text-[#F8FAFC]' : 'border-transparent text-[#64748B] hover:text-[#F8FAFC]'
    }`}>
      {label}
    </Link>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] border-l-4 shadow-sm" style={{ borderColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-black text-[#0B1F3B]">{value}</span>
      </div>
      <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ExamRow({ title, code, date, students, status }) {
  const statusStyles = {
    active: 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20 animate-pulse',
    completed: 'bg-[#F1F5F9] text-[#0B1F3B] border-[#0B1F3B]/20',
    published: 'bg-[#F0FDFA] text-[#14B8A6] border-[#14B8A6]/20',
    draft: 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]/20'
  };

  return (
    <tr className="hover:bg-[#F8FAFC] transition-colors">
      <td className="px-6 py-4 font-bold text-[#0B1F3B]">{title}</td>
      <td className="px-6 py-4 font-mono text-xs">{code}</td>
      <td className="px-6 py-4 text-[#64748B]">{date}</td>
      <td className="px-6 py-4 text-[#0B1F3B] font-medium">{students} Pupils</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-[#64748B] hover:text-[#2563EB] transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
      </td>
    </tr>
  );
}
