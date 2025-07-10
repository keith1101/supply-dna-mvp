import React from 'react';

export default function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i * 80) / (data.length - 1);
    const y = 28 - ((v - min) / (max - min || 1)) * 18 - 5;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="supplydna-sparkline" viewBox="0 0 80 28">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
} 