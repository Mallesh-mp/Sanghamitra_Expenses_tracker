import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const AdminDashboard = ({ expenses }) => {
  const totalDebit = expenses.filter(e => e.type === "Debit").reduce((sum, e) => sum + e.amount, 0);
  const totalCredit = expenses.filter(e => e.type === "Credit").reduce((sum, e) => sum + e.amount, 0);

  const categoryMap = {};
  expenses.forEach(e => {
    const key = `${e.category} (${e.type})`;
    categoryMap[key] = (categoryMap[key] || 0) + e.amount;
  });

  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa33ff", "#ff3377"];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>💰 Total Credit: ₹{totalCredit}</h2>
      <h2>💸 Total Debit: ₹{totalDebit}</h2>

      <div style={{ width: "100%", height: 300, marginBottom: "2rem" }}>
        <h3>Expenses by Category & Type</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <h3>Amount by Category</h3>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginTop: "2rem" }}>📋 All Transactions</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e, i) => (
            <tr key={i}>
              <td>{e.category}</td>
              <td>{e.type}</td>
              <td>₹{e.amount}</td>
              <td>{e.date}</td>
              <td>
                {e.receiptURL && (
                  <a href={e.receiptURL} target="_blank" rel="noreferrer">
                    View
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
