export default function AlertBanner({ session }) {
  if (!session) return null;
  return (
    <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <span className="font-bold">CRITICAL ALERT:</span>
        <span>Student <strong>{session.student_name}</strong> requires immediate review. Score dropped to {session.credibility_score}.</span>
      </div>
    </div>
  );
}