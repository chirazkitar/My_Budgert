import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore imports

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigation
  const db = getFirestore(); // Firestore instance

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //token generate
      const token = await user.getIdToken();
      console.log("token", token);

      //alert("Login successful!");

      //store the token 
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.uid);

      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid); // Assume "users" is the Firestore collection
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const budget = userData.budget || [];

        // Navigate based on the budget array
       
          navigate("/Home");
       
      } else {
        alert("User data not found!");
      }

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-div">
        <img src="src/assets/logo-light.png" className="img-login"/>
        <div className="div-2-2">
      <h2 className="f">Login</h2>
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn-login btn-light" type="button" onClick={handleLogin}>
          Login
        </button>
        <p className="signup-p">You don't have an account? <a href="/Signup" className="signup-a">Sign Up</a></p>
      </form>
      </div>
    </div>
  );
};

export default Login;
