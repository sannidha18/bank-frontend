import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("users");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://bank-backend-production-92f5.up.railway.app/admin/users")
      .then(res => setUsers(res.data));

    axios.get("https://bank-backend-production-92f5.up.railway.app/admin/transactions")
      .then(res => setTransactions(res.data));
  }, []);

  const chartData = [
    { name: "Users", value: users.length },
    { name: "Transactions", value: transactions.length }
  ];

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-container">

      {/* 🔥 NAVBAR */}
      <div className="navbar">
        <h2>Admin Panel
          
        </h2>
        <br></br>

        <div className="nav-links">
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>

          <button
            className={activeTab === "chart" ? "active" : ""}
            onClick={() => setActiveTab("chart")}
          >
            Overview
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="admin-main">

        {/* USERS */}
        {activeTab === "users" && (
          <div className="section">
            <h2>👥 Users</h2>
            <div className="table">
              {users.map(u => (
                <div key={u.id} className="row">
                  <span>{u.username}</span>
                  <span>₹{u.balance}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {activeTab === "transactions" && (
          <div className="section">
            <h2>💸 Transactions</h2>
            <div className="table">
              {transactions.slice().reverse().map(t => (
                <div key={t.id} className="row">
                  <span>{t.type}</span>
                  <span>₹{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHART */}
        {activeTab === "chart" && (
          <div className="section">
            <h2>📊 System Overview</h2>

            <div className="chart-box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#cbd5f5" />
                  <YAxis stroke="#cbd5f5" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="value" fill="#7c3aed" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;