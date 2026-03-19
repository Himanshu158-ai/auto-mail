import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res?.success) {
      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#111111] border border-[#222222] rounded-xl">
        
        {/* Header */}
        <h1 className="text-white text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-[#666] text-sm mb-8">Sign in to your account</p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[#888] text-sm">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#555] transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#888] text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#555] transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-[#e0e0e0] transition mt-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Register Link */}
        <p className="text-[#666] text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;