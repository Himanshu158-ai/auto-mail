import { useState, useEffect } from "react";
import axios from "axios";
import useVoice from "../hooks/useVoice";
import useMail from "../hooks/useMail";

const AdminDashboard = () => {
  const { transcript, listening, startListening, resetTranscript } = useVoice();
  const { send, loading, error, result } = useMail();
  const [sent, setSent] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/api/auth/teachers", {
      withCredentials: true,
    })
      .then((res) => setTeachers(res.data.teachers))
      .catch(() => setTeachers([]));
  }, []);

  const handleSend = async () => {
    if (!transcript) return;
    const res = await send(transcript);
    if (res?.success) {
      setSent(true);
      resetTranscript();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-semibold text-lg tracking-tight">VoiceMail AI</h1>
        <div className="flex items-center gap-3">
          {/* Teachers Toggle Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-xs text-[#444] border border-[#222] px-3 py-1.5 rounded-lg hover:text-white hover:border-[#444] transition flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Users
          </button>
          <span className="text-xs text-[#444] border border-[#222] px-3 py-1 rounded-full">
            Admin
          </span>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-[#111] border-l border-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <p className="text-[#444] text-xs uppercase tracking-wider">
            Users · {teachers.length}
          </p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#444] hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Teachers List */}
        <div className="flex flex-col overflow-y-auto h-[calc(100%-57px)]">
          {teachers.length === 0 ? (
            <p className="text-[#333] text-xs px-5 py-5">No teachers found</p>
          ) : (
            teachers.map((teacher, index) => (
              <div
                key={teacher._id}
                className={`px-5 py-4 flex flex-col gap-0.5 hover:bg-[#1a1a1a] transition
                  ${index !== teachers.length - 1 ? "border-b border-[#1a1a1a]" : ""}`}
              >
                <p className="text-white text-sm">{teacher.username}</p>
                <p className="text-[#444] text-xs">{teacher.department || "—"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-6">

        {/* Left - Mic Section */}
        <div className="flex-1 bg-[#111] border border-[#1a1a1a] rounded-xl p-6 md:p-8 flex flex-col items-center gap-6">

          <div className="flex flex-col items-center gap-3 py-4">
            <button
              onClick={startListening}
              disabled={listening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
                ${listening
                  ? "bg-red-500 animate-pulse scale-110"
                  : "bg-white hover:bg-[#e0e0e0] hover:scale-105"
                }`}
            >
              <svg
                className={`w-8 h-8 ${listening ? "text-white" : "text-black"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-1 14.93V20H9v2h6v-2h-2v-2.07A7 7 0 0 0 19 11h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93z" />
              </svg>
            </button>
            <p className="text-[#555] text-xs tracking-widest uppercase">
              {listening ? "Listening..." : "Tap to speak"}
            </p>
          </div>

          <div className="w-full bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-4 min-h-[120px]">
            <p className="text-[#444] text-xs uppercase tracking-wider mb-3">
              Live Transcript
            </p>
            <p className={`text-sm leading-relaxed ${transcript ? "text-white" : "text-[#333]"}`}>
              {transcript || "Your voice will appear here..."}
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-xs w-full">{error}</p>
          )}

          <button
            onClick={handleSend}
            disabled={!transcript || loading}
            className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-[#e0e0e0] transition disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>

        </div>

        {/* Right - Info Section */}
        <div className="w-full md:w-64 flex flex-col gap-4">

          {sent && result && (
            <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <p className="text-green-400 text-xs uppercase tracking-wider">Email Sent</p>
              </div>
              {[
                { label: "To", value: result.data?.recipient },
                { label: "Subject", value: result.data?.subject },
              ].map((item, index, arr) => (
                <div
                  key={item.label}
                  className={`px-5 py-4 flex flex-col gap-1 ${index !== arr.length - 1 ? "border-b border-[#1a1a1a]" : ""
                    }`}
                >
                  <p className="text-[#444] text-xs uppercase tracking-wider">{item.label}</p>
                  <p className="text-white text-sm">{item.value || "—"}</p>
                </div>
              ))}
            </div>
          )}

          {/* Keyboard Shortcut Info */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-5 flex flex-col gap-3">
            <p className="text-[#444] text-xs uppercase tracking-wider">Commands</p>
            {[
              { cmd: "Send notice to anas", desc: "Meeting notice" },
              { cmd: "Send tips to rahul", desc: "Interview tips" },
              { cmd: "Send joke to priya", desc: "Funny email" },
            ].map((item) => (
              <div key={item.cmd} className="flex flex-col gap-0.5">
                <p className="text-white text-xs font-mono">"{item.cmd}"</p>
                <p className="text-[#444] text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          {sent && (
            <button
              onClick={() => setSent(false)}
              className="w-full border border-[#1a1a1a] text-[#555] text-sm py-3 rounded-lg hover:text-white hover:border-[#333] transition"
            >
              Send Another
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;