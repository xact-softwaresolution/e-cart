import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageOpen, title = 'Nothing here yet', message = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon className="h-16 w-16 text-slate-300 mb-4" />
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      {message && <p className="text-slate-500 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
