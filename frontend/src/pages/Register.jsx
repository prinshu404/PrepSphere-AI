import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Sparkles } from "lucide-react";
import { register } from "../services/authApi";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", college: "", branch: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await register(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || (err.request ? "Cannot reach the PrepSphere server. Start the backend on port 8000." : "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand"><Sparkles size={20} /> Prep<span>Sphere</span></div>
        <h1>Create account</h1>
        <p>Start your personalized interview journey.</p>
        {error && <div className="auth-error">{error}</div>}
        <label>Full Name<input required value={form.name} onChange={update("name")} /></label>
        <label>Email<input required type="email" value={form.email} onChange={update("email")} /></label>
        <div className="auth-row">
          <label>College<input value={form.college} onChange={update("college")} /></label>
          <label>Branch<input value={form.branch} onChange={update("branch")} /></label>
        </div>
        <label>Password<input required minLength={6} type="password" value={form.password} onChange={update("password")} /></label>
        <button disabled={loading}>{loading ? "Creating..." : <><UserPlus size={16} /> Create account</>}</button>
        <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
