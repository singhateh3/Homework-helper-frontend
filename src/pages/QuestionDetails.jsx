import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AnswerCard from "../components/AnswerCard";
import EditQuestionModal from "../components/EditQuestionModal";
import DeleteQuestionModal from "../components/DeleteQuestionModal";
import { QuestionDetailSkeleton } from "../components/Skeletons";

const ActionButton = ({ icon, onClick, color = "blue", title }) => {
  const colorClasses = {
    blue: "text-blue-600 hover:text-blue-800 hover:bg-blue-50",
    red: "text-red-600 hover:text-red-800 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} transition p-2 rounded-lg`}
      title={title}
    >
      {icon}
    </button>
  );
};

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [state, setState] = useState({
    question: null,
    loading: false,
    error: null,
    answers: [],
    showEditModal: false,
    showDeleteModal: false,
    showReplyForm: false,
    submitting: false,
    answer: "",
  });

  const {
    question,
    loading,
    error,
    answers,
    showEditModal,
    showDeleteModal,
    showReplyForm,
    submitting,
    answer,
  } = state;

  // Update state helper
  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Check if current user is the owner
  const isOwner = user && question && user.id === question.user_id;

  // Fetch question
  const fetchQuestion = useCallback(async () => {
    updateState({ loading: true, error: null });

    try {
      const response = await api.get(`/questions/${id}`);
      const questionData = response.data.data;

      updateState({
        question: questionData,
      });
    } catch (error) {
      console.error(error);
      updateState({ error: "Failed to fetch question details" });
    } finally {
      updateState({ loading: false });
    }
  }, [id, updateState]);

  // Fetch answers
  const fetchAnswers = useCallback(async () => {
    try {
      const response = await api.get(`/questions/${id}/answers`);
      const answersData = response.data.data || response.data.answers || [];
      updateState({ answers: answersData });
    } catch (error) {
      console.error(error);
      updateState({ error: "Failed to fetch answers" });
    }
  }, [id, updateState]);

  // Initial fetch
  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [fetchQuestion, fetchAnswers]);

  // Handle accept/unaccept answer
  const handleAcceptChange = useCallback((answerId, isAccepted) => {
    setState((prev) => ({
      ...prev,
      answers: prev.answers.map((a) => {
        if (a.id === answerId) {
          return { ...a, is_accepted: isAccepted };
        }
        // If this answer is being accepted, unaccept all others
        if (isAccepted && a.id !== answerId) {
          return { ...a, is_accepted: false };
        }
        return a;
      }),
    }));
  }, []);

  // Handle update question
  const handleUpdateQuestion = useCallback(
    async (formData) => {
      try {
        const response = await api.put(`/questions/${id}`, {
          title: formData.title.trim(),
          body: formData.body.trim(),
        });

        updateState({
          question: response.data.data,
        });

        alert("Question updated successfully!");
        return response;
      } catch (error) {
        console.error(error);
        const message =
          error.response?.status === 403
            ? "You don't have permission to edit this question"
            : error.response?.data?.message || "Failed to update question";
        alert(message);
        throw error;
      }
    },
    [id, updateState],
  );

  // Handle delete question
  const handleDeleteQuestion = useCallback(async () => {
    try {
      await api.delete(`/questions/${id}`);
      alert("Question deleted successfully");
      navigate("/all-questions");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.status === 403
          ? "You don't have permission to delete this question"
          : "Failed to delete question";
      alert(message);
      throw error;
    }
  }, [id, navigate]);

  // Submit answer
  const submitAnswer = useCallback(
    async (e) => {
      e.preventDefault();

      if (!answer.trim()) return;

      updateState({ submitting: true });

      try {
        await api.post("/answers", {
          question_id: id,
          body: answer.trim(),
        });

        updateState({
          answer: "",
          showReplyForm: false,
        });

        await Promise.all([fetchQuestion(), fetchAnswers()]);
      } catch (error) {
        console.error(error);
        alert("Failed to post answer");
      } finally {
        updateState({ submitting: false });
      }
    },
    [id, answer, fetchQuestion, fetchAnswers, updateState],
  );

  // Loading UI with Skeleton from Skeletons.jsx
  if (loading && !question) {
    return <QuestionDetailSkeleton />;
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center">
            <div className="text-red-500 mb-2 text-4xl sm:text-5xl">⚠️</div>
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => {
                fetchQuestion();
                fetchAnswers();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!question) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Question not found
            </h3>
            <p className="text-gray-500 mb-4">
              The question you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/all-questions"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              ← Back to Questions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sort answers: accepted first, then by creation date
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.is_accepted && !b.is_accepted) return -1;
    if (!a.is_accepted && b.is_accepted) return 1;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        {/* QUESTION DISPLAY */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{question.title}</h1>
              {question.has_accepted_answer && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Solved
                </span>
              )}
            </div>

            {/* Author info */}
            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
              <span>Asked by</span>
              <span className="font-medium text-gray-700">
                {question.user?.name || "Anonymous"}
              </span>
              <span>•</span>
              <span>{new Date(question.created_at).toLocaleDateString()}</span>
              {question.updated_at !== question.created_at && (
                <>
                  <span>•</span>
                  <span className="text-gray-400">
                    (Edited:{" "}
                    {new Date(question.updated_at).toLocaleDateString()})
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Edit/Delete Buttons */}
          {isOwner && (
            <div className="flex space-x-2 ml-4">
              <ActionButton
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                }
                onClick={() => updateState({ showEditModal: true })}
                title="Edit question"
              />
              <ActionButton
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                }
                onClick={() => updateState({ showDeleteModal: true })}
                color="red"
                title="Delete question"
              />
            </div>
          )}
        </div>

        <p className="text-gray-700 mb-6 whitespace-pre-wrap">
          {question.body}
        </p>

        {/* ACTIONS */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <Link to="/all-questions" className="text-blue-600 hover:underline">
            ← Back to Questions
          </Link>

          {user ? (
            <button
              onClick={() => updateState({ showReplyForm: !showReplyForm })}
              className="text-blue-600 hover:underline"
            >
              {showReplyForm ? "Close Reply" : "Reply"}
            </button>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">
              Login to reply
            </Link>
          )}
        </div>

        <div className="border-t my-6" />

        {/* REPLY FORM - MOVED ABOVE ANSWERS */}
        {showReplyForm && user && (
          <>
            <form onSubmit={submitAnswer} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Write your answer
              </h3>
              <textarea
                value={answer}
                onChange={(e) => updateState({ answer: e.target.value })}
                placeholder="Write your reply..."
                className="w-full border p-3 rounded outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />

              <button
                type="submit"
                disabled={submitting}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Post Reply"}
              </button>
            </form>
            <div className="border-t my-4" />
          </>
        )}

        {/* ANSWERS SECTION */}
        <h2 className="text-2xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>

        {answers.length === 0 ? (
          <p className="text-gray-500">
            No answers yet. Be the first to reply!
          </p>
        ) : (
          sortedAnswers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              question={question}
              onAcceptChange={handleAcceptChange}
            />
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      <EditQuestionModal
        question={question}
        isOpen={showEditModal}
        onClose={() => updateState({ showEditModal: false })}
        onUpdate={handleUpdateQuestion}
      />

      {/* DELETE MODAL */}
      <DeleteQuestionModal
        question={question}
        isOpen={showDeleteModal}
        onClose={() => updateState({ showDeleteModal: false })}
        onDelete={handleDeleteQuestion}
      />
    </div>
  );
};

export default QuestionDetails;
