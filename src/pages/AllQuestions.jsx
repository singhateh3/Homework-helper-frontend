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
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const fetchQuestions = async (page = 1, isPageChange = false) => {
    if (isPageChange) {
      setPaginationLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await api.get(`/questions?page=${page}`);
      console.log("Questions response:", response.data);

      // Match your backend response structure
      setQuestions(response.data.data || []);
      setCurrentPage(response.data.current_page || 1);
      setLastPage(response.data.last_page || 1);
      setPerPage(response.data.per_page || 15);
      setTotalQuestions(response.data.total || 0);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.response?.data?.message || "Failed to fetch questions");
    } finally {
      if (isPageChange) {
        setPaginationLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(lastPage, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Calculate showing range
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalQuestions);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
        <p className="text-sm sm:text-base text-gray-500">
          Loading questions...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center max-w-md">
          <div className="text-red-500 mb-2 text-4xl sm:text-5xl">⚠️</div>
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => fetchQuestions(currentPage)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No Questions State
  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">All Questions</h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ← Back to Home
            </Link>
          </div>
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500 mb-4">
              Be the first to ask a question!
            </p>
            <Link
              to="/ask-question"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              ✏️ Ask a Question
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Questions</h1>
            <p className="text-gray-500 mt-1">
              Showing {startItem} - {endItem} of {totalQuestions} questions
            </p>
          </div>
          <Link
            to="/ask-question"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Ask Question
          </Link>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>

        {/* Pagination Loading Overlay */}
        {paginationLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-3 border-blue-200 border-t-blue-600 animate-spin"></div>
              <span className="text-gray-700">Loading page...</span>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {lastPage > 1 && (
          <div className="mt-8">
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {/* First Page Button */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ⟪ First
              </button>

              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg transition ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition min-w-[40px] ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className={`px-3 py-2 rounded-lg transition ${
                  currentPage === lastPage
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next →
              </button>

              {/* Last Page Button */}
              <button
                onClick={() => handlePageChange(lastPage)}
                disabled={currentPage === lastPage}
                className={`px-3 py-2 rounded-lg transition ${
                  currentPage === lastPage
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Last ⟫
              </button>
            </div>

            {/* Page Info */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Page {currentPage} of {lastPage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllQuestions;
