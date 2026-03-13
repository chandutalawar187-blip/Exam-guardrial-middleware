export default function ReportModal({ isOpen, onClose, reportData }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">AI Credibility Report</h2>
        {reportData ? (
          <div>
            <p className="font-bold text-red-600 mb-2">Verdict: {reportData.verdict}</p>
            <p className="mb-4">{reportData.executive_summary}</p>
            <h3 className="font-bold mt-4">Recommendation:</h3>
            <p className="text-sm bg-gray-100 p-2 rounded">{reportData.recommendation}</p>
          </div>
        ) : (
          <p className="text-gray-500 animate-pulse">Generating Claude AI report...</p>
        )}
        <button onClick={onClose} className="mt-6 bg-blue-900 text-white px-4 py-2 rounded w-full">Close</button>
      </div>
    </div>
  );
}