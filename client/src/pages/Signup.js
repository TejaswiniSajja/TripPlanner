import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as registerApi } from "../services/api";
import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      const { data } = await registerApi(form);
      loginUser(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", type: "text", icon: FiUser, placeholder: "John Doe" },
    { label: "Email", name: "email", type: "email", icon: FiMail, placeholder: "you@example.com" },
    { label: "Password", name: "password", type: "password", icon: FiLock, placeholder: "Min. 6 characters" },
  ];

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 gradient-border">
          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-dark-400 text-sm mb-8">
            Start planning your dream trips with AI
          </p>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 text-sm rounded-lg p-3 mb-6">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm text-dark-300 mb-1.5">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    type={f.type}
                    required
                    value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full bg-dark-950 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition"
                    placeholder={f.placeholder}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent-600 to-glow-purple text-white font-medium py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-dark-400 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
