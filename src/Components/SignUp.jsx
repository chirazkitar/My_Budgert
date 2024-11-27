import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, runTransaction } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);
  const [job, setJob] = useState("");

  const defaultPhoto =
    "src/assets/pfp.png"; // Replace with your default photo URL

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
      let photoURL = defaultPhoto;
      if (photo) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }

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

      // Update Profile
      await updateProfile(user, {
        displayName: username,
        photoURL,
      });

      // Store User Data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: userId,
        username,
        email,
        job: job || "Not specified",
        photoURL,
        password, // Password should ideally be hashed (but handled by Firebase Auth here)
        budget: [], // Initialize empty budget
      });

      alert("User registered successfully!");
      // Clear form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setPhoto(null);
      setJob("");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div class="screen">
    <div class="div-1">
        <img src="src/assets/My Budget.gif" class="img-signup" alt="mybudget" />
    </div>
    <div class="div-2">
      <div class="div-2-2">
      <h2 class="form-title">Sign Up</h2>
      <form>
        <div class="form-group">
          <label>Username:</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
            class="form-control"
          />
        </div>
        <div>
          <label class="form-group">Profile Photo:</label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Job:</label>
          <input
            type="text"
            placeholder="Enter job title"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            class="form-control"
          />
        </div>
        <button class="btn-signup" type="button" onClick={handleSignUp}>
          Sign Up
        </button>
        <p class="signup-p">You already have an accout ?<a class="signup-a" href="/Login">Login</a></p>
      </form>
      </div>
    </div>
    </div>
  );
};

export default SignUp;
