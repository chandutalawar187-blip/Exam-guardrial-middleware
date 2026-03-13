import React from 'react';
import { useAllSessions } from '../hooks/useSupabaseRealtime';
import AlertBanner from '../components/AlertBanner';
import StudentCard from '../components/StudentCard';

export default function Dashboard() {
  // Fetches live sessions from Supabase
  const sessions = useAllSessions();
  
  // Finds any session that has dropped into the FLAGGED category
  const criticalSessions = sessions.filter(s => s.credibility_score < 50);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">ExamGuardrail Auditor Dashboard</h1>
        <span className="text-sm bg-blue-800 px-3 py-1 rounded-full">{sessions.length} Active Sessions</span>
      </div>
      
      {/* Critical alert banner */}
      {criticalSessions.length > 0 && (
        <AlertBanner session={criticalSessions[0]} />
      )}
      
      {/* Student grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sessions.length > 0 ? (
          sessions.map(session => (
             <StudentCard key={session.id} session={session} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No active exam sessions found. Waiting for students to connect...
          </div>
        )}
      </div>
    </div>
  );
}