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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      // Handle different response structures
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

      // 404 is acceptable - just means no answers exist yet
      if (error.response?.status === 404) {
        setAnswers([]); // Empty answers array
        // Don't set error state for 404
        return;
      }

      // For other errors (500, 403, etc.), show error
      if (error.response?.status === 500) {
        console.warn(
          "Server error - answers endpoint might not be implemented",
        );
        setAnswers([]); // Still show empty state
      } else {
        setError("Failed to fetch answers");
      }
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
        {/* QUESTION */}
        <h1 className="text-3xl font-bold mb-4">{question.title}</h1>

        <p className="text-gray-700 mb-6">{question.body}</p>

        <small className="text-gray-400 block mb-6">
          Posted on {new Date(question.created_at).toLocaleDateString()}
        </small>

        {/* ACTIONS */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <Link to="/all-questions" className="text-blue-600 hover:underline">
            ← Back to Questions
          </Link>

          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 hover:underline"
          >
            {showReplyForm ? "Close Reply" : "Reply"}
          </button>
        </div>

        <div className="border-t my-6" />

        {/* ANSWERS SECTION - WITH USERNAMES */}
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
              {/* Display username */}
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

              {/* Answer body */}
              <p className="text-gray-700 mt-2">{answer.body}</p>
            </div>
          ))
        )}

        {/* REPLY FORM */}
        {showReplyForm && (
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
    </div>
  );
};

export default QuestionDetails;
