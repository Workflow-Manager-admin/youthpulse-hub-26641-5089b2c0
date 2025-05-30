import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Pie chart palette for up to 8 contributors, can be expanded if needed
const PIE_COLORS = [
  "#42A5F5", // blue
  "#26D6B2", // greenish
  "#FFA726", // orange
  "#F06292", // pink
  "#FFD600", // yellow
  "#AB47BC", // purple
  "#90CAF9", // sky
  "#EF5350", // red
];

function createPerson() {
  return {
    name: "",
    amount: "",
    errors: {},
  };
}

/**
 * Compute split: for N people, each with an amount, returns:
 *   - perHead: target per-person share
 *   - array of { name, paid, diff } (diff > 0 means they gave more than share, <0 means they owe)
 *   - simplified settlements: [{ from, to, amount }]
 */
function calculateSplits(people) {
  const cleaned = people
    .map((p) => ({
      ...p,
      paid: isNaN(Number(p.amount)) ? 0 : Number(p.amount),
    }))
    .filter((p) => p.name.trim());
  if (cleaned.length === 0) return { perHead: 0, results: [], settlements: [] };

  const total = cleaned.reduce((sum, p) => sum + p.paid, 0);
  const perHead = total / cleaned.length;

  // Calculate net balance for each person: positive = to receive, negative = to pay
  const results = cleaned.map((p) => ({
    name: p.name,
    paid: p.paid,
    diff: +(p.paid - perHead).toFixed(2), // 2 decimal precision
  }));

  // Create settlements: min # of transactions between payers and receivers
  // Use greedy algorithm
  let owes = results
    .filter((r) => r.diff < -0.01)
    .map((r) => ({ ...r, diff: -r.diff })); // convert to positive owed amount
  let gets = results.filter((r) => r.diff > 0.01);

  const settlements = [];
  owes.sort((a, b) => b.diff - a.diff);
  gets.sort((a, b) => b.diff - a.diff);

  while (owes.length && gets.length) {
    const payer = owes[0];
    const receiver = gets[0];
    const amt = Math.min(payer.diff, receiver.diff);

    settlements.push({
      from: payer.name,
      to: receiver.name,
      amount: +amt.toFixed(2),
    });

    payer.diff -= amt;
    receiver.diff -= amt;
    if (payer.diff < 0.01) owes.shift();
    if (receiver.diff < 0.01) gets.shift();
  }

  return { perHead, results, settlements };
}

// PUBLIC_INTERFACE
/**
 * SplitMatePage: Group bill splitting tool for YouthPulse Hub.
 * - Lets users input participant names & contributions.
 * - Calculates who owes whom & displays results with both pie chart and summary.
 * - Responsive, modern dark UI consistent with app styling.
 */
export default function SplitMatePage() {
  const [people, setPeople] = useState([createPerson(), createPerson()]);
  const [showResult, setShowResult] = useState(false);
  const [splitData, setSplitData] = useState(null);
  const [formTouched, setFormTouched] = useState(false);

  // Form interaction handlers
  function handlePersonChange(idx, field, value) {
    setFormTouched(true);
    setPeople((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      if (next[idx].errors) next[idx].errors[field] = undefined;
      return next;
    });
  }
  function handleAddPerson() {
    setPeople([...people, createPerson()]);
  }
  function handleRemovePerson(idx) {
    if (people.length <= 2) return; // Minimum two for bill split
    setPeople(people.filter((_, i) => i !== idx));
  }
  function validateInputs() {
    let valid = true;
    let nextPeople = people.map((p) => {
      let errors = {};
      if (!p.name.trim()) {
        errors.name = "Name required";
        valid = false;
      }
      if (!p.amount || isNaN(Number(p.amount)) || Number(p.amount) < 0) {
        errors.amount = "Enter valid amount";
        valid = false;
      }
      return { ...p, errors };
    });
    setPeople(nextPeople);
    return valid;
  }

  function handleCalculate(e) {
    e.preventDefault();
    if (!validateInputs()) {
      setShowResult(false);
      return;
    }
    const result = calculateSplits(people);
    setSplitData(result);
    setShowResult(true);
  }

  function handleReset() {
    setPeople([createPerson(), createPerson()]);
    setSplitData(null);
    setShowResult(false);
    setFormTouched(false);
  }

  // For pie chart, need [{name, value}] where value = amount paid
  const chartData =
    people
      .filter((p) => p.name.trim() && !isNaN(Number(p.amount)))
      .map((p) => ({
        name: p.name,
        value: Number(p.amount),
      })) || [];

  return (
    <div className="container py-12 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">
        SplitMate
      </h1>
      <p className="text-base sm:text-lg text-blue-300 mb-8 text-center max-w-2xl">
        Easily split group expenses. Enter names and amounts paid to find out who owes whom—no more awkward calculations!
      </p>
      {/* --- FORM --- */}
      <form
        className="w-full max-w-2xl bg-[#21242A] rounded-xl p-6 shadow-xl mb-8"
        style={{
          boxShadow: "0 8px 38px 0 rgba(66,165,245,0.13)",
        }}
        onSubmit={handleCalculate}
        autoComplete="off"
      >
        <div className="flex flex-col gap-4">
          {people.map((person, idx) => (
            <div
              key={idx}
              className={`bg-[#181A1F] rounded-lg px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center border border-transparent ${
                Object.keys(person.errors).length && formTouched
                  ? "border-blue-400"
                  : ""
              }`}
            >
              {/* Name */}
              <div className="flex-1 flex flex-col min-w-[90px]">
                <label className="mb-0 text-sm text-gray-200">Name</label>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handlePersonChange(idx, "name", e.target.value)}
                  className={`rounded bg-transparent border px-2 py-1 text-white outline-none focus:border-blue-400 transition duration-150 ${
                    person.errors?.name && formTouched
                      ? "border-red-400"
                      : "border-gray-700"
                  }`}
                  placeholder={`Eg: ${idx % 2 === 0 ? "Alex" : "Sam"}`}
                  minLength={1}
                  maxLength={22}
                  autoFocus={idx === 0}
                />
                <span className="text-xs text-red-400 h-4">
                  {formTouched && person.errors?.name}
                </span>
              </div>
              {/* Amount */}
              <div className="flex-1 flex flex-col min-w-[70px]">
                <label className="mb-0 text-sm text-gray-200">
                  Amount Paid&nbsp;₹
                </label>
                <input
                  type="number"
                  value={person.amount}
                  onChange={(e) =>
                    handlePersonChange(idx, "amount", e.target.value)
                  }
                  className={`rounded bg-transparent border px-2 py-1 text-white outline-none focus:border-blue-400 transition duration-150 text-right ${
                    person.errors?.amount && formTouched
                      ? "border-red-400"
                      : "border-gray-700"
                  }`}
                  min={0}
                  max={999999}
                  inputMode="numeric"
                  placeholder="Eg: 200"
                  step={0.01}
                />
                <span className="text-xs text-red-400 h-4">
                  {formTouched && person.errors?.amount}
                </span>
              </div>
              {/* Remove/Add buttons */}
              <div className="mt-3 sm:mt-0 flex items-center self-center gap-2">
                <button
                  type="button"
                  className="btn px-2 py-1 bg-[#373738] text-white text-lg rounded-full shadow-none hover:bg-blue-600 transition"
                  onClick={() => handleRemovePerson(idx)}
                  tabIndex={0}
                  aria-label="Remove person"
                  disabled={people.length <= 2}
                  style={{ opacity: people.length <= 2 ? 0.45 : 1 }}
                >
                  −
                </button>
                {/* Add button only for last row */}
                {idx === people.length - 1 && (
                  <button
                    type="button"
                    className="btn px-2 py-1 bg-blue-500 text-white text-lg rounded-full shadow-none hover:bg-green-500 transition"
                    onClick={handleAddPerson}
                    tabIndex={0}
                    aria-label="Add person"
                  >
                    ＋
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Action buttons */}
        <div className="flex w-full justify-end mt-6 gap-4">
          <button
            type="button"
            className="btn bg-gray-700 hover:bg-gray-800 text-white"
            onClick={handleReset}
            tabIndex={0}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn bg-blue-500 hover:bg-blue-600 text-white"
            tabIndex={0}
          >
            Calculate
          </button>
        </div>
      </form>
      {/* --- RESULTS --- */}
      {showResult && splitData && (
        <div className="w-full max-w-lg mx-auto bg-[#222732] rounded-xl px-6 py-6 shadow-lg flex flex-col gap-4 items-center">
          <h2 className="text-lg font-semibold text-blue-200 mb-1 -mt-2">
            Results
          </h2>
          {/* Pie chart visualization */}
          <div className="w-64 h-64 relative mx-auto mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  innerRadius={72}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={1}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  isAnimationActive={true}
                  animationDuration={850}
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={entry.name} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `₹${Number(val).toLocaleString()}`}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center pointer-events-none">
              <span className="text-sm text-gray-400 font-medium">
                Total
              </span>
              <span className="text-3xl font-semibold text-white">
                ₹{chartData.reduce((sum, e) => sum + e.value, 0).toLocaleString()}
              </span>
              <span className="mt-1 text-xs text-blue-300 font-semibold">
                / {chartData.length} people
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-400 font-normal mt-0 mb-1 text-center">
            <span>
              Per person should pay:{" "}
              <span className="text-blue-200 font-semibold">
                ₹{splitData.perHead.toFixed(2)}
              </span>
            </span>
          </div>
          {/* Show the net balances */}
          <div className="w-full">
            <h3 className="text-base font-semibold text-blue-300 mt-2 mb-1">Balances</h3>
            <ul className="text-sm text-white/90 grid gap-1">
              {splitData.results.map((res, i) => (
                <li key={res.name} className="flex gap-2 items-center">
                  <span
                    className="inline-block rounded-full w-2 h-2 mr-1"
                    style={{
                      background: PIE_COLORS[i % PIE_COLORS.length],
                    }}
                  ></span>
                  <span className="font-medium">{res.name}</span>
                  <span className="ml-2 text-xs font-semibold px-2 py-[2px] rounded-sm"
                    style={{
                      background:
                        res.diff < -0.01
                          ? "#ffe4e6"
                          : res.diff > 0.01
                          ? "#d1fae5"
                          : "transparent",
                      color:
                        res.diff < -0.01 ? "#de3b6d" :
                        res.diff > 0.01 ? "#038f4c" : "#ccc"
                    }}
                  >
                    {res.diff > 0.01 && <>Gets back ₹{res.diff.toFixed(2)}</>}
                    {res.diff < -0.01 && <>Owes ₹{(-res.diff).toFixed(2)}</>}
                    {Math.abs(res.diff) <= 0.01 && <>Settled</>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Show settlements */}
          <div className="w-full">
            <h3 className="text-base font-semibold text-blue-300 mt-3 mb-1">Settlements</h3>
            {splitData.settlements.length ? (
              <ul className="text-sm text-white/90 grid gap-1">
                {splitData.settlements.map((settle, i) => (
                  <li
                    key={i}
                    className="flex gap-2 items-center px-3 py-1 rounded-lg bg-gradient-to-br from-blue-900/80 to-blue-700/60"
                  >
                    <span className="font-semibold text-blue-200">{settle.from}</span>
                    <span>pays</span>
                    <span className="font-semibold text-green-200">{settle.to}</span>
                    <span>
                      <span className="ml-2 font-bold text-blue-300 text-base">
                        ₹{settle.amount.toFixed(2)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm py-1 text-green-400 font-bold">No settlements needed!</div>
            )}
          </div>
          <button
            className="btn mt-4 bg-blue-500 hover:bg-green-500"
            onClick={handleReset}
          >
            Start New Split
          </button>
        </div>
      )}
      {/* Friendly hint for first timers */}
      {!showResult && (
        <div className="text-sm text-gray-400 mt-6 text-center max-w-xl mx-auto">
          Pro tip: For restaurant bills, rent shares, trip expenses and more—let SplitMate do the math!
        </div>
      )}
    </div>
  );
}
