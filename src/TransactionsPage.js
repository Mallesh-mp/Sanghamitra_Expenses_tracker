import React, { useState } from "react";

const TransactionsPage = ({ expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Extract available years from expenses
  const yearOptions = [
    ...new Set(expenses.map((e) => {
      const y = e.date ? new Date(e.date).getFullYear() : null;
      return y;
    }).filter(Boolean))
  ].sort((a, b) => b - a);

  // Prepare filtered list
  const filtered = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const monthMatch =
      selectedMonth === "All" || expenseDate.toLocaleString("default", { month: "long" }) === selectedMonth;
    const yearMatch =
      selectedYear === "All" || expenseDate.getFullYear().toString() === selectedYear;
    return monthMatch && yearMatch;
  });

  const getTotal = (type) =>
    filtered.filter((e) => e.type === type).reduce((sum, e) => sum + e.amount, 0);

  const getTotalByCategory = () => {
    const totals = {};
    filtered.forEach((expense) => {
      const key = `${expense.category}-${expense.type}`;
      if (!totals[key]) totals[key] = 0;
      totals[key] += expense.amount;
    });
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  return (
    <div>
      <h1>Transactions</h1>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <label htmlFor="month">📅 Filter by Month:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="All">All</option>
          {monthsList.map((month, i) => (
            <option key={i} value={month}>{month}</option>
          ))}
        </select>

        <label htmlFor="year">🗓️ Year:</label>
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="All">All</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <h2>Summary for: {selectedMonth} {selectedYear}</h2>
      <p>🟢 Total Credited: ₹{getTotal("Credit")}</p>
      <p>🔴 Total Debited: ₹{getTotal("Debit")}</p>

      <h3>Category Totals</h3>
      <ul>
        {Object.entries(categoryTotals).map(([key, val]) => (
          <li key={key}>{key.replace("-", " ➝ ")}: ₹{val}</li>
        ))}
      </ul>

      <h3>All Transactions</h3>
      <ul>
        {filtered.map((e, i) => (
          <li key={i}>
            <strong>{e.category}</strong> - ₹{e.amount} ({e.type})
            <div>📅 {e.date}</div>
            <div>
              🧾 <img src={e.receiptURL} alt="Receipt" width="100" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
