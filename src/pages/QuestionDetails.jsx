import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    body: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check if current user is the owner
  const isOwner = user && question && user.id === question.user_id;

  // Fetch question
  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/questions/${id}`);
      console.log(response.data);
      setQuestion(response.data.data);

      // Initialize edit form with current values
      setEditForm({
        title: response.data.data.title || "",
        body: response.data.data.body || "",
      });
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

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit edit/update
  const handleUpdateQuestion = async (e) => {
    e.preventDefault();

    if (!editForm.title.trim() || !editForm.body.trim()) {
      alert("Title and body cannot be empty");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await api.put(`/questions/${id}`, {
        title: editForm.title.trim(),
        body: editForm.body.trim(),
      });

      console.log("Update response:", response.data);

      // Update the question state
      setQuestion(response.data.data);
      setShowEditModal(false);

      // Show success message
      alert("Question updated successfully!");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        alert("You don't have permission to edit this question");
      } else {
        alert(error.response?.data?.message || "Failed to update question");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete question
  const handleDeleteQuestion = async () => {
    setIsDeleting(true);

    try {
      await api.delete(`/questions/${id}`);
      alert("Question deleted successfully");
      navigate("/all-questions");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        alert("You don't have permission to delete this question");
      } else {
        alert("Failed to delete question");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
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
      await fetchQuestion();
      await getAnswers();
    } catch (error) {
      console.error(error);
      alert("Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

  // GET ANSWERS
  const getAnswers = async () => {
    try {
      const response = await api.get(`/questions/${id}/answers`);
      console.log("Fetched answers:", response.data);

      if (response.data.data) {
        setAnswers(response.data.data);
      } else if (response.data.answers) {
        setAnswers(response.data.answers);
      } else {
        setAnswers([]);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch answers");
    }
  };

  useEffect(() => {
    getAnswers();
  }, [id]);

  // Loading UI
  if (loading && !question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-9 h-9 rounded-full border-2 border-stone-200 border-t-stone-500 animate-spin" />
      </div>
    );
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

          {/* Edit/Delete Buttons - ONLY SHOW FOR OWNER */}
          {isOwner && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                title="Edit question"
              >
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
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-800 transition p-2 rounded-lg hover:bg-red-50"
                title="Delete question"
              >
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
              </button>
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
              onClick={() => setShowReplyForm(!showReplyForm)}
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
            <div
              key={answer.id}
              className="bg-gray-50 p-4 rounded-lg mb-4 border"
            >
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

              <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                {answer.body}
              </p>
            </div>
          ))
        )}

        {/* REPLY FORM */}
        {showReplyForm && user && (
          <form onSubmit={submitAnswer} className="mt-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Question</h2>
              <button
                onClick={() => setShowEditModal(false)}
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

            <form onSubmit={handleUpdateQuestion}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
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
                  value={editForm.body}
                  onChange={handleEditChange}
                  rows={8}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide more details about your question..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isUpdating ? "Updating..." : "Update Question"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
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
                Are you sure you want to delete this question? This action
                cannot be undone.
              </p>

              <p className="text-sm text-gray-400 mb-6">
                "{question.title.substring(0, 100)}"
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteQuestion}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
