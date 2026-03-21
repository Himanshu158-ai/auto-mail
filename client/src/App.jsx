import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard"; 
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./utils/ProtectedRoutes";
import VerifySuccess from "./pages/VerifySuccess";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/verify/:token" element={<VerifySuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;