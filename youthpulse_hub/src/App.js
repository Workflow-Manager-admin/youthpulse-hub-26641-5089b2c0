import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import GradeBoostPage from './pages/GradeBoostPage';
import SplitMatePage from './pages/SplitMatePage';
import FocusFlowPage from './pages/FocusFlowPage';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App component for YouthPulse Hub.
   * Applies a dark, modern layout and responsive accent navbar.
   */
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#1a1a1a] text-white font-sans">
        {/* Navbar with sticky, glowing corners */}
        <nav className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-[#19181b] via-[#151419] to-[#1f1b22] border-b border-[#ffffff12] shadow-md shadow-orange-900/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 sm:px-8">
            <div className="flex items-center gap-2 font-black text-lg tracking-wide select-none">
              <span className="text-[#E87A41] text-2xl animate-pulse">*</span>
              <span className="font-bold text-orange-200">KAVIA AI</span>
            </div>
            <div className="hidden sm:flex gap-2 md:gap-4">
              <Link className="px-4 py-1.5 rounded-md font-semibold transition bg-[#ab221700] text-orange-300 hover:bg-[#E87A41] hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#19181b]" to="/">Home</Link>
              <Link className="px-4 py-1.5 rounded-md font-semibold transition bg-[#272A2E] text-orange-300 hover:bg-[#E87A41] hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#19181b]" to="/gradeboost">GradeBoost</Link>
              <Link className="px-4 py-1.5 rounded-md font-semibold transition bg-[#1e2c2f] text-blue-200 hover:bg-[#26D6B2] hover:text-[#15161e] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#19181b]" to="/splitmate">SplitMate</Link>
              <Link className="px-4 py-1.5 rounded-md font-semibold transition bg-[#2a0820] text-pink-300 hover:bg-[#B81F7B] hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-[#19181b]" to="/focusflow">FocusFlow</Link>
            </div>
            <div className="flex sm:hidden">
              {/* Mobile nav dropdown could go here for extensibility. */}
            </div>
          </div>
        </nav>
        {/* Main content shifted below navbar */}
        <main className="flex-1 pt-20 sm:pt-24 bg-[#18181b] flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gradeboost" element={<GradeBoostPage />} />
            <Route path="/splitmate" element={<SplitMatePage />} />
            <Route path="/focusflow" element={<FocusFlowPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;