import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import ExamPage from './pages/ExamPage';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session/:sessionId" element={<SessionDetail />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}