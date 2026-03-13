// dashboard/src/pages/admin/AdminReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo/Cognivigil_logo_full_dark.svg';
// Import SheetJS from CDN for Excel export (v0.19.3)
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch mock/real reports from backend
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/exams/DEFAULT_EXAM/reports');
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        // Fallback for demo
        setReports([
          { student_uid: 'COG-ST-A1B2C3', raw_score: 18, total_violations: 0, final_score: 90, submitted_at: new Date().toISOString(), ai_overlay_status: 'CLEAN' },
          { student_uid: 'COG-ST-X9Y8Z7', raw_score: 14, total_violations: 4, final_score: 65, submitted_at: new Date().toISOString(), ai_overlay_status: 'CONFIRMED' },
          { student_uid: 'COG-ST-M4N5O6', raw_score: 16, total_violations: 1, final_score: 80, submitted_at: new Date().toISOString(), ai_overlay_status: 'CLEAN' }
        ]);
      } finally {
         setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const exportToExcel = () => {
    // Sheet 1: Student Scores
    const scoreData = reports.map(r => ({
      'Student UID': r.student_uid,
      'Raw Score': r.raw_score,
      'Total Violations': r.total_violations,
      'Mark Deductions': r.total_violations > 3 ? r.total_violations - 3 : 0,
      'Final Score': r.final_score,
      'AI Analysis': r.ai_overlay_status,
      'Submission Time': new Date(r.submitted_at).toLocaleString()
    }));

    // Sheet 2: Exam Summary
    const summaryData = [{
      'Exam Title': 'Data Structures Finals',
      'Subject Code': 'CS301',
      'Total Students': reports.length,
      'Average Score': (reports.reduce((a,b)=>a+b.final_score,0)/reports.length).toFixed(2),
      'Violation Rate': (reports.filter(r=>r.total_violations > 0).length / reports.length * 100).toFixed(0) + '%'
    }];

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(scoreData);
    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    
    // Set column widths
    const wscols = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 }];
    ws1['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws1, "Student Scores");
    XLSX.utils.book_append_sheet(wb, ws2, "Exam Summary");

    XLSX.writeFile(wb, `Cognivigil_Report_CS301_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
       <nav className="bg-[#0B1F3B] text-white px-8 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-12">
          <img src={logoLight} alt="Cognivigil" className="h-6" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-[#14B8A6]">Admin Reports</h1>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} className="text-xs font-bold text-[#64748B] hover:text-white">BACK TO DASHBOARD</button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1F3B]">Violation Audit Reports</h1>
            <p className="text-[#64748B] text-sm mt-1">Export detailed forensic analysis of student sessions to Microsoft Excel.</p>
          </div>
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-[#14B8A6] text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg shadow-[#14B8A6]/20 hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Violation Report (Excel)
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-widest font-black text-[#64748B] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-8 py-5">Student UID</th>
                  <th className="px-8 py-5">Raw Score</th>
                  <th className="px-8 py-5">Violations</th>
                  <th className="px-8 py-5">AI Overlay</th>
                  <th className="px-8 py-5">Final Score</th>
                  <th className="px-8 py-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-8 py-20 text-center text-[#94A3B8] font-bold">Loading analytical data...</td></tr>
                ) : (
                  reports.map((r, i) => (
                    <tr key={i} className={`hover:bg-[#F8FAFC] transition-colors ${r.total_violations >= 3 ? 'bg-[#FEF2F2]' : r.total_violations > 0 ? 'bg-[#FFFBEB]' : ''}`}>
                      <td className="px-8 py-5 font-mono text-xs font-bold text-[#0B1F3B]">{r.student_uid}</td>
                      <td className="px-8 py-5 text-sm font-medium">{r.raw_score} marks</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${r.total_violations >= 3 ? 'bg-[#EF4444] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                          {r.total_violations} Breaches
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${r.ai_overlay_status === 'CONFIRMED' ? 'text-[#EF4444]' : 'text-[#14B8A6]'}`}>
                           <span className={`w-2 h-2 rounded-full ${r.ai_overlay_status === 'CONFIRMED' ? 'bg-[#EF4444]' : 'bg-[#14B8A6]'}`}></span>
                           {r.ai_overlay_status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-lg font-black text-[#0B1F3B]">{r.final_score}%</td>
                      <td className="px-8 py-5 text-right"><button className="text-[#2563EB] font-bold text-xs hover:underline">View Forensic Log</button></td>
                    </tr>
                  ))
                )}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}
