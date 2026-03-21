import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
  });
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res?.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-3">
      <div className="w-full max-w-md p-8 bg-[#111111] border border-[#222222] rounded-xl">

        {/* Header */}
        <h1 className="text-white text-2xl font-semibold mb-1">Create account</h1>
        <p className="text-[#666] text-sm mb-8">Register as a teacher</p>

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
              placeholder="Enter username without spaces (John_Doe)"
              className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#555] transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#888] text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#555] transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#888] text-sm">Position</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter position"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        {/* Login Link */}
        <p className="text-[#666] text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;