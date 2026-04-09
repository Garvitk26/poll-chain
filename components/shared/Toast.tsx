'use client';

import { useToast } from '@/lib/context/ToastContext';
import { X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        let borderClass = '';
        let icon = null;

        switch (toast.type) {
          case 'success':
            borderClass = 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] bg-cyan-900/20 text-cyan-50';
            break;
          case 'error':
            borderClass = 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)] bg-rose-900/20 text-rose-50';
            break;
          case 'warning':
            borderClass = 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-amber-900/20 text-amber-50';
            break;
          case 'info':
            borderClass = 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-indigo-900/20 text-indigo-50';
            break;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center p-4 rounded-xl border backdrop-blur-md translate-x-0 transition-transform animate-[slideInRight_0.3s_ease-out] ${borderClass} w-80 max-w-[90vw]`}
          >
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
