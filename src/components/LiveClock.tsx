import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface LiveClockProps {
  variant?: 'compact' | 'full' | 'badge' | 'header';
  className?: string;
  showIcon?: boolean;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  variant = 'compact',
  className = '',
  showIcon = true
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    // Tick every 1000ms for exact running seconds
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format date: e.g. "Fri, 21 Aug 2026"
  const formattedDate = time.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Format full date: e.g. "Friday, 21 August 2026"
  const formattedFullDate = time.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Format time with seconds: e.g. "04:30:15 PM"
  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 text-white px-2.5 py-1 rounded-xl font-mono text-xs shadow-sm ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />}
        <span className="text-slate-300 hidden sm:inline">{formattedDate} •</span>
        <span className="font-bold text-amber-300 tabular-nums tracking-wider">{formattedTime}</span>
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1 rounded font-sans font-bold">IST/LIVE</span>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 bg-slate-900/90 border border-slate-800 text-white px-3.5 py-1.5 rounded-2xl shadow-inner font-mono ${className}`}>
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>{formattedFullDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-3 pt-0.5 sm:pt-0">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span className="tabular-nums tracking-wider text-sm text-emerald-400">{formattedTime}</span>
          <span className="text-[10px] text-slate-400 font-sans font-normal">(Live Ticking)</span>
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`p-3 bg-slate-900 border border-slate-800 rounded-2xl text-white space-y-1 ${className}`}>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-400" />
            {formattedFullDate}
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
            SYNCED
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showIcon && <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />}
          <span className="font-mono text-base sm:text-lg font-extrabold text-amber-300 tabular-nums tracking-wider">
            {formattedTime}
          </span>
        </div>
      </div>
    );
  }

  // Compact default
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs tabular-nums ${className}`}>
      {showIcon && <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
      <span className="text-slate-300">{formattedDate}</span>
      <span className="font-bold text-amber-300">{formattedTime}</span>
    </span>
  );
};
