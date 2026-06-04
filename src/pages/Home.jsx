import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import QuestionCard from "../components/QuestionCard";

function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/top-questions");
      setQuestions(response.data.data || []); // Show only the 5 most recent questions
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HERO */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Homework Helper</h1>

        <p className="text-lg mb-6">
          Ask questions, get answers, and learn together.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/ask-question"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Ask Question
          </Link>

          <Link
            to="/all-questions"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Browse Questions
          </Link>
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-8">Recent Questions</h2>

        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
