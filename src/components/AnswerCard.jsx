import AcceptAnswerButton from "./AcceptAnswerButton";

const AnswerCard = ({ answer, question, onAcceptChange }) => {
  return (
    <div
      className={`bg-gray-50 p-4 rounded-lg mb-4 border ${
        answer.is_accepted ? "border-green-400 bg-green-50" : ""
      }`}
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
          {answer.is_accepted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Accepted
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <small className="text-gray-400">
            {new Date(answer.created_at).toLocaleDateString()}
          </small>
        </div>
      </div>

      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{answer.body}</p>

      {/* Accept Answer Button */}
      {question && (
        <div className="mt-3 flex justify-end">
          <AcceptAnswerButton
            answer={answer}
            question={question}
            onAcceptChange={onAcceptChange}
          />
        </div>
      )}
    </div>
  );
};

export default AnswerCard;
