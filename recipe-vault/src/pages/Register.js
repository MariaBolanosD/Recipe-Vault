import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const registerUser = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        username,
        email,
        password,
      });
      setMessage(response.data.message); // Display success message
    } catch (error) {
      console.error(error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={registerUser}>Register</button>
      <p>{message}</p>
    </div>
  );
}

export default Register;
