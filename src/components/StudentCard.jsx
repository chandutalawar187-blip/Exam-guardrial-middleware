import ScoreGauge from './ScoreGauge';

export default function StudentCard({ session }) {
  const getVerdictColor = (v) => (
    { CLEAR:'#22C55E', UNDER_REVIEW:'#EAB308', SUSPICIOUS:'#F97316', FLAGGED:'#EF4444' }[v] || '#6B7280'
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 border-l-4" style={{ borderColor: getVerdictColor(session.verdict) }}>
      <div className="font-semibold">{session.student_name}</div>
      <div className="text-sm text-gray-500">{session.exam_name}</div>
      <ScoreGauge score={session.credibility_score} verdict={session.verdict} />
      <div className="text-xs text-center mt-1 font-bold" style={{ color: getVerdictColor(session.verdict) }}>
        {session.verdict}
      </div>
    </div>
  );
}