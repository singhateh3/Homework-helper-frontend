import { useState, useEffect } from "react";

const EditQuestionModal = ({ question, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize form when question changes
  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title || "",
        body: question.body || "",
      });
      setCharCount(question.body?.length || 0);
      setErrors({});
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "body") {
      setCharCount(value.length);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

    setIsUpdating(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      setErrors({
        general: error.response?.data?.message || "Failed to update question",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Question</h2>
              <p className="text-blue-100 text-sm mt-1">
                Make your question clearer and more specific
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition p-1 rounded-lg hover:bg-white/10"
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
        </div>

        {/* Form Body */}
        <div
          className="overflow-y-auto p-6"
          style={{ maxHeight: "calc(90vh - 80px)" }}
        >
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's the problem you're trying to solve?"
                  className={`w-full border-2 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } rounded-lg py-3 px-4 focus:outline-none focus:ring-2 transition pr-16`}
                  autoFocus
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

            {/* Body Field with Rich Text Toolbar */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Body
                <span className="text-red-500 ml-1">*</span>
              </label>

              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
                <button
                  type="button"
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Bold (Ctrl+B)"
                  onClick={() => {
                    const textarea = document.querySelector(
                      'textarea[name="body"]',
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = formData.body.substring(start, end);
                    const newText =
                      formData.body.substring(0, start) +
                      `**${selectedText}**` +
                      formData.body.substring(end);
                    setFormData((prev) => ({ ...prev, body: newText }));
                  }}
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
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Italic (Ctrl+I)"
                  onClick={() => {
                    const textarea = document.querySelector(
                      'textarea[name="body"]',
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = formData.body.substring(start, end);
                    const newText =
                      formData.body.substring(0, start) +
                      `*${selectedText}*` +
                      formData.body.substring(end);
                    setFormData((prev) => ({ ...prev, body: newText }));
                  }}
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
                <button
                  type="button"
                  className="p-1.5 hover:bg-gray-200 rounded transition"
                  title="Code Block"
                  onClick={() => {
                    const textarea = document.querySelector(
                      'textarea[name="body"]',
                    );
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const selectedText = formData.body.substring(start, end);
                    const newText =
                      formData.body.substring(0, start) +
                      `\`\`\`\n${selectedText}\n\`\`\`` +
                      formData.body.substring(end);
                    setFormData((prev) => ({ ...prev, body: newText }));
                  }}
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
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  className={`p-1.5 hover:bg-gray-200 rounded transition ${showPreview ? "bg-blue-100 text-blue-600" : ""}`}
                  title="Preview"
                  onClick={() => setShowPreview(!showPreview)}
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>

              {/* Edit/Preview Tabs */}
              {showPreview ? (
                <div className="border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-[200px] bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Preview:
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">
                      {formData.body || "Nothing to preview yet..."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    rows={10}
                    placeholder="Provide details about your question:
• What are you trying to achieve?
• What have you tried so far?
• What errors are you getting?
• Include relevant code snippets"
                    className={`w-full border ${
                      errors.body ? "border-red-500" : "border-gray-300"
                    } border-t-0 rounded-b-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none`}
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
                        : `${Math.floor((charCount / 5000) * 100)}% complete`}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Change Summary */}
            {(formData.title !== question?.title ||
              formData.body !== question?.body) && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center text-sm text-yellow-800">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  You have unsaved changes
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="relative px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium shadow-sm"
              >
                {isUpdating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 inline mr-2"
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
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;
