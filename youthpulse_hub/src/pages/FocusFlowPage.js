import React from "react";
import PomodoroTimer from "../components/PomodoroTimer";

// PUBLIC_INTERFACE
/**
 * FocusFlowPage: YouthPulse's Pomodoro productivity tracker page.
 * Stylish, animated, session-based Pomodoro with customizable focus/breaks.
 */
export default function FocusFlowPage() {
  return (
    <div
      className="container py-12 flex flex-col items-center"
      style={{ minHeight: "76vh" }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">
        FocusFlow <span role="img" aria-label="Pomodoro">⏱️</span>
      </h1>
      <p className="text-base sm:text-lg text-pink-400 mb-7 text-center max-w-2xl">
        Crush distractions, manage your focus energy, and build study momentum — <span className="font-semibold text-white/80">Pomodoro-style</span>!
        <br />
        Choose your flow, tap start, and vibe with each session.
      </p>
      {/* Animated Pomodoro Timer */}
      <PomodoroTimer />
      <div className="mt-7 text-sm text-center text-pink-200/50 max-w-xl">
        Tip: 1 Pomodoro = 25 min focus + 5 min break. Customize for your rhythm.<br />
        Sessions auto-cycle: after 4, enjoy a longer break!
      </div>
    </div>
  );
}
