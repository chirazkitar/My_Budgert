import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div class="login-div">
        <img src="src/assets/logo-light.png" class="img-login"/>
        <div class="div-2-2">
      <h2 class="f">Login</h2>
      <form>
        <div class="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            class="form-control"
            
          />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="form-control"
          />
        </div>
        <button class="btn-login" type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
      </div>
    </div>
  );
};

export default Login;
