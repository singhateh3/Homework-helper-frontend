// src/pages/Home.jsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import QuestionCard from "../components/QuestionCard";
import {
  StatsSkeleton,
  QuestionCardSkeletonList,
} from "../components/Skeletons";

// Constants
const TOPICS = [
  "Mathematics",
  "Physics",
  "Programming",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
  "Economics",
];

const INITIAL_STATS = {
  total_questions: 0,
  total_answers: 0,
  total_users: 0,
  today_questions: 0,
  today_answers: 0,
  most_active_user: null,
};

function Home() {
  // State
  const [state, setState] = useState({
    questions: [],
    loading: false,
    error: null,
    stats: INITIAL_STATS,
  });

  const { questions, loading, error, stats } = state;

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    updateState({ loading: true, error: null });

    try {
      const response = await api.get("/top-questions");
      updateState({ questions: response.data.data || [] });
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      updateState({ error: "Failed to fetch questions" });
    } finally {
      updateState({ loading: false });
    }
  }, [updateState]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/stats");
      if (response.data.success && response.data.data) {
        updateState({ stats: response.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [updateState]);

  // Update question vote
  const updateQuestionVote = useCallback(
    (questionId, newVotesCount, newUserVote) => {
      setState((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, votes_count: newVotesCount, user_vote: newUserVote }
            : q,
        ),
      }));
    },
    [],
  );

  // Initial fetch
  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [fetchQuestions, fetchStats]);

  // Stats Card Component
  const StatsCard = ({ icon, value, label, todayValue }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform hover:scale-105 transition">
      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{icon}</div>
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
      <div className="text-xs sm:text-sm opacity-75">{label}</div>
      {todayValue > 0 && (
        <div className="text-xs opacity-75 mt-1">+{todayValue} today</div>
      )}
    </div>
  );

  // Topic Button Component
  const TopicButton = ({ topic }) => (
    <Link
      to={`/search?category=${topic.toLowerCase()}`}
      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full text-xs sm:text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border border-gray-200 whitespace-nowrap"
    >
      {topic}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HERO SECTION */}
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

          {/* Stats Bar with Skeleton */}
          {loading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
              <StatsCard
                icon="❓"
                value={stats.total_questions}
                label="Questions Asked"
                todayValue={stats.today_questions}
              />
              <StatsCard
                icon="💬"
                value={stats.total_answers}
                label="Answers Given"
                todayValue={stats.today_answers}
              />
              <StatsCard
                icon="👥"
                value={stats.total_users}
                label="Community Members"
                todayValue={0}
              />
            </div>
          )}

          {/* Most Active User */}
          {!loading && stats.most_active_user && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 max-w-sm mx-auto mb-8">
              <div className="text-xs opacity-75 mb-1">
                🏆 Most Active Member
              </div>
              <div className="font-semibold">{stats.most_active_user.name}</div>
              <div className="text-xs opacity-75">
                {stats.most_active_user.total_contributions} contributions
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link
              to="/ask-question"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              ✏️ Ask a Question
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center justify-center gap-2 border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105 text-sm sm:text-base"
            >
              🔍 Browse Questions
            </Link>
          </div>
        </div>
      </section>

      {/* TRENDING TOPICS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <span className="text-base sm:text-lg">📈</span>
          <span className="text-xs sm:text-sm font-medium">
            Trending Topics
          </span>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {TOPICS.map((topic) => (
            <TopicButton key={topic} topic={topic} />
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
            View all <span>→</span>
          </Link>
        </div>

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

        {/* Questions Display with Skeleton */}
        {!error && (
          <>
            {loading ? (
              <QuestionCardSkeletonList count={3} />
            ) : questions.length === 0 ? (
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
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onVoteChange={updateQuestionVote}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA SECTION */}
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
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;
