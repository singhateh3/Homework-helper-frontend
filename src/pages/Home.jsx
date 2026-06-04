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
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Homework Helper
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Ask questions, get answers, and learn together with students
            worldwide
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">❓</div>
              <div className="text-2xl font-bold">
                {stats.totalQuestions || 0}
              </div>
              <div className="text-sm opacity-75">Questions Asked</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-2xl font-bold">
                {stats.totalAnswers || 0}
              </div>
              <div className="text-sm opacity-75">Answers Given</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
              <div className="text-sm opacity-75">Community Members</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/ask-question"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              ✏️ Ask a Question
            </Link>
            <Link
              to="/all-questions"
              className="inline-flex items-center justify-center gap-2 border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
            >
              🔍 Browse Questions
            </Link>
          </div>
        </div>
      </section>

      {/* TRENDING TOPICS */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-lg">📈</span>
          <span className="text-sm font-medium">Trending Topics</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            "Mathematics",
            "Physics",
            "Programming",
            "Chemistry",
            "Biology",
            "History",
          ].map((topic) => (
            <Link
              key={topic}
              to={`/questions?topic=${topic.toLowerCase()}`}
              className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border border-gray-200"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* QUESTIONS SECTION */}
      <section className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Recent Questions
            </h2>
            <p className="text-gray-500 mt-1">
              Latest discussions from the community
            </p>
          </div>
          <Link
            to="/all-questions"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all
            <span>→</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
            <p className="text-gray-500">Loading questions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-500 mb-2 text-5xl">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchQuestions}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Questions Display */}
        {!loading && !error && (
          <>
            {questions.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <div className="text-6xl mb-4">📚</div>
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
                  ✏️ Ask Your First Question
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to help others?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join our community of learners and start sharing your knowledge
            today
          </p>
          <Link
            to="/all-questions"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            Explore Questions
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
