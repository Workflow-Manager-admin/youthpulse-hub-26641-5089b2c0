import React, { useState, useRef, useEffect } from "react";

/**
 * FocusFlow Pomodoro Timer
 * - Animated circular timer (basic)
 * - Customizable work/break durations (future extensibility)
 * - Start, pause, reset controls
 * - Sleek UI for a modern web app
 */

// Utility to format seconds for MM:SS
function formatTime(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Timer settings for a default Pomodoro cycle
const DEFAULTS = {
  workMins: 25,
  breakMins: 5,
  longBreakMins: 15,
  cycles: 4,
};

// PUBLIC_INTERFACE
/**
 * PomodoroTimer: Minimal timer implementation to resolve build error.
 */
export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(DEFAULTS.workMins * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds === 0) return;
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [running, seconds]);

  return (
    <div className="flex flex-col items-center bg-[#1f1a2e33]/40 rounded-xl shadow-lg py-8 px-8">
      <div className="text-5xl font-mono font-bold mb-2 drop-shadow animate-pulse text-orange-400">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-4 mt-3">
        <button
          className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="btn bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded"
          onClick={() => {
            setSeconds(DEFAULTS.workMins * 60);
            setRunning(false);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
