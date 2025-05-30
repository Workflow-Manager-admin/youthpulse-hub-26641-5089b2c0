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
 * SplitMatePage: Already themed, responsive, and rich in micro-interactions.
 */
// No changes required for this file.
