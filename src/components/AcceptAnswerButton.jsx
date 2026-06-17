import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AcceptAnswerButton = ({ answer, question, onAcceptChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Check if current user is the question owner
  const isOwner = user && question && user.id === question.user_id;
  const isAccepted = answer.is_accepted;

  const handleAccept = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAccepted) {
        // Unaccept
        await api.patch(`/answers/${answer.id}/unaccept`);
        onAcceptChange(answer.id, false);
      } else {
        // Accept
        await api.patch(`/answers/${answer.id}/accept`);
        onAcceptChange(answer.id, true);
      }
    } catch (error) {
      console.error("Error toggling accept status:", error);
      setError(
        error.response?.data?.message || "Failed to update answer status",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user is not the question owner
  if (!isOwner) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleAccept}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-sm font-medium ${
          isAccepted
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isAccepted ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Accepted
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Accept Answer
          </>
        )}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default AcceptAnswerButton;
