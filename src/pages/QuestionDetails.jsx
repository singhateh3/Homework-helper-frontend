import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import VoteButton from "../components/VoteButton";
import { useAuth } from "../context/AuthContext";

const QuestionDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  // Pagination state for answers
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [paginationLoading, setPaginationLoading] = useState(false);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch both question and answers simultaneously
  const fetchData = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch question and answers in parallel
      const [questionResponse, answersResponse] = await Promise.all([
        api.get(`/questions/${id}`),
        api.get(`/questions/${id}/answers?page=${page}&per_page=${perPage}`),
      ]);

      console.log("===== QUESTION DATA =====");
      console.log("Question details:", questionResponse.data.data);
      console.log("Question user_vote:", questionResponse.data.data.user_vote);
      console.log(
        "Question votes_count:",
        questionResponse.data.data.votes_count,
      );
      setQuestion(questionResponse.data.data);

      setDebugInfo((prev) => ({
        ...prev,
        question: {
          user_vote: questionResponse.data.data.user_vote,
          votes_count: questionResponse.data.data.votes_count,
        },
      }));

      // Process answers with pagination data
      console.log("===== ANSWERS API RESPONSE =====");
      console.log("Full response:", answersResponse.data);

      let answersData = [];
      let paginationData = {};

      if (answersResponse.data.data) {
        answersData = answersResponse.data.data;
        paginationData = answersResponse.data;
        console.log("Using response.data.data");
      } else if (answersResponse.data.answers) {
        answersData = answersResponse.data.answers;
        paginationData = answersResponse.data;
        console.log("Using response.data.answers");
      } else if (Array.isArray(answersResponse.data)) {
        answersData = answersResponse.data;
        console.log("Using response.data as array");
        // If no pagination data, set defaults
        paginationData = {
          current_page: 1,
          last_page: 1,
          total: answersData.length,
          per_page: answersData.length,
        };
      }

      // Set pagination metadata
      setCurrentPage(paginationData.current_page || 1);
      setLastPage(paginationData.last_page || 1);
      setTotalAnswers(paginationData.total || answersData.length);
      setPerPage(paginationData.per_page || 10);

      // Debug each answer's vote data
      console.log("===== ANSWER VOTE DATA DEBUG =====");
      console.log(
        `Showing ${answersData.length} of ${paginationData.total} answers`,
      );
      console.log(
        `Page ${paginationData.current_page} of ${paginationData.last_page}`,
      );

      answersData.forEach((answer, idx) => {
        console.log(`\n--- Answer ${idx + 1} (ID: ${answer.id}) ---`);
        console.log("votes_count property:", answer.votes_count);
        console.log("user_vote property:", answer.user_vote);
        if (answer.user) {
          console.log("User name:", answer.user.name);
        }
      });

      setDebugInfo((prev) => ({
        ...prev,
        answers: answersData.map((a) => ({
          id: a.id,
          user_vote: a.user_vote,
          votes_count: a.votes_count,
        })),
      }));

      setAnswers(answersData);
    } catch (error) {
      console.error("Error fetching data:", error);

      if (error.response?.status === 404) {
        setError("Question not found");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to load question details");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch answers only (for pagination)
  const fetchAnswers = async (page) => {
    setPaginationLoading(true);
    try {
      const response = await api.get(
        `/questions/${id}/answers?page=${page}&per_page=${perPage}`,
      );

      let answersData = [];
      let paginationData = {};

      if (response.data.data) {
        answersData = response.data.data;
        paginationData = response.data;
      } else if (response.data.answers) {
        answersData = response.data.answers;
        paginationData = response.data;
      } else if (Array.isArray(response.data)) {
        answersData = response.data;
        paginationData = {
          current_page: page,
          last_page: Math.ceil(totalAnswers / perPage),
          total: totalAnswers,
          per_page: perPage,
        };
      }

      setAnswers(answersData);
      setCurrentPage(paginationData.current_page || page);
      setLastPage(paginationData.last_page || 1);
      setTotalAnswers(paginationData.total || totalAnswers);

      // Scroll to answers section smoothly
      document.getElementById("answers-section")?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error fetching answers:", error);
    } finally {
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      fetchAnswers(page);
    }
  };

  // Submit answer
  const submitAnswer = async (e) => {
    e.preventDefault();

    if (!answer.trim()) return;

    setSubmitting(true);

    try {
      await api.post("/answers", {
        question_id: id,
        body: answer.trim(),
      });

      setAnswer("");
      setShowReplyForm(false);

      // Refresh both question and answers, go to first page
      await fetchData(1);
    } catch (error) {
      console.error(error);
      alert("Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  // Refresh answers only (for vote changes)
  const refreshAnswers = async () => {
    try {
      const response = await api.get(
        `/questions/${id}/answers?page=${currentPage}&per_page=${perPage}`,
      );
      let answersData = [];
      if (response.data.data) {
        answersData = response.data.data;
      } else if (response.data.answers) {
        answersData = response.data.answers;
      } else if (Array.isArray(response.data)) {
        answersData = response.data;
      }
      setAnswers(answersData);
    } catch (error) {
      console.error("Error refreshing answers:", error);
    }
  };

  // Refresh question only (for vote changes)
  const refreshQuestion = async () => {
    try {
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data.data);
    } catch (error) {
      console.error("Error refreshing question:", error);
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRelativeDate = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Generate page numbers to display
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
  const endItem = Math.min(currentPage * perPage, totalAnswers);

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
        <p className="text-sm sm:text-base text-gray-500">
          Loading question and answers...
        </p>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center max-w-md">
          <div className="text-red-500 mb-2 text-4xl sm:text-5xl">⚠️</div>
          <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not found
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 sm:p-8 text-center max-w-md">
          <div className="text-yellow-500 mb-2 text-4xl sm:text-5xl">🔍</div>
          <p className="text-yellow-600 text-sm sm:text-base">
            Question not found.
          </p>
          <Link
            to="/all-questions"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Browse Questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/all-questions"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 text-sm sm:text-base group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Back to Questions
        </Link>

        {/* Question Card */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
          {/* Question Header */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
              {question.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm sm:text-base">
                    {question.user?.name?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">
                    {question.user?.name || "Anonymous User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Posted {getRelativeDate(question.created_at)}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  📅 {formatDate(question.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  💬 {totalAnswers} answers
                </span>
              </div>
            </div>
          </div>

          {/* Question Body */}
          <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {question.body}
            </p>
          </div>

          {/* Actions with Vote Button */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 text-sm sm:text-base"
              >
                ✏️ {showReplyForm ? "Cancel Reply" : "Write an Answer"}
              </button>

              <VoteButton
                itemId={question.id}
                itemType="question"
                initialVotes={question.votes_count || question.votes || 0}
                initialUserVote={question.user_vote}
                onVoteChange={refreshQuestion}
              />
            </div>
            {!isAuthenticated && (
              <p className="text-xs text-gray-400 mt-3">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>{" "}
                to vote
              </p>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Your Answer
            </h3>
            <form onSubmit={submitAnswer}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here... Be detailed and helpful!"
                className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                rows={6}
              />
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {submitting ? "Posting..." : "Post Answer"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="border border-gray-300 text-gray-700 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Answers Section with Pagination */}
        <div id="answers-section" className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Answers ({totalAnswers})
            </h2>
            {totalAnswers > 0 && (
              <div className="text-xs sm:text-sm text-gray-500">
                Showing {startItem} - {endItem} of {totalAnswers} answers
              </div>
            )}
          </div>

          {/* Pagination Loading State */}
          {paginationLoading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            </div>
          )}

          {!paginationLoading && answers.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">💭</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No answers yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                Be the first to help!
              </p>
            </div>
          ) : (
            !paginationLoading && (
              <>
                <div className="space-y-4 sm:space-y-6">
                  {answers.map((answer, index) => (
                    <div
                      key={answer.id}
                      className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Answer Header */}
                      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold text-sm sm:text-base">
                                {answer.user?.name?.charAt(0).toUpperCase() ||
                                  "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 text-sm sm:text-base">
                                {answer.user?.name || "Anonymous User"}
                              </p>
                              <p className="text-xs text-gray-400">
                                Answered {getRelativeDate(answer.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Answer Body */}
                      <div className="p-4 sm:p-6">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {answer.body}
                        </p>
                      </div>

                      {/* Answer Actions with Vote Button */}
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex items-center justify-between">
                        <VoteButton
                          itemId={answer.id}
                          itemType="answer"
                          initialVotes={answer.votes_count || answer.votes || 0}
                          initialUserVote={answer.user_vote}
                          onVoteChange={refreshAnswers}
                        />
                      </div>
                      {!isAuthenticated && (
                        <div className="px-4 sm:px-6 pb-4">
                          <p className="text-xs text-gray-400">
                            <Link
                              to="/login"
                              className="text-blue-600 hover:underline"
                            >
                              Sign in
                            </Link>{" "}
                            to vote
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

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
              </>
            )
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuestionDetails;
