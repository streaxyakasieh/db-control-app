import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage({ onClose }: any) {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const ok = await login(username, password);

    if (!ok) {
      setError("Неверный логин или пароль");
      return;
    }

    onClose();
  };

  return (
    <div className="login-modal">

      <div className="login-box">

        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        {error && <div style={{color:"red"}}>{error}</div>}

        <button onClick={onClose}>
          Cancel
        </button>

      </div>

    </div>
  );
}