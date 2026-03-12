// dashboard/src/components/admin/AdminReportsComponent.jsx
import { useState, useEffect } from 'react';

export default function AdminReportsComponent() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`http://localhost:8000/sessions`);
        const data = await res.json();
        if (data.sessions) {
          setReports(data.sessions);
        }
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
    const interval = setInterval(fetchReports, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredReports = reports.filter(r => {
    if (filter === 'ALL') return true;
    if (filter === 'CLEAN') return r.score >= 90;
    if (filter === 'CONFIRMED') return r.score < 90; 
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 fade-in">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight premium-gradient-text uppercase italic mb-2">Audit Reports</h1>
            <p className="text-slate-500 font-mono tracking-widest text-[10px] uppercase">Sentinel Forensics Data</p>
          </div>
          <div className="flex gap-4">
            <select className="bg-[#030816] text-slate-300 px-6 py-3 rounded-xl border border-white/5 outline-none focus:border-purple-500/50 transition-all font-medium text-xs tracking-wider uppercase" onChange={e => setFilter(e.target.value)}>
              <option value="ALL">All Reports</option>
              <option value="CLEAN">Clean Only</option>
              <option value="CONFIRMED">Malpractice Only</option>
            </select>
            <button className="bg-purple-600/10 text-purple-400 border border-purple-500/30 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(168,85,247,0.1)]">Export CSV</button>
          </div>
        </header>

        <section className="glass-panel p-2 rounded-[32px] shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="overflow-x-auto rounded-[28px] border border-white/5 bg-[#030816]">
            {isLoading ? (
               <div className="p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">Loading Telemetry...</div>
            ) : filteredReports.length === 0 ? (
               <div className="p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">No matching records found.</div>
            ) : (
                <table className="w-full text-left text-slate-300 relative z-10">
                <thead className="bg-[#0f172a]/80 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                    <tr>
                    <th className="p-6">Candidate</th>
                    <th className="p-6">Trust Score</th>
                    <th className="p-6">Violations</th>
                    <th className="p-6">Status Indicator</th>
                    <th className="p-6">Timeline</th>
                    <th className="p-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredReports.map((report, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                           <p className="font-bold text-sm text-white mb-1">{report.studentName || report.id}</p>
                           <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{report.examTitle}</p>
                        </td>
                        <td className="p-6">
                           <div className={`text-xl font-black ${report.score >= 90 ? 'text-emerald-400' : report.score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {report.score}%
                           </div>
                        </td>
                        <td className="p-6">
                           <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                              report.violations?.length > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                           }`}>
                              {report.violations?.length || 0} Flags
                           </div>
                        </td>
                        <td className="p-6 text-xs">
                           <StatusBadge score={report.score} />
                        </td>
                        <td className="p-6 text-slate-500 text-[10px] font-mono tracking-widest uppercase">
                           {report.endTime ? new Date(report.endTime).toLocaleString() : 'Active...'}
                        </td>
                        <td className="p-6 text-right">
                        <button className="text-[10px] font-black text-blue-500 hover:text-blue-400 tracking-widest uppercase transition-colors px-4 py-2 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 border border-blue-500/20">Analyze Vector →</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ score }) {
  if (score >= 90) return <span className="text-emerald-500 font-bold flex items-center gap-2 text-[11px] uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Clean</span>;
  if (score >= 70) return <span className="text-yellow-500 font-bold flex items-center gap-2 text-[11px] uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Under Review</span>;
  if (score >= 50) return <span className="text-orange-500 font-bold flex items-center gap-2 text-[11px] uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Suspicious</span>;
  return <span className="text-red-500 font-bold flex items-center gap-2 text-[11px] uppercase tracking-wider"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> Flagged</span>;
}
