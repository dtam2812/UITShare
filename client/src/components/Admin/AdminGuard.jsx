import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function AdminGuard({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Kiểm tra token hết hạn
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      return <Navigate to="/login" replace />;
    }

    // Kiểm tra role admin
    if (decoded.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("access_token");
    return <Navigate to="/login" replace />;
  }
}