import { useState, useEffect } from "react";
import axios from "axios";
import useVoice from "../hooks/useVoice";
import useMail from "../hooks/useMail";
import toast from "react-hot-toast";

const HISTORY_KEY = "voicemail_history";

const AdminDashboard = () => {
  const { transcript, listening, startListening, resetTranscript } = useVoice();
  const { send, loading, error, result } = useMail();
  const [sent, setSent] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sentHistory, setSentHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Toast-style sent notification state
  const [sentToast, setSentToast] = useState(null); // { recipient, subject }

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/teachers", { withCredentials: true })
      .then((res) => setTeachers(res.data.teachers))
      .catch(() => setTeachers([]));
  }, []);

  const handleSend = async () => {
    if (!transcript) return;
    const res = await send(transcript);
    if (res?.success) {
      setSent(true);

      const newEntry = {
        recipient: res.data?.recipient,
        subject: res.data?.subject,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      // Update history + persist to localStorage
      setSentHistory((prev) => {
        const updated = [newEntry, ...prev].slice(0, 5);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });

      // Show toast-style notification
      setSentToast(newEntry);
      setTimeout(() => setSentToast(null), 4000);

      toast.success("Email sent successfully!");
      resetTranscript();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Toast-style sent notification */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out
          ${sentToast ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl min-w-[280px] max-w-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <p className="text-green-400 text-xs font-medium">Email Sent</p>
            <p className="text-white text-xs truncate">{sentToast?.recipient}</p>
            <p className="text-[#444] text-xs truncate">{sentToast?.subject}</p>
          </div>
          <button
            onClick={() => setSentToast(null)}
            className="ml-auto text-[#444] hover:text-white transition shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navbar */}
      <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-semibold text-lg tracking-tight">VoiceMail AI</h1>
        <div className="flex items-center gap-3">
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
        <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#111] border-l border-[#1a1a1a] z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <p className="text-[#444] text-xs uppercase tracking-wider">Users · {teachers.length}</p>
          <button onClick={() => setSidebarOpen(false)} className="text-[#444] hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col overflow-y-auto h-[calc(100%-57px)]">
          {teachers.length === 0 ? (
            <p className="text-[#333] text-xs px-5 py-5">No users found</p>
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
                ${listening ? "bg-red-500 animate-pulse scale-110" : "bg-white hover:bg-[#e0e0e0] hover:scale-105"}`}
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
            <p className="text-[#444] text-xs uppercase tracking-wider mb-3">Live Transcript</p>
            <p className={`text-sm leading-relaxed ${transcript ? "text-white" : "text-[#333]"}`}>
              {transcript || "Your voice will appear here..."}
            </p>
          </div>

          {error && <p className="text-red-500 text-xs w-full text-center">{error}</p>}

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

          {/* Recent History */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
              <p className="text-[#444] text-xs uppercase tracking-wider">Recent</p>
              {sentHistory.length > 0 && (
                <button
                  onClick={() => {
                    setSentHistory([]);
                    localStorage.removeItem(HISTORY_KEY);
                  }}
                  className="text-[#333] hover:text-red-400 text-xs transition"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col">
              {sentHistory.length === 0 ? (
                <p className="text-[#333] text-xs px-5 py-4">No emails sent yet</p>
              ) : (
                sentHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`px-5 py-3 flex flex-col gap-0.5 ${
                      index !== sentHistory.length - 1 ? "border-b border-[#1a1a1a]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-xs truncate">{item.recipient}</p>
                      {item.time && <p className="text-[#333] text-[10px] shrink-0">{item.time}</p>}
                    </div>
                    <p className="text-[#444] text-xs truncate">{item.subject}</p>
                  </div>
                ))
              )}
            </div>
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