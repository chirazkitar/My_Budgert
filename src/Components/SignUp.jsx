import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [job, setJob] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleSignUp = async () => {
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload Profile Photo (if provided)

      // Auto-Increment ID
      const userId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "counters", "userCounter");
        const counterDoc = await transaction.get(counterRef);

        if (!counterDoc.exists()) {
          throw new Error("Counter document does not exist!");
        }

        const newId = counterDoc.data().id;
        transaction.update(counterRef, { id: newId + 1 });
        return newId;
      });

      const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

      // Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: userId,
        username,
        email,
        job: job || "Not specified",
        password, // Password should ideally be hashed (but handled by Firebase Auth here)
        budgets: { [currentMonth]: 0 }, // Initialize empty budget

      });

      alert("User registered successfully!");
      // Clear form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setJob("");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="screen">
      <div className="div-1">
        <img src="src/assets/My Budget.gif" className="img-signup" alt="mybudget" />
      </div>
      <div className="div-2">
        <div className="div-2-2">
          <h2 className="form-title">Sign Up</h2>
          <form>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Job:</label>
              <input
                type="text"
                placeholder="Enter job title"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="form-control"
              />
            </div>
            <button className="btn-signup btn-light" type="button" onClick={handleSignUp}>
              Sign Up
            </button>
            <p className="signup-p">You already have an accout ?<a className="signup-a" href="/">Login</a></p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
