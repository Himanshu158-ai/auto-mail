import { useState } from "react";
import { loginUser, registerUser } from "../services/api.service";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};

export default useAuth;