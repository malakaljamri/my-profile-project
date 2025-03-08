import { useState } from "react";

const API_URL = "https://learn.reboot01.com/api/auth/signin";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Encode credentials in Base64
    const encoded = btoa(`${username}:${password}`);
    console.log("Encoded credentials:", encoded);  // Check the Base64 encoding

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      console.log("API response:", data);  // Check the API response ///////////
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      if (data) {
        localStorage.setItem("token", data); // Save the token to localStorage
        alert("Login successful!");
        window.location.href = "/dashboard"; // Redirect to dashboard
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <article>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
        </form>
      </article>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "10px",
    textAlign: "center",
  },
  error: {
    color: "red",
  },
};

export default Login;