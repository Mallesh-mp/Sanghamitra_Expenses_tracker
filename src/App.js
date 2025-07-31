// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TrackerPage from "./TrackerPage";
import TransactionsPage from "./TransactionsPage";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [accountBalance, setAccountBalance] = useState(10000);

  return (
    <Router>
      <div className="container dark-background">
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/">🏠 Tracker</Link> |{" "}
          <Link to="/transactions">📜 Transactions</Link> |{" "}
          <Link to="/admin">👑 Admin</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <TrackerPage
                expenses={expenses}
                setExpenses={setExpenses}
                accountBalance={accountBalance}
                setAccountBalance={setAccountBalance}
              />
            }
          />
          <Route
            path="/transactions"
            element={<TransactionsPage expenses={expenses} />}
          />
          <Route
            path="/admin"
            element={<AdminDashboard expenses={expenses} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
