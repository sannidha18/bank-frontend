import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const [users, setUsers] = useState([]);
  const [toUser, setToUser] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  // ✅ Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!currentUser) return;

        const res = await axios.get(
          "https://bank-backend-production-92f5.up.railway.app/user/all"
        );

        const filtered = res.data.filter(u => u.id !== currentUser.id);
        setUsers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  // ✅ Filter users
  const filteredUsers = users.filter(
    u =>
      u.username &&
      u.id !== Number(toUser) &&
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Transfer
  const transfer = () => {
    if (!toUser || !amount) {
      alert("Fill all fields ❗");
      return;
    }

    axios
      .post(
        "https://bank-backend-production-92f5.up.railway.app/transaction/transfer",
        {
          senderId: currentUser.id,
          receiverId: toUser,
          amount: amount,
          password: currentUser.password
        }
      )
      .then(res => {
        alert(res.data);

        const updatedUser = {
          ...currentUser,
          balance: currentUser.balance - Number(amount)
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
        alert("Transaction failed ❌");
      });
  };

  if (!currentUser) {
    return <h2>Please login first ❗</h2>;
  }

  return (
    <div>
      <Header />
      <Navbar />

      <div className="card">
        <h2>💸 Send Money</h2>

        {/* Sender */}
        <p>
          <b>From:</b> {currentUser.username} (₹{currentUser.balance})
        </p>

        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="Search receiver..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setToUser(""); // ✅ reset selection while typing
          }}
        />

        {/* 🔽 Dropdown */}
        {search && !toUser && (
          <div
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              border: "1px solid #333",
              borderRadius: "8px",
              marginTop: "5px",
              background: "#0f172a",
              color: "#fff"
            }}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map(u => (
                <div
                  key={u.id}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #222"
                  }}
                  onClick={() => {
                    setToUser(u.id);
                    setSearch(u.username); // ✅ show selected user
                  }}
                >
                  {u.username}
                </div>
              ))
            ) : (
              <div style={{ padding: "10px", color: "#aaa" }}>
                No users found
              </div>
            )}
          </div>
        )}

        

        {/* Amount */}
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <br /><br />

        <button onClick={transfer}>Send Money</button>
      </div>
    </div>
  );
}

export default Transactions;