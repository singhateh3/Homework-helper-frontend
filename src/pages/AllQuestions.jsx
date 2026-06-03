import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchQuestions = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/questions?page=${page}`);
      console.log(response.data);

      setQuestions(response.data.data || []);
      setCurrentPage(response.data.data.current_page || 1);
      setLastPage(response.data?.data?.last_page || 1);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.response?.data?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-9 h-9 rounded-full border-2 border-stone-200 border-t-stone-500 animate-spin" />
      </div>
    );
  if (error)
    return <p className="text-center p-6 text-red-500">Error: {error}</p>;
  if (questions.length === 0)
    return <p className="text-center p-6">No questions found.</p>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Questions</h1>

        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Home
        </Link>
      </div>
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      {/* Simple pagination controls */}
      {lastPage > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {lastPage}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllQuestions;
