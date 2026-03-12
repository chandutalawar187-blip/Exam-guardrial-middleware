import { useState } from 'react';
export default function ExamPage() {
  const [active, setActive] = useState(false);
  const enter = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setActive(true);
      // Automatically launch the native agent using our custom protocol
      window.location.assign('examguardrail://start');
      if (window.startExamSentinel) window.startExamSentinel();
    } catch {
      alert('Fullscreen is required to take this exam.');
    }
  };
  return (
    <div style={{ minHeight:'100vh', background:'#0F172A', display:'flex',
      alignItems:'center', justifyContent:'center', color:'white', fontFamily:'sans-serif' }}>
      {!active ? (
        <div style={{ textAlign:'center' }}>
          <h1 style={{ fontSize:32, fontWeight:'bold', marginBottom:8 }}>ExamGuardrail Sentinel</h1>
          <p style={{ color:'#93C5FD', marginBottom:32 }}>Integrity monitoring is required for this exam.</p>
          <button onClick={enter} style={{ background:'white', color:'#1E3A8A', fontWeight:'bold',
            fontSize:18, padding:'14px 40px', border:'none', borderRadius:12, cursor:'pointer' }}>
            Start Exam
          </button>
        </div>
      ) : (
        <div style={{ textAlign:'center' }}>
          <p style={{ color:'#4ADE80', fontSize:20 }}>✅ Exam in progress</p>
          <p style={{ color:'#94A3B8', fontSize:14 }}>Integrity monitoring is active.</p>
        </div>
      )}
    </div>
  );
}
