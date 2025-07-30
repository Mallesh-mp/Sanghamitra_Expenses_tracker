import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    type: "Debit",
    amount: "",
    receipt: null,
    date: ""
  });
  const [accountBalance, setAccountBalance] = useState(10000); // starting balance
  const [carryOverAmount, setCarryOverAmount] = useState(10000); // carry-over value
  const [addFundsAmount, setAddFundsAmount] = useState("");

  const categories = [
    "Grocery",
    "Household Work",
    "Computer Repair",
    "D-Mart",
    "Utilities",
    "Others"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt") {
      setNewExpense((prev) => ({ ...prev, receipt: files[0] }));
    } else {
      setNewExpense((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addExpense = () => {
    const { category, amount, type, receipt, date } = newExpense;

    if (!category || !amount || !type || !receipt || !date) {
      alert("Please fill in all fields including uploading a receipt.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    const updatedBalance = type === "Debit"
      ? accountBalance - parsedAmount
      : accountBalance + parsedAmount;

    const expenseWithPreview = {
      ...newExpense,
      amount: parsedAmount,
      receiptURL: URL.createObjectURL(receipt)
    };

    setExpenses([...expenses, expenseWithPreview]);
    setAccountBalance(updatedBalance);
    setNewExpense({
      category: "",
      type: "Debit",
      amount: "",
      receipt: null,
      date: ""
    });
  };

  const addFunds = () => {
    const amountToAdd = parseFloat(addFundsAmount);
    if (!isNaN(amountToAdd) && amountToAdd > 0) {
      setAccountBalance(accountBalance + amountToAdd);
      setCarryOverAmount(carryOverAmount + amountToAdd);
      setAddFundsAmount("");
    } else {
      alert("Please enter a valid amount to add.");
    }
  };

  const getTotal = (type) => {
    return expenses
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const getTotalByCategory = () => {
    const totals = {};
    expenses.forEach((expense) => {
      const key = `${expense.category}-${expense.type}`;
      if (!totals[key]) totals[key] = 0;
      totals[key] += expense.amount;
    });
    return totals;
  };

  const categoryTotals = getTotalByCategory();

  const resetMonth = () => {
    setCarryOverAmount(accountBalance);
    setExpenses([]);
  };

  return (
    <div className="container dark-background">
      <h1>Sanghamitra Expense Tracker</h1>

      <div className="form">
        <select name="category" value={newExpense.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="type" value={newExpense.type} onChange={handleChange}>
          <option value="Debit">Debit</option>
          <option value="Credit">Credit</option>
        </select>

        <input
          name="amount"
          value={newExpense.amount}
          onChange={handleChange}
          placeholder="Amount (₹)"
          type="number"
        />

        <input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleChange}
        />

        <input
          name="receipt"
          onChange={handleChange}
          type="file"
          accept="image/*"
        />

        <button onClick={addExpense}>Add</button>
      </div>

      <div className="form" style={{ marginTop: "2rem" }}>
        <input
          type="number"
          placeholder="Add funds to tracker (₹)"
          value={addFundsAmount}
          onChange={(e) => setAddFundsAmount(e.target.value)}
        />
        <button onClick={addFunds}>Add Funds</button>
      </div>

      <h2>All Transactions</h2>
      <ul>
        {expenses.map((e, i) => (
          <li key={i}>
            <strong>{e.category}</strong> - ₹{e.amount} ({e.type})
            <div className="receipt">📅 Date: {e.date}</div>
            <div className="receipt">
              🧾 Receipt:<br />
              <img src={e.receiptURL} alt="Receipt" width="100" style={{ marginTop: "5px", borderRadius: "4px" }} />
            </div>
          </li>
        ))}
      </ul>

      <h2>Totals by Category and Type</h2>
      <ul>
        {Object.entries(categoryTotals).map(([key, total]) => (
          <li key={key}>{key.replace("-", " ➝ ")}: ₹{total}</li>
        ))}
      </ul>

      <h2>Grand Totals</h2>
      <p>🟢 Total Credited: ₹{getTotal("Credit")}</p>
      <p>🔴 Total Debited: ₹{getTotal("Debit")}</p>
      <p>💼 Current Balance: ₹{accountBalance}</p>
      <p>📦 Carry-Over Amount: ₹{carryOverAmount}</p>
      <button onClick={resetMonth}>Reset Month & Carry Over</button>
    </div>
  );
};

export default App;
