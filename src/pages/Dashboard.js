import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/navbar";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // ✅ function to fetch latest data
  const fetchData = () => {
    if (!user) return;

    // 🔥 fetch updated user (balance)
    axios.get(`https://bank-backend-production-92f5.up.railway.app/user/get/${user.id}`)
      .then(res => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      });

    // 🔥 fetch transactions
    axios.get(`https://bank-backend-production-92f5.up.railway.app/transaction/history/${user.id}`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  };

  // ✅ load + auto refresh
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 3000); // every 3 sec
    return () => clearInterval(interval);
  }, [fetchData]);

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div>
      <Header />
      <Navbar />

      {/* User Info */}
      <div className="card">
        <h2>👋 Hello, {user.username}</h2>
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
              const isCredit = t.type.includes("Received");

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