import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Homework Helper
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/ask-question"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Ask Question
                </Link>
                <Link
                  to="/all-questions"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Questions
                </Link>
                <span className="text-gray-600">
                  Welcome, {user?.name || "User"}
                </span>
                <LogoutButton variant="ghost" />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
