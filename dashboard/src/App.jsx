// dashboard/src/App.jsx
// NEW: Main Platform Router and State Controller

import { useState } from 'react';
import StudentLoginComponent from './components/student/StudentLoginComponent';
import ExamRoomComponent from './components/student/ExamRoomComponent';
import StudentReportComponent from './components/student/StudentReportComponent';
import CreateExamComponent from './components/admin/CreateExamComponent';
import AdminReportsComponent from './components/admin/AdminReportsComponent';

export default function App() {
  const [view, setView] = useState('LANDING'); // LANDING | ADMIN_CREATE | ADMIN_REPORTS | STUDENT_LOGIN | STUDENT_EXAM | STUDENT_REPORT
  const [studentSession, setStudentSession] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const startExam = (token, examData, studentUid) => {
    window.sessionStorage.setItem('examToken', token);
    setStudentSession({ examData, studentUid, sessionId: 'SESSION-' + Date.now() });
    setView('STUDENT_EXAM');
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 selection:bg-blue-500/30">
      
      {/* ── LANDING / SWITCHER ── */}
      {view === 'LANDING' && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-12">
          <div className="text-center">
             <div className="text-7xl mb-6">🛡️</div>
             <h1 className="text-5xl font-black italic tracking-tighter text-white">SENTINEL v3.0</h1>
             <p className="text-gray-500 font-mono tracking-widest text-xs mt-4">INTEGRATED EXAM FORENSICS PLATFORM</p>
          </div>
          
          <div className="flex gap-8">
             <button 
               onClick={() => setView('STUDENT_LOGIN')}
               className="group relative px-10 py-20 bg-gray-900 border border-gray-800 rounded-3xl hover:border-blue-500 transition-all overflow-hidden"
             >
                <div className="relative z-10">
                   <p className="text-4xl mb-4">✍️</p>
                   <p className="font-black text-xl tracking-tight">STUDENT PORTAL</p>
                   <p className="text-xs text-gray-500 mt-2">Take Secure Proctored Exam</p>
                </div>
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors"></div>
             </button>

             <button 
               onClick={() => setView('ADMIN_CREATE')}
               className="group relative px-10 py-20 bg-gray-900 border border-gray-800 rounded-3xl hover:border-purple-500 transition-all overflow-hidden"
             >
                <div className="relative z-10">
                   <p className="text-4xl mb-4">🎛️</p>
                   <p className="font-black text-xl tracking-tight">ADMIN PORTAL</p>
                   <p className="text-xs text-gray-500 mt-2">Manage Exams & AI Questions</p>
                </div>
                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-colors"></div>
             </button>
          </div>

          <div className="flex gap-4">
             <button onClick={() => setView('ADMIN_REPORTS')} className="text-xs font-bold text-gray-600 hover:text-white uppercase tracking-widest">View Past Reports</button>
             <span className="text-gray-800">•</span>
             <button className="text-xs font-bold text-gray-600 hover:text-white uppercase tracking-widest">System Health</button>
          </div>
        </div>
      )}

      {/* ── ADMIN VIEWS ── */}
      {view === 'ADMIN_CREATE' && (
        <>
          <nav className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between">
             <button onClick={() => setView('LANDING')} className="text-xs font-bold text-gray-500 hover:text-white">← EXIT ADMIN</button>
             <button onClick={() => setView('ADMIN_REPORTS')} className="text-xs font-bold text-blue-500">VIEW REPORTS</button>
          </nav>
          <CreateExamComponent />
        </>
      )}

      {view === 'ADMIN_REPORTS' && (
        <>
          <nav className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between">
             <button onClick={() => setView('LANDING')} className="text-xs font-bold text-gray-500 hover:text-white">← EXIT ADMIN</button>
             <button onClick={() => setView('ADMIN_CREATE')} className="text-xs font-bold text-blue-500">CREATE EXAM</button>
          </nav>
          <AdminReportsComponent examId="DEFAULT_EXAM" />
        </>
      )}

      {/* ── STUDENT VIEWS ── */}
      {view === 'STUDENT_LOGIN' && (
        <StudentLoginComponent onLoginSuccess={startExam} />
      )}

      {view === 'STUDENT_EXAM' && studentSession && (
        <ExamRoomComponent 
          examData={studentSession.examData}
          studentUid={studentSession.studentUid}
          sessionId={studentSession.sessionId}
          onComplete={(report) => {
            setFinalReport(report);
            setView('STUDENT_REPORT');
          }}
        />
      )}

      {view === 'STUDENT_REPORT' && (
        <StudentReportComponent report={finalReport} />
      )}

    </div>
  );
}
