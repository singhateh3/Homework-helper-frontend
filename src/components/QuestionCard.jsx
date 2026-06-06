import { Link } from "react-router-dom";
import VoteButton from "./VoteButton";
import { useAuth } from "../context/AuthContext";

const QuestionCard = ({ question, onVoteChange }) => {
  const { isAuthenticated } = useAuth();

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Format date relative (e.g., "2 days ago")
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

  return (
    <div className="group bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
      <Link to={`/questions/${question.id}`}>
        {/* Mobile Layout (simplified) */}
        <div className="sm:hidden">
          <h2 className="text-base font-semibold text-gray-800 mb-2 hover:text-blue-600 line-clamp-2">
            {question.title}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {truncateText(question.body, 100)}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                👤 {question.user?.name?.split(" ")[0] || "User"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                💬 {question.answers_count || 0}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {getRelativeDate(question.created_at)}
            </span>
          </div>
        </div>

        {/* Desktop Layout (detailed) */}
        <div className="hidden sm:block">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {question.title}
          </h2>

          <p className="text-gray-600 text-base mb-4 line-clamp-3">
            {truncateText(question.body)}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-semibold">
                    {question.user?.name?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <span className="font-medium text-gray-700">
                  {question.user?.name || "Anonymous"}
                </span>
              </div>

              <span className="text-gray-300">•</span>

              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>
                  {new Date(question.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <span className="text-gray-300">•</span>

              <div className="flex items-center gap-1">
                <span>💬</span>
                <span>
                  {question.answers_count || question.answers?.length || 0}{" "}
                  answers
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {question.is_answered && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  ✓ Answered
                </span>
              )}
              <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Read more →
              </span>
            </div>
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {question.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs rounded-full hover:bg-blue-100 transition"
                >
                  #{tag}
                </span>
              ))}
              {question.tags.length > 4 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                  +{question.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Vote Section - Outside Link to prevent voting when clicking the card */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <VoteButton
          itemId={question.id}
          itemType="question"
          initialVotes={question.votes_count || question.votes || 0}
          initialUserVote={question.user_vote}
          onVoteChange={onVoteChange}
        />
        {!isAuthenticated && (
          <p className="text-xs text-gray-400 mt-2">
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>{" "}
            to vote
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
