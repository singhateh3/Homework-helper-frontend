import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import CreateQuestion from "../pages/CreateQuestion.jsx";
import AllQuestions from "../pages/AllQuestions.jsx";
import QuestionDetails from "../pages/QuestionDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/ask-question",
    element: <CreateQuestion />,
  },
  {
    path: "/all-questions",
    element: <AllQuestions />,
  },
  {
    path: "/questions/:id",
    element: <QuestionDetails />,
  },
]);
export default router;
