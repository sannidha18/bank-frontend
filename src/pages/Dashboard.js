import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    if (!user?.id) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `https://bank-backend-production-92f5.up.railway.app/transaction/history/${user.id}`
        );

        setTransactions(res.data);

      } catch (err) {
        console.error("Transaction error:", err);
      }
    };

    // first call
    fetchTransactions();

    // refresh every 5 sec
    const interval = setInterval(fetchTransactions, 5000);

    return () => clearInterval(interval);

  }, [user?.id]);

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div>
      <Header />
      <Navbar />

      {/* User Info */}
      <div className="card">
        <h2>👋 Hello, {user.username || "User"}</h2>
        <p><b>Balance:</b> ₹{user.balance}</p>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3>📊 Transaction History</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <div className="txn-list">
            {[...transactions].reverse().map((t, index) => {
              const isCredit = t.type?.includes("Received");

              return (
                <div
                  key={index}
                  className={`txn-item ${isCredit ? "credit-bg" : "debit-bg"}`}
                >
                  <div>
                    <div className="txn-text">
                      {isCredit ? "⬇ " : "⬆ "} {t.type}
                    </div>

                    <div className="txn-time">
                      {new Date(t.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <div className="txn-amount">
                    ₹{t.amount}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;