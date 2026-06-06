import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutButton = ({ className = "", variant = "default" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-red-600 text-red-600 hover:bg-red-50",
    ghost: "text-gray-600 hover:text-red-600 hover:bg-gray-100",
  };

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 rounded-lg transition font-medium ${variants[variant]} ${className}`}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
