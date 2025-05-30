import React from "react";
import GlowingIcon from "../components/GlowingIcon";

// PUBLIC_INTERFACE
/**
 * HomePage display for YouthPulse Hub
 * - Shows 3 horizontally centered, glowing circular icons for main tools.
 */
export default function HomePage() {
  return (
    <div className="container py-16 flex flex-col items-center justify-center min-h-[68vh]">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to YouthPulse Hub</h1>
      <p className="text-lg mb-10 text-center text-orange-400 font-medium max-w-xl">
        Empowering young adults with smart and stylish life tools.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-12 mt-4 mb-8">
        {/* GradeBoost - Academic */}
        <GlowingIcon
          icon={<span role="img" aria-label="GradeBoost" className="select-none">🎓</span>}
          label="GradeBoost"
          to="/gradeboost"
          glowColor="from-orange-500 via-amber-400 to-yellow-500"
        />
        {/* SplitMate - Expenses */}
        <GlowingIcon
          icon={<span role="img" aria-label="SplitMate" className="select-none">💸</span>}
          label="SplitMate"
          to="/splitmate"
          glowColor="from-blue-500 via-cyan-400 to-green-400"
        />
        {/* FocusFlow - Pomodoro */}
        <GlowingIcon
          icon={<span role="img" aria-label="FocusFlow" className="select-none">⏱️</span>}
          label="FocusFlow"
          to="/focusflow"
          glowColor="from-pink-500 via-fuchsia-500 to-orange-400"
        />
      </div>
      <div className="mt-4 text-white/80 text-base max-w-lg text-center">
        <ul className="flex flex-col gap-1">
          <li><span className="font-bold text-orange-300">GradeBoost:</span> Academic performance insights</li>
          <li><span className="font-bold text-blue-300">SplitMate:</span> Group expense management</li>
          <li><span className="font-bold text-pink-300">FocusFlow:</span> Pomodoro productivity tracker</li>
        </ul>
      </div>
    </div>
  );
}
