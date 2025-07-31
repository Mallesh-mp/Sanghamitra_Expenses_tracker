import React, { useState } from "react";

const TrackerPage = ({ expenses, setExpenses, accountBalance, setAccountBalance }) => {
  const [initial, setInitial] = useState("");
  const [expenseForms, setExpenseForms] = useState([
    { category: "", type: "Debit", amount: "", receipt: null, date: "" }
  ]);

  const categories = [
    "Grocery",
    "Household Work",
    "Computer Repair",
    "D-Mart",
    "Utilities",
    "Others"
  ];

  // ⏳ One-time starting balance input
  if (accountBalance === null) {
    const confirmInitialBalance = () => {
      const amount = parseFloat(initial);
      if (!isNaN(amount) && amount >= 0) {
        setAccountBalance(amount);
      } else {
        alert("Please enter a valid starting balance.");
      }
    };

    return (
      <div className="form">
        <h2>Enter Starting Balance</h2>
        <input
          type="number"
          value={initial}
          onChange={(e) => setInitial(e.target.value)}
          placeholder="Enter starting ₹ amount"
        />
        <button onClick={confirmInitialBalance}>Set Balance</button>
      </div>
    );
  }

  // 📥 Add multiple expenses
  const handleChange = (index, e) => {
    const { name, value, files } = e.target;
    const updated = [...expenseForms];
    updated[index][name] = name === "receipt" ? files[0] : value;
    setExpenseForms(updated);
  };

  const addExpenseRow = () => {
    setExpenseForms([
      ...expenseForms,
      { category: "", type: "Debit", amount: "", receipt: null, date: "" }
    ]);
  };

  const submitAllExpenses = () => {
    const validExpenses = [];

    for (let exp of expenseForms) {
      const { category, type, amount, receipt, date } = exp;
      if (!category || !amount || !type || !receipt || !date) {
        alert("Please fill all fields and upload receipt for each entry.");
        return;
      }

      const parsedAmount = parseFloat(amount);
      const updatedBalance =
        type === "Debit" ? accountBalance - parsedAmount : accountBalance + parsedAmount;

      validExpenses.push({
        ...exp,
        amount: parsedAmount,
        receiptURL: URL.createObjectURL(receipt),
        month: new Date(date).toLocaleString("default", { month: "long", year: "numeric" })
      });

      setAccountBalance(updatedBalance);
    }

    setExpenses([...expenses, ...validExpenses]);
    setExpenseForms([
      { category: "", type: "Debit", amount: "", receipt: null, date: "" }
    ]);
  };

  const resetMonth = () => {
    setExpenses([]);
    alert("All expenses have been cleared for the month.");
  };

  return (
    <div>
      <h1>Sanghamitra Expense Tracker</h1>

      {expenseForms.map((form, idx) => (
        <div className="form" key={idx} style={{ marginBottom: "1.5rem" }}>
          <select
            name="category"
            value={form.category}
            onChange={(e) => handleChange(idx, e)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={form.type}
            onChange={(e) => handleChange(idx, e)}
          >
            <option value="Debit">Debit</option>
            <option value="Credit">Credit</option>
          </select>

          <input
            name="amount"
            value={form.amount}
            onChange={(e) => handleChange(idx, e)}
            placeholder="Amount (₹)"
            type="number"
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={(e) => handleChange(idx, e)}
          />

          <input
            name="receipt"
            onChange={(e) => handleChange(idx, e)}
            type="file"
            accept="image/*"
          />
        </div>
      ))}

      <button onClick={addExpenseRow}>➕ Add Another</button>
      <button onClick={submitAllExpenses} style={{ marginLeft: "1rem" }}>
        ✅ Submit All
      </button>

      <h2>💼 Current Balance: ₹{accountBalance}</h2>
      <button onClick={resetMonth} style={{ marginTop: "1rem" }}>
        🔁 Reset Month
      </button>
    </div>
  );
};

export default TrackerPage;
