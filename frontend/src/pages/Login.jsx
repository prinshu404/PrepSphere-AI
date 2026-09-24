import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import { login } from "../services/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || (err.request ? "Cannot reach the PrepSphere server. Start the backend on port 8000." : "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand"><Sparkles size={20} /> Prep<span>Sphere</span></div>
        <h1>Welcome back</h1>
        <p>Login to continue your preparation.</p>
        {error && <div className="auth-error">{error}</div>}
        <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button disabled={loading}>{loading ? "Signing in..." : <><LogIn size={16} /> Login</>}</button>
        <p className="auth-switch">New here? <Link to="/register">Create account</Link></p>
      </form>
    </div>
  );
}
