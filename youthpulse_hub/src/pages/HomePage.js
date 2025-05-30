import React from "react";
import GlowingIcon from "../components/GlowingIcon";

// PUBLIC_INTERFACE
/**
 * HomePage display for YouthPulse Hub
 * - Shows 3 horizontally centered, glowing circular icons for main tools.
 * - Responsive, polished, and micro-interaction focused.
 */
export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[68vh]">
      <h1 className="text-4xl sm:text-5xl font-black mb-4 text-center drop-shadow-lg leading-tight tracking-tight">
        Welcome to <span className="text-orange-400">YouthPulse Hub</span>
      </h1>
      <p className="text-lg sm:text-xl mb-10 text-center font-semibold max-w-2xl text-orange-200/90">
        Empowering young adults with
        <span className="text-white px-1 rounded bg-gradient-to-r from-orange-500/20 via-pink-400/10 to-yellow-400/10">smart and stylish life tools</span>.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mt-4 mb-10 transition-all">
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
      <div className="mt-4 text-gray-200/80 text-base max-w-lg text-center">
        <ul className="flex flex-col gap-1">
          <li>
            <span className="font-bold text-orange-300">GradeBoost:</span>
            <span className="ml-1">Academic performance insights</span>
          </li>
          <li>
            <span className="font-bold text-blue-300">SplitMate:</span>
            <span className="ml-1">Group expense management</span>
          </li>
          <li>
            <span className="font-bold text-pink-300">FocusFlow:</span>
            <span className="ml-1">Pomodoro productivity tracker</span>
          </li>
        </ul>
      </div>
      <div className="mt-8 flex justify-center w-full">
        <span className="text-xs text-orange-200/40 bg-[#22191b55] rounded-xl px-4 py-2 animate-pulse shadow">
          Crafted for 18–23 year olds: Modern, playful, and distraction-free.
        </span>
      </div>
    </div>
  );
}
