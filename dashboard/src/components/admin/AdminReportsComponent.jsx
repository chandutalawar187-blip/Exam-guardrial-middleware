// dashboard/src/components/admin/AdminReportsComponent.jsx
// NEW: Real-time Reports Dashboard for Admins

import { useState, useEffect } from 'react';

export default function AdminReportsComponent({ examId }) {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/exams/${examId}/reports`);
        const data = await res.json();
        setReports(data.reports);
      } catch (err) {}
    };

    fetchReports();
    const interval = setInterval(fetchReports, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [examId]);

  const filteredReports = reports.filter(r => {
    if (filter === 'ALL') return true;
    return r.ai_overlay_status === filter;
  });

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Exam Result Reports</h1>
        <div className="flex gap-4">
          <select className="bg-gray-800 text-white p-2 rounded-lg border border-gray-700" onChange={e => setFilter(e.target.value)}>
            <option value="ALL">All Reports</option>
            <option value="CLEAN">Clean Only</option>
            <option value="CONFIRMED">Malpractice Only</option>
          </select>
          <button className="bg-green-600 px-4 py-2 rounded-lg font-bold text-white">Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-2xl">
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-900 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-4">Student UID</th>
              <th className="p-4">Score</th>
              <th className="p-4">Violations</th>
              <th className="p-4">AI Overlay</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredReports.map((report, idx) => (
              <tr key={idx} className="bg-gray-900/50 hover:bg-gray-800/80 transition-colors">
                <td className="p-4 font-mono text-sm">{report.student_uid}</td>
                <td className="p-4 font-bold text-blue-400">{report.final_score}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${report.total_violations > 0 ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
                    {report.total_violations} Violations
                  </span>
                </td>
                <td className="p-4 text-xs">
                  <StatusBadge status={report.ai_overlay_status} />
                </td>
                <td className="p-4 text-gray-500 text-xs">{new Date(report.submitted_at).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button className="text-blue-500 hover:text-blue-400 font-bold text-sm">View Full Detail →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  switch (status) {
    case 'CLEAN': return <span className="text-green-500 font-bold">● Clean</span>;
    case 'CONFIRMED': return <span className="text-red-500 font-bold">● Malpractice Detected</span>;
    default: return <span className="text-gray-500">● Pending Review</span>;
  }
}
