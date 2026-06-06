import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const VoteButton = ({
  itemId,
  itemType,
  initialVotes,
  initialUserVote,
  onVoteChange,
}) => {
  const { isAuthenticated } = useAuth();
  const [votesCount, setVotesCount] = useState(initialVotes || 0);
  const [userVote, setUserVote] = useState(initialUserVote || null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync with props when they change
  useEffect(() => {
    setVotesCount(initialVotes || 0);
    setUserVote(initialUserVote || null);
  }, [initialVotes, initialUserVote, itemId, itemType]);

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      alert("Please login to vote");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const endpoint =
        itemType === "question"
          ? `/questions/${itemId}/vote`
          : `/answers/${itemId}/vote`;

      let voteType;

      if (userVote === type) {
        // Removing vote - send 'remove' action
        voteType = "remove";
      } else {
        // Adding or changing vote
        voteType = type === 1 ? "upvote" : "downvote";
      }

      const response = await api.post(endpoint, {
        type: voteType,
      });

      // Update local state based on server response
      if (response.data && response.data.votes_count !== undefined) {
        setVotesCount(response.data.votes_count);
        setUserVote(response.data.user_vote);

        // Call parent to update specific item (if callback provided)
        if (onVoteChange && itemType === "question") {
          onVoteChange(
            itemId,
            response.data.votes_count,
            response.data.user_vote,
          );
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert(
        error.response?.data?.message || "Failed to vote. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(1)}
        disabled={isProcessing}
        className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg transition text-xs sm:text-sm font-medium ${
          userVote === 1
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="text-base sm:text-lg">👍</span>
        <span>Upvote</span>
      </button>

      <span
        className={`font-bold text-sm sm:text-base min-w-[2rem] text-center ${
          votesCount > 0
            ? "text-green-600"
            : votesCount < 0
              ? "text-red-600"
              : "text-gray-600"
        }`}
      >
        {votesCount}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isProcessing}
        className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg transition text-xs sm:text-sm font-medium ${
          userVote === -1
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="text-base sm:text-lg">👎</span>
        <span>Downvote</span>
      </button>
    </div>
  );
};

export default VoteButton;
