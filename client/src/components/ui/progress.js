import React from 'react';

export function Progress({ value, max = 100 }) {
  return (
    <div className="w-full bg-gray-200 rounded">
      <div
        className="bg-blue-500 h-2 rounded"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
