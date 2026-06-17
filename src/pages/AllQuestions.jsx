import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { AllQuestionsSkeleton } from "../components/Skeletons";

const AllQuestions = () => {
  // State
  const [state, setState] = useState({
    questions: [],
    loading: false,
    error: null,
    currentPage: 1,
    lastPage: 1,
    totalQuestions: 0,
    perPage: 15,
    paginationLoading: false,
  });

  const {
    questions,
    loading,
    error,
    currentPage,
    lastPage,
    totalQuestions,
    perPage,
    paginationLoading,
  } = state;

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fetch questions
  const fetchQuestions = useCallback(
    async (page = 1, isPageChange = false) => {
      updateState({
        loading: !isPageChange,
        paginationLoading: isPageChange,
        error: null,
      });

      try {
        const response = await api.get(`/questions`, {
          params: { page, per_page: 15 },
        });

        const { data, current_page, last_page, per_page, total } =
          response.data;

        updateState({
          questions: data || [],
          currentPage: current_page || 1,
          lastPage: last_page || 1,
          perPage: per_page || 15,
          totalQuestions: total || 0,
        });
      } catch (error) {
        console.error("Error fetching questions:", error);
        updateState({
          error: error.response?.data?.message || "Failed to fetch questions",
        });
      } finally {
        updateState({
          loading: false,
          paginationLoading: false,
        });
      }
    },
    [updateState],
  );

  // Initial fetch
  useEffect(() => {
    fetchQuestions(1);
  }, [fetchQuestions]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage && newPage !== currentPage) {
      fetchQuestions(newPage, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers
  const getPageNumbers = useCallback(() => {
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
  }, [currentPage, lastPage]);

  // Calculate showing range
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalQuestions);

  // Loading State with Skeleton
  if (loading) {
    return <AllQuestionsSkeleton />;
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
  if (questions.length === 0) {
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

  // Pagination Button Component
  const PaginationButton = ({
    onClick,
    disabled,
    children,
    className = "",
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg transition text-sm ${
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );

  // Page Number Button
  const PageButton = ({ page, isActive }) => (
    <button
      onClick={() => handlePageChange(page)}
      className={`px-3 py-2 rounded-lg transition min-w-[40px] text-sm ${
        isActive
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {page}
    </button>
  );

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
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
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
              <PaginationButton
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                ⟪ First
              </PaginationButton>

              <PaginationButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </PaginationButton>

              <div className="flex gap-1">
                {getPageNumbers().map((page) => (
                  <PageButton
                    key={page}
                    page={page}
                    isActive={currentPage === page}
                  />
                ))}
              </div>

              <PaginationButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                Next →
              </PaginationButton>

              <PaginationButton
                onClick={() => handlePageChange(lastPage)}
                disabled={currentPage === lastPage}
              >
                Last ⟫
              </PaginationButton>
            </div>

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
