import React from "react";
import PomodoroTimer from "../components/PomodoroTimer";

// PUBLIC_INTERFACE
/**
 * FocusFlowPage: YouthPulse's Pomodoro productivity tracker page.
 * Polished with consistent dark/accent, responsive design, and UI/UX clarity.
 */
export default function FocusFlowPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center py-12 px-4 sm:px-2" style={{ minHeight: "76vh" }}>
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 drop-shadow text-center">
        FocusFlow <span role="img" aria-label="Pomodoro" className="ml-2">⏱️</span>
      </h1>
      <p className="text-base sm:text-lg text-pink-400 mb-7 text-center max-w-xl font-medium">
        Crush distractions, manage your focus energy, and build study momentum — <span className="font-semibold text-white/80">Pomodoro-style</span>!
        <br />
        <span className="pt-2 block text-white/40 text-sm font-normal">Choose your flow, tap start, and vibe with each session.</span>
      </p>
      {/* Animated Pomodoro Timer */}
      <PomodoroTimer />
      <div className="mt-7 text-xs text-center text-pink-200/60 max-w-xl bg-[#2c2032]/10 px-5 py-3 rounded-xl shadow">
        Tip: <span className="font-bold text-pink-300">1 Pomodoro</span> = 25 min focus + 5 min break.<br />
        Customize for your rhythm.<br />
        <span className="text-white/40">Sessions auto-cycle: after 4, enjoy a longer break!</span>
      </div>
    </div>
  );
}
