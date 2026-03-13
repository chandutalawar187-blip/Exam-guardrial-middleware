export default function EventFeed({ events }) {
  if (!events || events.length === 0) return <div className="text-gray-500 text-sm">No violations recorded.</div>;

  return (
    <div className="h-64 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
      {events.map((event, i) => (
        <div key={i} className="mb-2 text-sm border-b pb-2">
          <span className="font-bold text-red-600">{event.event_type}</span>
          <span className="text-gray-500 text-xs ml-2">{new Date(event.timestamp).toLocaleTimeString()}</span>
          <div className="text-gray-700 font-mono text-xs mt-1">Penalty: {event.score_delta} pts</div>
        </div>
      ))}
    </div>
  );
}