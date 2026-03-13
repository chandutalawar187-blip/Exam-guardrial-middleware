import { useEffect, useState } from 'react';

const VERDICT_COLORS = {
  CLEAR: '#22C55E', UNDER_REVIEW: '#EAB308', SUSPICIOUS: '#F97316', FLAGGED: '#EF4444'
};

export default function ScoreGauge({ score, verdict }) {
  const [display, setDisplay] = useState(score);
  const color = VERDICT_COLORS[verdict] || '#22C55E';
  const radius = 54, circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplay(prev => {
        if (prev === score) { clearInterval(timer); return prev; }
        return prev > score ? prev - 1 : prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative w-32 h-32 mx-auto my-4">
      <svg className="rotate-[-90deg] w-full h-full">
        <circle cx="64" cy="64" r={radius} stroke="#E5E7EB" strokeWidth="8" fill="none" />
        <circle cx="64" cy="64" r={radius} stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{display}</span>
      </div>
    </div>
  );
}