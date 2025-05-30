import React, { useState, useRef, useEffect } from "react";

/**
 * FocusFlow Pomodoro Timer
 * - Animated circular timer
 * - Customizable work/break durations
 * - Session cycles (Pomodoro rounds)
 * - Start, pause, reset controls
 * - Visual feedback (color/circle)
 * - Sleek UI for youth/modern web app
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

const CIRCLE = {
  radius: 88, // px
  stroke: 12, // px
};
// Circumference for SVG
const CIRCUM = 2 * Math.PI * CIRCLE.radius;

// PUBLIC_INTERFACE
/**
 * PomodoroTimer component: flexible, animated Pomodoro timer for FocusFlow
 */
export default function PomodoroTimer({
  initWork = DEFAULTS.workMins,
  initBreak = DEFAULTS.breakMins,
  initLongBreak = DEFAULTS.longBreakMins,
  initCycles = DEFAULTS.cycles,
}) {
  // Configurable durations/sessions (mins)
  const [workMins, setWorkMins] = useState(initWork);
  const [breakMins, setBreakMins] = useState(initBreak);
  const [longBreakMins, setLongBreakMins] = useState(initLongBreak);
  const [cycles, setCycles] = useState(initCycles);

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work"); // work | short-break | long-break
  const [session, setSession] = useState(1); // 1-based
  const [timeLeft, setTimeLeft] = useState(workMins * 60);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Audio for feedback (simple web beep, no asset needed)
  const beepRef = useRef();

  // Side effects for running timer
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          // Timer up: session change logic
          handleSessionEnd();
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [isRunning, mode, session, workMins, breakMins, longBreakMins, cycles]);

  // Handle what happens when timer hits 0
  function handleSessionEnd() {
    // Visual/auditory feedback
    triggerFeedback();
    // Cycle logic
    if (mode === "work") {
      // If end of last pomodoro round: long break
      if (session % cycles === 0) {
        setMode("long-break");
        setTimeLeft(longBreakMins * 60);
        setCyclesCompleted((c) => c + 1);
      } else {
        // Normal short break
        setMode("short-break");
        setTimeLeft(breakMins * 60);
      }
    } else {
      // After any break, back to work
      setMode("work");
      setSession((s) => {
        const next = mode === "long-break" ? 1 : s + 1;
        return next > cycles ? 1 : next;
      });
      setTimeLeft(workMins * 60);
    }
  }

  // Reset to beginning
  function handleReset() {
    setIsRunning(false);
    setMode("work");
    setSession(1);
    setTimeLeft(workMins * 60);
    setCyclesCompleted(0);
  }

  // On changing config, restart state
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line
  }, [workMins, breakMins, longBreakMins, cycles]);

  // Feedback animation: pulse the circle, play beep
  function triggerFeedback() {
    if (beepRef.current) {
      beepRef.current.currentTime = 0;
      beepRef.current.play();
    }
    // Pulse animation by toggling a class for 0.5s
    const el = document.getElementById("focusflow-circle");
    if (el) {
      el.classList.add("focusflow-pulse");
      setTimeout(() => el.classList.remove("focusflow-pulse"), 600);
    }
    // Vibration (if supported)
    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
  }

  // For animation: percent left (for SVG progress circle)
  const duration =
    mode === "work"
      ? workMins * 60
      : mode === "short-break"
      ? breakMins * 60
      : longBreakMins * 60;
  const percentLeft = Math.max(0, Math.min(1, timeLeft / duration));

  // Select colors based on mode
  const modeColors = {
    work: "#E87A41", // orange
    "short-break": "#00BFFF", // blue(ish)
    "long-break": "#A259F7", // purple
  };
  const currentColor = modeColors[mode];

  // Customization control rendering (with min/max enforcement & step) - no numbers outside 1-90 mins
  const configInput = (label, value, setter, min, max) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <span className="text-xs text-white/80 font-medium mb-0.5">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={isRunning}
        onChange={(e) => {
          const v = Math.max(min, Math.min(max, Number(e.target.value)));
          setter(v);
        }}
        className="focus:outline-none bg-[#29292c] rounded px-2 py-1 border border-gray-800 w-16 text-center text-white font-bold disabled:opacity-50"
        style={{ fontSize: "1rem" }}
        tabIndex={0}
        aria-label={label}
      />
    </div>
  );

  return (
    <div
      className="py-8 flex flex-col items-center"
      style={{
        background:
          "linear-gradient(120deg, #232427 60%, #291d1b 100%)",
        borderRadius: "26px",
        boxShadow: "0 6px 32px 0 rgba(233,122,65,0.11)",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {/* SVG Animated Circular Progress */}
      <div className="relative mb-4" style={{ width: 220, height: 220 }}>
        <svg id="focusflow-circle" width={220} height={220}>
          {/* Background circle */}
          <circle
            cx={110}
            cy={110}
            r={CIRCLE.radius}
            stroke="#322D28"
            strokeWidth={CIRCLE.stroke}
            fill="none"
          />
          {/* Foreground animated circle */}
          <circle
            cx={110}
            cy={110}
            r={CIRCLE.radius}
            stroke={currentColor}
            strokeWidth={CIRCLE.stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUM}
            strokeDashoffset={CIRCUM - percentLeft * CIRCUM}
            style={{
              transition: "stroke-dashoffset 0.7s linear, stroke 0.4s",
              filter:
                "drop-shadow(0 0 15px " +
                (percentLeft > 0
                  ? currentColor
                  : "#FFE08280") +
                ")",
            }}
          />
        </svg>
        {/* Timer numbers inside circle */}
        <div
          className="absolute left-0 top-0 h-full w-full flex flex-col justify-center items-center"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="text-5xl font-extrabold"
            style={{ color: currentColor, textShadow: "0 2px 16px #2a2526" }}
          >
            {formatTime(timeLeft)}
          </span>
          <span className="text-base mt-1 font-medium tracking-wide text-white/80">
            {mode === "work"
              ? "Focus"
              : mode === "short-break"
              ? "Break"
              : "Long Break"}
          </span>
          <span className="text-xs mt-1 mb-0.5 text-white/40">
            Session {session} / {cycles}
          </span>
        </div>
      </div>
      {/* Timer Controls */}
      <div className="flex gap-4 mb-4 items-center justify-center">
        <button
          className="btn btn-large"
          style={{
            backgroundColor: isRunning ? "#232428" : currentColor,
            color: isRunning ? "#fff" : "#fff",
            border: "none",
            boxShadow: isRunning
              ? "0 0 0 transparent"
              : `0 0 20px 0 ${currentColor}77`,
            fontWeight: 700,
            minWidth: 96,
            fontSize: "1.1rem",
            letterSpacing: 1,
            transition: "all 0.2s",
          }}
          onClick={() => setIsRunning((run) => !run)}
          tabIndex={0}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="btn"
          style={{
            background:
              "linear-gradient(90deg, #242528 50%, #2e2432 100%)",
            border: "none",
            color: "#fff",
            minWidth: 68,
            opacity: !isRunning && timeLeft === duration ? 0.5 : 1,
            fontWeight: 600,
          }}
          onClick={handleReset}
          tabIndex={0}
          aria-label="Reset timer"
          disabled={!isRunning && timeLeft === duration}
        >
          Reset
        </button>
      </div>
      {/* Customization Inputs */}
      <div className="flex gap-4 justify-center mb-2 flex-wrap">
        {configInput("Work (min)", workMins, setWorkMins, 1, 90)}
        {configInput("Break (min)", breakMins, setBreakMins, 1, 60)}
        {configInput("Sessions", cycles, setCycles, 1, 10)}
        {configInput("Long Break (min)", longBreakMins, setLongBreakMins, 2, 30)}
      </div>
      <div className="flex w-full justify-center">
        <span className="text-xs text-gray-400 text-center">
          Adjust settings before starting • Vibe with your focus!
        </span>
      </div>
      {/* Audio for beep/haptic feedback */}
      <audio
        ref={beepRef}
        src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAABCxAgAEABAAZGF0YXwAAAAAAAD/BADMAAAAkYAAAM4AAADyAAACagAAAOAAAADAAgAApwAAAKgAAACeAAADXgAAAOsAAADOAAADFAAAAKgAAAD5AAACXwAAAO8AAABrAAADXQAAAK8AAADyAAACegAAAOAAAADAAwAApwAAAK4AAACmAAADVwAAAOhAAADHAAADKAAAALAAAADxAAACcAAAANwAAADBAAADigAAAGsAAADmAAACawAAAOAAAADAAwAApwAAAKcAAACqAAADVgAAAOhAAADFAAADLwAAALAAAADyAAACbAAAANcAAADBAADigAAAGoAAADlAAACaAAAAN8AAADAAwAApwAAAKkAAACoAAADVgAAAOhAAADGAAADLwAAALAAAADyAAACbAAAANgAAADBAADhgAAAGwAAADmAAICAAAAAA=="
        preload="auto"
      />
      {/* Style/pulse keyframes */}
      <style>
        {`
          #focusflow-circle.focusflow-pulse circle:nth-child(2) {
            filter: drop-shadow(0 0 28px #fff4) drop-shadow(0 0 62px ${currentColor});
            stroke-width: 19px !important;
            transition: all 0.28s;
          }
        `}
      </style>
      {/* Pomodoro session tracker at bottom (visual ticks) */}
      <div className="mt-3 flex flex-row gap-1 justify-center items-center">
        {Array.from({ length: cycles }).map((_, idx) => (
          <span
            key={idx}
            className="rounded-full"
            style={{
              width: 14, height: 14,
              marginLeft: idx === 0 ? 0 : 4,
              display: "inline-block",
              background:
                idx + 1 < session
                  ? "#E87A41"
                  : idx + 1 === session
                  ? currentColor
                  : "#2a2624",
              opacity: idx + 1 < session ? 1 : idx + 1 === session ? 0.85 : 0.38,
              boxShadow: idx + 1 < session ? "0 0 2px #E87A41" : "none",
              border: "1.5px solid #20201f",
              transition: "all 0.17s",
            }}
            title={`Session ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
