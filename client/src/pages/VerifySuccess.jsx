import { useNavigate } from "react-router-dom";

const VerifySuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#111] border border-[#1a1a1a] rounded-xl flex flex-col items-center gap-6 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-xl font-semibold">Email Verified</h1>
          <p className="text-[#555] text-sm">
            Your account has been verified successfully. You can now login.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-[#e0e0e0] transition"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
};

export default VerifySuccess;