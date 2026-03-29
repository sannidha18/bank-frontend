import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="navbar">
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/transactions")}>Transactions</button>
      <button onClick={() => navigate("/chatbot")}>Chatbot</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;