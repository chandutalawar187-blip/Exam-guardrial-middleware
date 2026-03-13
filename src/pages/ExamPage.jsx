import React, { useEffect } from 'react';

export default function ExamPage() {
  useEffect(() => {
    // Tells the Chrome Extension that the exam has officially started
    if (window.startExamSentinel) {
      window.startExamSentinel();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded p-8 border-t-8 border-blue-900">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Midterm Assessment: CS-101</h1>
          <div className="animate-pulse text-red-600 font-bold text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Proctored Session Active
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold mb-2">Question 1: Explain the difference between a process and a thread.</p>
          <textarea 
            className="w-full h-48 border border-gray-300 rounded p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Type your answer here. Copy/pasting is disabled..."
          ></textarea>
        </div>

        <button className="bg-blue-900 text-white px-8 py-3 rounded font-bold float-right hover:bg-blue-800">
          Submit Exam
        </button>
      </div>
    </div>
  );
}