"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-06-01T07:00:00.000Z"); // May 31 11:59 PM Pacific = June 1 07:00 UTC

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function MayCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function tick() {
      const now = Date.now();
      const diff = Math.max(0, TARGET.getTime() - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3 md:gap-6">
          <div className="text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[64px] md:min-w-[80px]">
              <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
                {pad(value)}
              </span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">{label}</p>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-bold text-amber-400 mb-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
