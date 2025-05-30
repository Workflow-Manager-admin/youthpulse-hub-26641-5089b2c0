import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import all pages
import HomePage from './pages/HomePage';
import GradeBoostPage from './pages/GradeBoostPage';
import SplitMatePage from './pages/SplitMatePage';
import FocusFlowPage from './pages/FocusFlowPage';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className="logo">
                <span className="logo-symbol">*</span> KAVIA AI
              </div>
              {/* Navigation links to the feature pages */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link className="btn" to="/">Home</Link>
                <Link className="btn" to="/gradeboost">GradeBoost</Link>
                <Link className="btn" to="/splitmate">SplitMate</Link>
                <Link className="btn" to="/focusflow">FocusFlow</Link>
              </div>
            </div>
          </div>
        </nav>
        <main style={{ marginTop: '72px' }}>
          {/* Define routes here */}
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