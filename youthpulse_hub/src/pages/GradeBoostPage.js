import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- GRADE MAPPING --- //
// You can customize this if a different grading scale is needed
const GRADE_MAP = {
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0,
};

const COLORS = [
  "#E87A41", // Main orange
  "#24292F", // Background dark
];

const GRADE_OPTIONS = Object.keys(GRADE_MAP);

// Utility to get default subject entry
function createSubject() {
  return {
    name: "",
    grade: "",
    credits: "",
    errors: {}
  };
}

 // PUBLIC_INTERFACE
/**
 * GradeBoostPage: Interactive CGPA calculator for YouthPulse Hub.
 *
 * - Lets user enter subjects, grades, credits.
 * - Calculates GPA/CGPA and visually shows it with animated circular progress via Recharts.
 * - Features error validation, responsive dark UI, and a Reset button.
 */

// --- GRADE MAPPING --- //
// Duplicate declarations removed—see earlier definitions above.

/**
 * GradeBoostPage: Interactive CGPA calculator for YouthPulse Hub.
 *
 * - Lets user enter subjects, grades, credits.
 * - Calculates GPA/CGPA and visually shows it with animated circular progress via Recharts.
 * - Features error validation, responsive dark UI, and a Reset button.
 */
 // PUBLIC_INTERFACE
function GradeBoostPage() {
  const [subjects, setSubjects] = useState([
    createSubject()
  ]);
  const [gpa, setGPA] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const handleSubjectChange = (idx, field, value) => {
    setFormTouched(true);
    setSubjects(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      if (next[idx].errors) next[idx].errors[field] = undefined;
      return next;
    });
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, createSubject()]);
  };

  const handleRemoveSubject = idx => {
    if (subjects.length === 1) return;
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const validateInputs = () => {
    let valid = true;
    let nextSubjects = subjects.map(subj => {
      let errors = {};
      if (!subj.name.trim()) {
        errors.name = "Name required";
        valid = false;
      }
      if (!GRADE_OPTIONS.includes(subj.grade)) {
        errors.grade = "Select a grade";
        valid = false;
      }
      if (
        !subj.credits ||
        isNaN(Number(subj.credits)) ||
        Number(subj.credits) <= 0
      ) {
        errors.credits = "Enter valid credits";
        valid = false;
      }
      return { ...subj, errors };
    });
    setSubjects(nextSubjects);
    return valid;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      setShowResult(false);
      return;
    }
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(subj => {
      const grade = GRADE_MAP[subj.grade];
      const credits = Number(subj.credits);
      totalPoints += grade * credits;
      totalCredits += credits;
    });
    const computedGPA = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    setGPA(computedGPA);
    setShowResult(true);
  };

  const handleReset = () => {
    setSubjects([createSubject()]);
    setGPA(null);
    setShowResult(false);
    setFormTouched(false);
  };

  const getPercent = (gpa) => Math.max(0, Math.min(1, gpa / 10));

  return (
    <div className="container py-12 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">GradeBoost</h1>
      <p className="text-base sm:text-lg text-orange-300 mb-8 text-center max-w-2xl">
        Enter your subjects, grades, and credits to instantly visualize your CGPA.<br />
        Boost your academic journey with smart insights!
      </p>

      <form 
        className="w-full max-w-2xl bg-[#232428] rounded-xl p-6 shadow-xl mb-8"
        style={{ boxShadow: "0 6px 36px 0 rgba(232,122,65,0.13)" }}
        onSubmit={handleCalculate}
        autoComplete="off"
      >
        <div className="flex flex-col gap-4">
          {subjects.map((subject, idx) => (
            <div
              key={idx}
              className={`bg-[#1A1A20] rounded-lg px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center border border-transparent ${Object.keys(subject.errors).length && formTouched ? "border-orange-400" : ""}`}
            >
              {/* Subject Name */}
              <div className="flex-1 flex flex-col min-w-[80px]">
                <label className="mb-0 text-sm text-gray-200">Subject</label>
                <input
                  type="text"
                  value={subject.name}
                  onChange={e => handleSubjectChange(idx, 'name', e.target.value)}
                  className={`rounded bg-transparent border px-2 py-1 text-white outline-none focus:border-orange-400 transition duration-150 ${subject.errors?.name && formTouched ? 'border-red-400' : 'border-gray-700'}`}
                  placeholder="Eg: Math"
                  minLength={1}
                  maxLength={30}
                  autoFocus={idx === 0}
                />
                <span className="text-xs text-red-400 h-4">
                  {formTouched && subject.errors?.name}
                </span>
              </div>
              {/* Grade */}
              <div className="flex-1 flex flex-col min-w-[60px]">
                <label className="mb-0 text-sm text-gray-200">Grade</label>
                <select
                  value={subject.grade}
                  onChange={e => handleSubjectChange(idx, 'grade', e.target.value)}
                  className={`rounded bg-transparent border px-2 py-1 text-white outline-none focus:border-orange-400 transition duration-150 ${subject.errors?.grade && formTouched ? 'border-red-400' : 'border-gray-700'}`}
                >
                  <option value="" disabled>Select</option>
                  {GRADE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="text-xs text-red-400 h-4">
                  {formTouched && subject.errors?.grade}
                </span>
              </div>
              {/* Credits */}
              <div className="flex-1 flex flex-col min-w-[50px]">
                <label className="mb-0 text-sm text-gray-200">Credits</label>
                <input
                  type="number"
                  value={subject.credits}
                  onChange={e => handleSubjectChange(idx, 'credits', e.target.value)}
                  className={`rounded bg-transparent border px-2 py-1 text-white outline-none focus:border-orange-400 transition duration-150 text-right ${subject.errors?.credits && formTouched ? 'border-red-400' : 'border-gray-700'}`}
                  min={1}
                  max={30}
                  inputMode="numeric"
                  placeholder="Eg: 4"
                  step={1}
                />
                <span className="text-xs text-red-400 h-4">
                  {formTouched && subject.errors?.credits}
                </span>
              </div>
              
              <div className="mt-3 sm:mt-0 flex items-center self-center gap-2">
                <button 
                  type="button"
                  className="btn px-2 py-1 bg-[#373738] text-white text-lg rounded-full shadow-none hover:bg-orange-600 transition"
                  onClick={() => handleRemoveSubject(idx)}
                  tabIndex={0}
                  aria-label="Remove subject"
                  disabled={subjects.length === 1}
                  style={{opacity: subjects.length === 1 ? 0.45 : 1}}
                >−</button>
                {idx === subjects.length - 1 && (
                  <button
                    type="button"
                    className="btn px-2 py-1 bg-orange-500 text-white text-lg rounded-full shadow-none hover:bg-orange-600 transition"
                    onClick={handleAddSubject}
                    tabIndex={0}
                    aria-label="Add subject"
                  >＋</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-end mt-6 gap-4">
          <button
            type="button"
            className="btn bg-gray-700 hover:bg-gray-800 text-white"
            onClick={handleReset}
            tabIndex={0}
          >Reset</button>
          <button
            type="submit"
            className="btn bg-orange-500 hover:bg-orange-600 text-white"
            tabIndex={0}
          >Calculate</button>
        </div>
      </form>

      {/* RESULT VISUALIZATION */}
      {showResult && gpa !== null && (
        <div className="w-full max-w-md flex flex-col items-center mt-4 gap-4">
          <span className="text-lg text-gray-200 font-semibold mb-0">
            Your GPA / CGPA:
          </span>
          <div className="w-52 max-w-fit mx-auto flex flex-col items-center relative">
            <ResponsiveContainer width={208} height={208}>
              <PieChart width={208} height={208}>
                <Pie
                  data={[
                    { value: getPercent(gpa), name: "Score" },
                    { value: 1 - getPercent(gpa), name: "Remainder" }
                  ]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={80}
                  outerRadius={104}
                  paddingAngle={0}
                  animationDuration={1100}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  <Cell key="score" fill={COLORS[0]} />
                  <Cell key="remainder" fill="#24292F" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
              <span className="text-4xl font-bold text-orange-400 tracking-wide drop-shadow">
                {gpa.toFixed(2)}
              </span>
              <span className="text-base text-white/80 font-medium mt-0">
                / <span className="font-bold">10</span>
              </span>
              <span className="text-xs text-gray-400 mt-2">
                {gpa >= 9
                  ? "Excellent! 🔥"
                  : gpa >= 7
                  ? "Great work! 🚀"
                  : gpa >= 5
                  ? "Keep going! 💪"
                  : "Let's aim higher! 🌱"}
              </span>
            </div>
          </div>
          <button
            className="btn bg-orange-500 hover:bg-orange-600"
            onClick={handleReset}
          >Start New Calculation</button>
        </div>
      )}

      {!showResult && (
        <div className="text-sm text-gray-400 mt-6 text-center max-w-xl mx-auto">
          Need a break? Your academic performance is more than just numbers!
        </div>
      )}
    </div>
  );
}

export default GradeBoostPage;
