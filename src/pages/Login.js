import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {

    // 🔥 validation
    if (!username.trim() || !password.trim()) {
      alert("Please enter all fields ❗");
      return;
    }

    console.log("Trying:", username, password);

    axios.post("https://bank-backend-production-92f5.up.railway.app/user/login", {
      username: username.trim(),
      password: password.trim()
    })
    .then(res => {

      console.log("LOGIN RESPONSE:", res.data); // 🔥 debug

      // ❌ invalid login
      if (!res.data) {
        alert("Invalid credentials ❌");
        return;
      }

      // ✅ save user
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🔥 ADMIN ROUTE
      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    })
    .catch(err => {
      console.error("Error:", err);
      alert("Backend error ❌");
    });
  };

  return (
    <div className="card">
      <h2>🔐 Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <p onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
        New user? Register
      </p>
    </div>
  );
}

export default Login;