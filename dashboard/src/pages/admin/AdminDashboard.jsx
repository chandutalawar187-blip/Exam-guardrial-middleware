// dashboard/src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#BDD8E9]">
      {/* Top Navbar */}
      <nav className="bg-[#001D39] text-[#BDD8E9] px-8 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-8" />
          <div className="flex gap-8 font-body text-[14px] font-display font-semibold tracking-wide h-16">
            <NavLink to="/admin/dashboard" label="Dashboard" active />
            <NavLink to="/admin/create-exam" label="Create Exam" />
            <NavLink to="/admin/students" label="Students" />
            <NavLink to="/admin/reports" label="Reports" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-[#4E8EA2] px-3 py-1 rounded text-[10px] font-black uppercase">ADMIN001</div>
          <button onClick={() => navigate('/')} className="text-[#49769F] hover:text-[#BDD8E9] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-[#001D39]">Welcome back, Administrator</h1>
            <p className="text-[#49769F] font-body text-[14px] mt-1">Monitor exam status and manage academic integrity in real-time.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/create-exam" className="bg-[#0A4174] text-white px-6 py-2.5 rounded-lg font-display font-bold font-body text-[14px] shadow-md hover:bg-[#001D39] transition-all">
              Create New Exam
            </Link>
            <Link to="/admin/reports" className="bg-[#001D39] text-white px-6 py-2.5 rounded-lg font-display font-bold font-body text-[14px] shadow-md hover:bg-[#001D39] transition-all">
              View All Reports
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Exams Created" value="12" icon="📋" color="#0A4174" />
          <StatCard label="Active Students" value="84" icon="👥" color="#4E8EA2" />
          <StatCard label="Exams In Progress" value="3" icon="⏳" color="#F59E0B" />
          <StatCard label="Reports Generated" value="142" icon="📊" color="#001D39" />
        </div>

        {/* Recent Exams Table */}
        <div className="bg-white rounded-xl border border-[#7BBDE8] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#7BBDE8] flex justify-between items-center">
            <h2 className="font-display font-bold text-[#001D39]">Recent Examination Schedules</h2>
            <button className="text-[#0A4174] font-display text-[14px] font-display font-semibold uppercase hover:underline">See All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[#BDD8E9] font-body text-[12px] uppercase tracking-widest text-[#49769F] font-display font-bold">
              <tr>
                <th className="px-6 py-4">Exam Title</th>
                <th className="px-6 py-4">Subject Code</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#7BBDE8] font-body text-[14px]">
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
      active ? 'border-[#4E8EA2] text-[#BDD8E9]' : 'border-transparent text-[#49769F] hover:text-[#BDD8E9]'
    }`}>
      {label}
    </Link>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#7BBDE8] border-l-4 shadow-sm" style={{ borderColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-black text-[#001D39]">{value}</span>
      </div>
      <p className="text-[#49769F] font-display text-[14px] font-display font-semibold uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ExamRow({ title, code, date, students, status }) {
  const statusStyles = {
    active: 'bg-[#EFF6FF] text-[#0A4174] border-[#0A4174]/20 animate-pulse',
    completed: 'bg-[#BDD8E9] text-[#001D39] border-[#001D39]/20',
    published: 'bg-[#F0FDFA] text-[#4E8EA2] border-[#4E8EA2]/20',
    draft: 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]/20'
  };

  return (
    <tr className="hover:bg-[#BDD8E9] transition-colors">
      <td className="px-6 py-4 font-display font-bold text-[#001D39]">{title}</td>
      <td className="px-6 py-4 font-mono font-body text-[12px]">{code}</td>
      <td className="px-6 py-4 text-[#49769F]">{date}</td>
      <td className="px-6 py-4 text-[#001D39] font-body font-normal">{students} Pupils</td>
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-[#49769F] hover:text-[#0A4174] transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
      </td>
    </tr>
  );
}
