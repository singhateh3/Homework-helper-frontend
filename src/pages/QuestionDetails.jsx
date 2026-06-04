import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const QuestionDetails = () => {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch question
  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/questions/${id}`);
      console.log(response.data);
      setQuestion(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch question details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

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

      // Refresh both question and answers
      await fetchQuestion();
      await getAnswers();
    } catch (error) {
      console.error(error);
      alert("Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  // GET ANSWERS with user information
  const getAnswers = async () => {
    try {
      const response = await api.get(`/questions/${id}/answers`);
      console.log("Fetched answers:", response.data);

      if (response.data.data) {
        setAnswers(response.data.data);
      } else if (response.data.answers) {
        setAnswers(response.data.answers);
      } else if (Array.isArray(response.data)) {
        setAnswers(response.data);
      } else {
        setAnswers([]);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);

      if (error.response?.status === 404) {
        setAnswers([]);
        return;
      }

      if (error.response?.status === 500) {
        console.warn(
          "Server error - answers endpoint might not be implemented",
        );
        setAnswers([]);
      } else {
        setError("Failed to fetch answers");
      }
    }
  };

  useEffect(() => {
    getAnswers();
  }, [id]);

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

  // Loading UI
  if (loading && !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
        <p className="text-sm sm:text-base text-gray-500">
          Loading question...
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
            onClick={fetchQuestion}
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
        {/* Back Button - Mobile Friendly */}
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
              <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  📅 {formatDate(question.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  💬 {answers.length} answers
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

          {/* Actions */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 text-sm sm:text-base"
            >
              ✏️ {showReplyForm ? "Cancel Reply" : "Write an Answer"}
            </button>
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

        {/* Answers Section */}
        <div className="mt-6 sm:mt-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Answers ({answers.length})
            </h2>
            {answers.length > 0 && (
              <span className="text-xs sm:text-sm text-gray-500">
                {answers.length}{" "}
                {answers.length === 1 ? "response" : "responses"}
              </span>
            )}
          </div>

          {answers.length === 0 ? (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="text-5xl sm:text-6xl mb-4">💭</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No answers yet
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                Be the first to help!
              </p>
              <button
                onClick={() => setShowReplyForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
              >
                ✏️ Write an Answer
              </button>
            </div>
          ) : (
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
                            {answer.user?.name?.charAt(0).toUpperCase() || "?"}
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
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <span>👍 {answer.votes || 0} votes</span>
                        <span>•</span>
                        <span>📅 {formatDate(answer.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Answer Body */}
                  <div className="p-4 sm:p-6">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {answer.body}
                    </p>
                  </div>

                  {/* Answer Actions (Optional) */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <button className="text-gray-400 hover:text-blue-600 text-xs sm:text-sm transition flex items-center gap-1">
                      👍 Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add animation styles */}
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
