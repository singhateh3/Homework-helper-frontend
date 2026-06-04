import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import CreateQuestion from "../pages/CreateQuestion.jsx";
import AllQuestions from "../pages/AllQuestions.jsx";
import QuestionDetails from "../pages/QuestionDetails.jsx";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // Protect the home page
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ask-question",
    element: (
      <ProtectedRoute>
        <CreateQuestion />
      </ProtectedRoute>
    ),
  },
  {
    path: "/all-questions",
    element: (
      <ProtectedRoute>
        <AllQuestions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions/:id",
    element: (
      <ProtectedRoute>
        <QuestionDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
