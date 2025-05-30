import React from 'react';

// PUBLIC_INTERFACE
export default function HomePage() {
  /** This is the public HomePage component for the main hub. */
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Welcome to YouthPulse Hub</h1>
      <p className="text-lg mb-2">Empowering young adults with smart and stylish life tools.</p>
      <ul className="list-disc pl-6">
        <li>GradeBoost - Academic performance insights</li>
        <li>SplitMate - Group expense management</li>
        <li>FocusFlow - Pomodoro productivity tracker</li>
      </ul>
    </div>
  );
}
