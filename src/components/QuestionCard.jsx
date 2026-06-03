import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  return (
    <Link to={`/questions/${question.id}`}>
      <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">{question.title}</h2>

        <p className="text-gray-600 mb-4">{question.body}</p>

        <small className="text-gray-400">
          Created: {new Date(question.created_at).toLocaleDateString()}
        </small>
        <div className="text-right text-sm text-gray-500 mt-2">
          <span className="mr-4">reply {question.votes}</span>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
