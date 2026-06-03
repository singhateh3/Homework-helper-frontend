import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateQuestion = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/questions", formData);

      console.log("Success:", response.data);

      navigate("/all-questions"); // redirect only after success
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Ask a Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Question Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="body"
              className="block text-gray-700 font-bold mb-2"
            >
              Question Body
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={4}
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
