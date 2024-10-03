// src/App.js
import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const App = () => {
  const [user, setUser] = useState(null);

  const googleProvider = new GoogleAuthProvider();

  // Fungsi untuk login dengan Google dan kirim data ke backend
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      console.log("User Info: ", user);

      // Kirim data ke backend
      await sendUserDataToBackend(user);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  // Fungsi untuk mengirim data user ke backend
  const sendUserDataToBackend = async (user) => {
    const payload = {
      googleId: user.uid,
      name: user.displayName,
      email: user.email,
    };

    try {
      const response = await fetch("http://api-backend.com/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send user data to backend");
      }

      const data = await response.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error sending user data to backend", error);
    }
  };

  // logout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!user ? (
        <div>
          <h2>Please Sign In</h2>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <p>Email: {user.email}</p>
          <img src={user.photoURL} alt={user.displayName} />
          <br />
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default App;
