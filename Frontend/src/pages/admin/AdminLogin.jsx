import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setError("");
      const user = await login(email, password);

      if (user.role !== "admin") {
        setError("Access denied. Admins only.");
        return;
      }

      navigate("/admin");
    } catch (err) {
      setError(err || "Login failed");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}