import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Loading Skeleton Components
const QuestionSkeleton = () => (
  <div className="min-h-screen bg-gray-100 py-10 px-6">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Body skeleton */}
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 rounded w-10/12"></div>
        <div className="h-4 bg-gray-200 rounded w-9/12"></div>
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center justify-between text-sm">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>

      <div className="border-t my-6" />

      {/* Answers section skeleton */}
      <div className="mb-4">
        <div className="h-7 bg-gray-200 rounded w-48 mb-4"></div>

        {/* Answer skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg mb-4 border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-10/12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Modal Components
const EditModal = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Question</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's your question?"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Body
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={onChange}
              rows={8}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide more details about your question..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isSubmitting ? "Updating..." : "Update Question"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  questionTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Question
          </h3>
          <p className="text-gray-500 mb-4">
            Are you sure you want to delete this question? This action cannot be
            undone.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            "{questionTitle?.substring(0, 100)}"
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnswerCard = ({ answer }) => (
  <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {answer.user?.name?.charAt(0).toUpperCase() || "?"}
          </span>
        </div>
        <span className="font-medium text-gray-700">
          {answer.user?.name || "Anonymous User"}
        </span>
      </div>
      <small className="text-gray-400">
        {new Date(answer.created_at).toLocaleDateString()}
      </small>
    </div>
    <p className="text-gray-700 mt-2 whitespace-pre-wrap">{answer.body}</p>
  </div>
);

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
    isUpdating: false,
    isDeleting: false,
    submitting: false,
    answer: "",
    editForm: { title: "", body: "" },
  });

  const {
    question,
    loading,
    error,
    answers,
    showEditModal,
    showDeleteModal,
    showReplyForm,
    isUpdating,
    isDeleting,
    submitting,
    answer,
    editForm,
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
        editForm: {
          title: questionData.title || "",
          body: questionData.body || "",
        },
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

  // Handle edit form changes
  const handleEditChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      updateState({
        editForm: { ...editForm, [name]: value },
      });
    },
    [editForm, updateState],
  );

  // Handle update question
  const handleUpdateQuestion = useCallback(
    async (e) => {
      e.preventDefault();

      if (!editForm.title.trim() || !editForm.body.trim()) {
        alert("Title and body cannot be empty");
        return;
      }

      updateState({ isUpdating: true });

      try {
        const response = await api.put(`/questions/${id}`, {
          title: editForm.title.trim(),
          body: editForm.body.trim(),
        });

        updateState({
          question: response.data.data,
          showEditModal: false,
        });

        alert("Question updated successfully!");
      } catch (error) {
        console.error(error);
        const message =
          error.response?.status === 403
            ? "You don't have permission to edit this question"
            : error.response?.data?.message || "Failed to update question";
        alert(message);
      } finally {
        updateState({ isUpdating: false });
      }
    },
    [id, editForm, updateState],
  );

  // Handle delete question
  const handleDeleteQuestion = useCallback(async () => {
    updateState({ isDeleting: true });

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
    } finally {
      updateState({ isDeleting: false, showDeleteModal: false });
    }
  }, [id, navigate, updateState]);

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

  // Loading UI with Skeleton
  if (loading && !question) {
    return <QuestionSkeleton />;
  }

  // Error UI
  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  // Not found
  if (!question) {
    return <p className="text-center py-10">Question not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        {/* QUESTION DISPLAY */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{question.title}</h1>

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

        {/* ANSWERS SECTION */}
        <h2 className="text-2xl font-semibold mb-4">
          Answers ({answers.length})
        </h2>

        {answers.length === 0 ? (
          <p className="text-gray-500">
            No answers yet. Be the first to reply!
          </p>
        ) : (
          answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} />
          ))
        )}

        {/* REPLY FORM */}
        {showReplyForm && user && (
          <form onSubmit={submitAnswer} className="mt-6">
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
        )}
      </div>

      {/* MODALS */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => updateState({ showEditModal: false })}
        form={editForm}
        onChange={handleEditChange}
        onSubmit={handleUpdateQuestion}
        isSubmitting={isUpdating}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => updateState({ showDeleteModal: false })}
        onConfirm={handleDeleteQuestion}
        isDeleting={isDeleting}
        questionTitle={question.title}
      />
    </div>
  );
};

export default QuestionDetails;
