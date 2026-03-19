import { useState } from "react";
import { sendMail } from "../services/api.service";

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
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error, result };
};

export default useMail;