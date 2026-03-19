import { useEffect, useState } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <div className="border-b border-[#1a1a1a] px-8 py-4 flex items-center justify-between">
        <h1 className="text-white font-semibold text-lg tracking-tight">VoiceMail AI</h1>
        <span className="text-xs text-[#444] border border-[#222] px-3 py-1 rounded-full">
          Teacher
        </span>
      </div>

      {/* Main */}
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-4">

        {/* Profile Header */}
        <div className="mb-4">
          <h2 className="text-white text-xl font-semibold">
            {user?.username || "—"}
          </h2>
          <p className="text-[#555] text-sm mt-1">{user?.email || "—"}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
          {[
            { label: "Username", value: user?.username },
            { label: "Email", value: user?.email },
            { label: "Department", value: user?.department },
            { label: "Role", value: user?.role },
          ].map((item, index, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between px-6 py-4 ${
                index !== arr.length - 1 ? "border-b border-[#1a1a1a]" : ""
              }`}
            >
              <span className="text-[#555] text-xs uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-white text-sm capitalize">
                {item.value || "—"}
              </span>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl px-6 py-5 flex gap-3 items-start">
          <span className="text-[#444] text-sm mt-0.5">ℹ</span>
          <p className="text-[#555] text-sm leading-relaxed">
            You will receive emails from admin directly in your inbox.
            No action required from your side.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;