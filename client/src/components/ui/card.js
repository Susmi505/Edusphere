import React from 'react';

export function Card({ children, className }) {
  return <div className={`p-4 border rounded shadow ${className}`}>{children}</div>;
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="p-4 font-bold">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}
