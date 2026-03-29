import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const register = () => {
    axios.post("https://bank-backend-production-92f5.up.railway.app/user/register", user)
      .then(() => {
        alert("Registered Successfully");
        navigate("/");
      });
  };

  return (
    <div className="card">
      <h2>Register</h2>
<input placeholder="Username" onChange={e => setUser({...user, username:e.target.value})}/>
      <input placeholder="Email" onChange={e => setUser({...user, email:e.target.value})}/>
      <input placeholder="Password" onChange={e => setUser({...user, password:e.target.value})}/>
      <input placeholder="Initial Balance" onChange={e => setUser({...user, balance:e.target.value})}/>

      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;