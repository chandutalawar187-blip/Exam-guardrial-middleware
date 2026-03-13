// dashboard/src/pages/student/StudentWaitingRoom.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoDark from '../../assets/logo/Cognivigil_logo_full_dark.svg';
import { api } from '../../config';

export default function StudentWaitingRoom() {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState('02:14'); // Initial placeholder
  const studentUid = 'COG-ST-A1B2C3'; // Mock retrieval from context

  useEffect(() => {
    // 5-second status polling
    const interval = setInterval(async () => {
      try {
        const data = await api.get(`/api/exams/DEFAULT_EXAM/status`);
        if (data.status === 'published') {
           setIsReady(true);
           clearInterval(interval);
           playNotification();
        }
      } catch (err) {
        // Mock behavior: autostart after 10s for demo
      }
    }, 5000);

    setTimeout(() => { setIsReady(true); playNotification(); }, 15000); // Demo fallback

    return () => clearInterval(interval);
  }, []);

  const playNotification = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch(e) {}
  };

  const startExam = async () => {
    try {
      // Create session in backend - this triggers the silent python agent automatically
      const data = await api.post(`/api/sessions`, {
          student_id: studentUid,
          student_name: 'Student One',
          org_id: 'ORG-SENTINEL',
          exam_name: 'Data Structures Advanced',
          platform: 'Windows-Cognivigil',
          device_type: 'Laptop'
        });
      // Navigate to exam room with the session ID
      navigate(`/exam/room?sessionId=${data.session_id}`);
    } catch (err) {
      console.error("Failed to initialize Sentinel Session", err);
      // Fallback for demo
      navigate('/exam/room');
    }
  };

  return (
    <div className="min-h-screen bg-[#001D39] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
         <div className="ring-overlay animate-pulse-teal" style={{ width: '400px', height: '400px' }}></div>
      </div>

      <div className="max-w-md w-full bg-[#BDD8E9] rounded-[24px] overflow-hidden shadow-2xl relative z-10 p-10 text-center">
        <img src={logoDark} alt="Cognivigil" className="h-10 mx-auto mb-8" />
        
        <h2 className="text-[#001D39] text-[28px] font-display font-display font-bold font-display font-bold mb-1 italic tracking-tight">Welcome, {studentUid}</h2>
        <p className="text-[#49769F] font-display text-[14px] font-display font-semibold uppercase tracking-widest mb-10">Data Structures Advanced • CS301</p>

        <div className="bg-white border border-[#7BBDE8] rounded-2xl p-6 mb-8 py-10 shadow-sm">
           <p className="text-[#49769F] text-[10px] font-black uppercase tracking-widest mb-2">Exam starts in</p>
           <p className="text-4xl font-black text-[#001D39] tracking-tighter mb-4">{countdown}</p>
           <div className="flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-[#4E8EA2] shadow-[0_0_8px_#4E8EA2]' : 'bg-[#49769F] animate-pulse'}`}></span>
              <span className={`font-body text-[12px] font-display font-bold uppercase tracking-widest ${isReady ? 'text-[#4E8EA2]' : 'text-[#49769F]'}`}>
                {isReady ? 'Exam is Ready' : 'Waiting for examiner...'}
              </span>
           </div>
        </div>

        {isReady && (
          <div className="animate-bounce mb-6">
             <div className="bg-[#0A4174] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mx-auto inline-block">Proctor Link Established</div>
          </div>
        )}

        <button
          onClick={startExam}
          disabled={!isReady}
          className={`w-full py-4 rounded-xl font-black font-body text-[14px] tracking-widest uppercase transition-all transform active:scale-95 shadow-lg ${
            isReady ? 'bg-[#0A4174] text-white shadow-[#0A4174]/30 hover:bg-[#001D39]' : 'bg-[#7BBDE8] text-[#6EA2B3] cursor-not-allowed'
          }`}
        >
          START EXAMINATION
        </button>

        <p className="mt-8 text-[10px] text-[#6EA2B3] leading-relaxed italic px-4">
          Do not close this window. The exam will transition to secure proctored mode automatically once started.
        </p>
      </div>
    </div>
  );
}
