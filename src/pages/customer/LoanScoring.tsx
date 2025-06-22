import React, { useState } from 'react';

const LoanScoring = () => {
  const [form, setForm] = useState({ amount: '', tenure: '', income: '' });
  const [score, setScore] = useState<number | null>(null);
  const [eligible, setEligible] = useState<boolean | null>(null);

  const handleCalculate = () => {
    // Mock scoring logic
    const amt = Number(form.amount);
    const inc = Number(form.income);
    const scr = Math.round((inc / amt) * 100);
    setScore(scr);
    setEligible(scr > 50);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Loan Scoring</h1>
      <div className="mb-6 bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Check Your Loan Eligibility</h2>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Loan Amount"
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Tenure (months)"
          type="number"
          value={form.tenure}
          onChange={e => setForm({ ...form, tenure: e.target.value })}
        />
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Monthly Income"
          type="number"
          value={form.income}
          onChange={e => setForm({ ...form, income: e.target.value })}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCalculate}>Calculate Score</button>
      </div>
      {score !== null && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <p>Score: <span className="font-bold">{score}</span></p>
          <p>Status: <span className={`font-bold ${eligible ? 'text-green-600' : 'text-red-600'}`}>{eligible ? 'Eligible' : 'Not Eligible'}</span></p>
        </div>
      )}
    </div>
  );
};

export default LoanScoring; 