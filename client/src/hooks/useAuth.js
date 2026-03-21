import { useState } from "react";
import { loginUser, registerUser } from "../services/api.service";
import toast from "react-hot-toast";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(data);
      toast.success("Logged in successfully");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(data);
      toast.success("Registered successfully! Please verify your email.");
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};

export default useAuth;