// src/pages/CreateQuestion.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const CreateQuestion = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "body") {
      setCharCount(value.length);
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Body is required";
    } else if (formData.body.length < 10) {
      newErrors.body = "Body must be at least 10 characters";
    } else if (formData.body.length > 5000) {
      newErrors.body = "Body must be less than 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/questions", formData);
      console.log("Success:", response.data);

      // Navigate to the new question's page
      navigate(`/questions/${response.data.data.id}`);
    } catch (error) {
      console.error("Error creating question:", error);

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Failed to create question. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/all-questions"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Questions
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Ask a Question
            </h1>
            <p className="text-lg text-gray-600">
              Get help from the community by asking a clear, specific question
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Steps */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    Details
                  </span>
                </div>
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="ml-2 text-sm text-gray-500">Review</span>
                </div>
              </div>

              {/* Tips button */}
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700"
                onClick={() =>
                  alert(
                    "Tips:\n• Be specific\n• Provide context\n• Show what you've tried",
                  )
                }
              >
                Writing Tips ✨
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-red-700">{errors.general}</span>
                </div>
              </div>
            )}

            {/* Title Field */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Question Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., How do I fix CORS errors in Laravel with React?"
                  className={`w-full border-2 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                />
                <div className="absolute right-3 top-3 text-xs text-gray-400">
                  {formData.title.length}/200
                </div>
              </div>
              {errors.title ? (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Be specific and imagine you're asking a question to another
                  person
                </p>
              )}
            </div>

            {/* Body Field */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Question Body
                <span className="text-red-500 ml-1">*</span>
              </label>

              {/* Rich text toolbar (simplified) */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex space-x-2">
                <button
                  type="button"
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Bold"
                >
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
                      d="M6 20h6a4 4 0 000-8h-6v8zM6 4h4a4 4 0 010 8H6V4z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Italic"
                >
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
                      d="M10 4l4 16m-6-8h12"
                    />
                  </svg>
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Code"
                >
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
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </button>
              </div>

              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                rows={8}
                placeholder="Provide details about your question:
• What are you trying to achieve?
• What have you tried so far?
• What errors are you getting?
• Include relevant code snippets"
                className={`w-full border-2 ${
                  errors.body ? "border-red-500" : "border-gray-300"
                } border-t-0 rounded-b-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm`}
              />

              <div className="flex justify-between items-center mt-2">
                {errors.body ? (
                  <p className="text-sm text-red-600">{errors.body}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {charCount}/5000 characters • Markdown supported
                  </p>
                )}
                <div className="text-xs text-gray-400">
                  {charCount === 0
                    ? "Start typing..."
                    : `${Math.floor(charCount / 100)}% complete`}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {formData.body && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {formData.body}
                  </p>
                </div>
              </div>
            )}

            {/* Tags Input (Optional) */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg">
                <span className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                  laravel
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
                <span className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                  react
                  <button
                    type="button"
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Add up to 5 tags to help others find your question
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/all-questions")}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 inline"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post Question"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines Card */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            📝 Writing a good question
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <strong>Be specific</strong> - Include details about what you're
              trying to do
            </li>
            <li>
              • <strong>Show what you've tried</strong> - Share your code and
              error messages
            </li>
            <li>
              • <strong>Use proper formatting</strong> - Code blocks, lists, and
              headings help readability
            </li>
            <li>
              • <strong>Check for duplicates</strong> - Your question might have
              been answered before
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
