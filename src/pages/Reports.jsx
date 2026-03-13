import React from 'react';
import { Link } from 'react-router-dom';

export default function Reports() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Generated AI Reports</h1>
      <div className="bg-white rounded shadow p-6 text-center text-gray-500">
        <p className="mb-4">No historical reports found for this organisation.</p>
        <Link to="/" className="text-blue-600 hover:underline">Return to active sessions</Link>
      </div>
    </div>
  );
}