import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children, allowedRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/auth/me", {
      withCredentials: true,
    })
    .then((res) => {
      setUser(res.data.user);
      setLoading(false);
    })
    .catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader/>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;