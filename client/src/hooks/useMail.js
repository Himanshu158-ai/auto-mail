import { useState } from "react";
import { sendMail } from "../services/api.service";
import toast from "react-hot-toast";

const useMail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const send = async (transcript) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendMail(transcript);
      setResult(res.data);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error, result };
};

export default useMail;