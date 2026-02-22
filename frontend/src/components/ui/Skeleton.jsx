import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-8 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function SkeletonLine({ className = 'h-4 w-full' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
