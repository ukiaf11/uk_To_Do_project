import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login/", form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      // Redirect to Dashboard page after successful login
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login to TaskFlow</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={styles.input}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
          autoComplete="current-password"
        />
        <button type="submit" style={styles.btn}>
          Login
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: "50px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 10, fontSize: 16 },
  btn: {
    padding: 12,
    background: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
