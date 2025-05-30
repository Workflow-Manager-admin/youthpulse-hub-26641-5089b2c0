import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
/**
 * GlowingIcon renders a large, circular icon with a glowing and scaling hover effect.
 * Already uses responsive design, accent theme, and Tailwind-powered interactions.
 */
export default function GlowingIcon({ icon, label, to, glowColor = "from-orange-400 via-pink-500 to-yellow-400" }) {
  const navigate = useNavigate();
  return (
    <button
      className={
        `
        flex flex-col items-center 
        rounded-full 
        bg-gradient-to-tr ${glowColor}
        w-32 h-32 sm:w-40 sm:h-40
        shadow-lg shadow-orange-500/50 
        transition 
        hover:scale-110
        hover:shadow-2xl 
        hover:brightness-110
        focus:outline-none
        border-4 border-transparent
        hover:border-orange-400
        focus:ring-4 focus:ring-orange-400/30
        duration-200
        ease-in-out
        group
        mx-4
        `
      }
      style={{
        boxShadow: "0 0 32px 0 rgba(255,105,0,0.35), 0 2px 8px 0 rgba(0,0,0,0.18)",
      }}
      title={label}
      aria-label={label}
      onClick={() => {
        if (to) navigate(to);
      }}
      tabIndex={0}
    >
      <span className="text-5xl sm:text-6xl mb-2 mt-4 drop-shadow-lg text-white">{icon}</span>
      <span className="text-base sm:text-lg font-semibold tracking-wide text-white drop-shadow-md">
        {label}
      </span>
    </button>
  );
}

GlowingIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  glowColor: PropTypes.string,
};
