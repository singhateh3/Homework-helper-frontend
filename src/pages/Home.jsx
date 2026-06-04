import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import QuestionCard from "../components/QuestionCard";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalAnswers: 0,
    totalUsers: 0,
  });

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/top-questions");
      setQuestions(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats");
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HERO SECTION - Fully Responsive */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in">
            Homework Helper
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Ask questions, get answers, and learn together with students
            worldwide
          </p>

          {/* Stats Bar - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">❓</div>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.totalQuestions || 0}
              </div>
              <div className="text-xs sm:text-sm opacity-75">
                Questions Asked
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💬</div>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.totalAnswers || 0}
              </div>
              <div className="text-xs sm:text-sm opacity-75">Answers Given</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">👥</div>
              <div className="text-xl sm:text-2xl font-bold">
                {stats.totalUsers || 0}
              </div>
              <div className="text-xs sm:text-sm opacity-75">
                Community Members
              </div>
            </div>
          </div>

          {/* Buttons - Responsive Stack */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link
              to="/ask-question"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              ✏️ Ask a Question
            </Link>
            <Link
              to="/all-questions"
              className="inline-flex items-center justify-center gap-2 border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105 text-sm sm:text-base"
            >
              🔍 Browse Questions
            </Link>
          </div>
        </div>
      </section>

      {/* TRENDING TOPICS - Horizontal Scroll on Mobile */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <span className="text-base sm:text-lg">📈</span>
          <span className="text-xs sm:text-sm font-medium">
            Trending Topics
          </span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {[
            "Mathematics",
            "Physics",
            "Programming",
            "Chemistry",
            "Biology",
            "History",
            "Literature",
            "Economics",
          ].map((topic) => (
            <Link
              key={topic}
              to={`/questions?topic=${topic.toLowerCase()}`}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full text-xs sm:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border border-gray-200 whitespace-nowrap"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* QUESTIONS SECTION */}
      <section className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Recent Questions
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Latest discussions from the community
            </p>
          </div>
          <Link
            to="/all-questions"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 text-sm sm:text-base"
          >
            View all
            <span>→</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
            <p className="text-sm sm:text-base text-gray-500">
              Loading questions...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center">
            <div className="text-red-500 mb-2 text-4xl sm:text-5xl">⚠️</div>
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchQuestions}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Questions Display */}
        {!loading && !error && (
          <>
            {questions.length === 0 ? (
              <div className="bg-white rounded-lg p-8 sm:p-12 text-center border border-gray-200">
                <div className="text-5xl sm:text-6xl mb-4">📚</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  No questions yet
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  Be the first to ask a question!
                </p>
                <Link
                  to="/ask-question"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  ✏️ Ask Your First Question
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {questions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA SECTION - Responsive */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-8 sm:mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Ready to help others?
          </h2>
          <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Join our community of learners and start sharing your knowledge
            today
          </p>
          <Link
            to="/all-questions"
            className="inline-block bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 text-sm sm:text-base"
          >
            Explore Questions
          </Link>
        </div>
      </section>

      {/* Add responsive CSS animations */}
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
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        /* Responsive font adjustments */
        @media (max-width: 640px) {
          .animate-fade-in {
            animation: fade-in-up 0.5s ease-out;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
