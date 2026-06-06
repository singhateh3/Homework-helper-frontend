import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

const Layout = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-blue-600">
                Homework Helper
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/all-questions"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    All Questions
                  </Link>
                  <Link
                    to="/ask-question"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Ask Question
                  </Link>
                  <div className="flex items-center space-x-3 ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm font-medium">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                    <LogoutButton variant="ghost" />
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => {
                  const mobileMenu = document.getElementById("mobile-menu");
                  mobileMenu.classList.toggle("hidden");
                }}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div id="mobile-menu" className="hidden md:hidden pb-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-blue-600 transition font-medium py-2"
                >
                  Home
                </Link>
                <Link
                  to="/all-questions"
                  className="block text-gray-700 hover:text-blue-600 transition font-medium py-2"
                >
                  All Questions
                </Link>
                <Link
                  to="/ask-question"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center"
                >
                  Ask Question
                </Link>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm font-medium">
                        {user?.name || "User"}
                      </span>
                    </div>
                  </div>
                  <LogoutButton className="w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 transition font-medium py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Homework Helper. All rights reserved.</p>
            <p className="mt-1">Helping students learn together</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
