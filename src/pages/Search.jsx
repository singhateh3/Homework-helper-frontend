import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import QuestionCard from "../components/QuestionCard";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get search params from URL
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const initialCategory = queryParams.get("category") || "";
  const initialSortBy = queryParams.get("sort_by") || "relevance";
  const initialSortOrder = queryParams.get("sort_order") || "desc";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: initialCategory,
    sort_by: initialSortBy,
    sort_order: initialSortOrder,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });
  const [searchMeta, setSearchMeta] = useState(null);

  // Categories/Topics for filter
  const categories = [
    { value: "", label: "All Topics" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "programming", label: "Programming" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "history", label: "History" },
    { value: "literature", label: "Literature" },
    { value: "economics", label: "Economics" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "created_at", label: "Latest" },
    { value: "answers_count", label: "Most Answers" },
    { value: "title", label: "Title A-Z" },
    { value: "views", label: "Most Viewed" },
  ];

  const performSearch = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: searchTerm,
        page: page,
        per_page: pagination.per_page,
        ...(filters.category && { category: filters.category }),
        ...(filters.sort_by !== "relevance" && { sort_by: filters.sort_by }),
        ...(filters.sort_by !== "relevance" && {
          sort_order: filters.sort_order,
        }),
      });

      // Update URL
      navigate(`/search?${params.toString()}`, { replace: true });

      const response = await api.get(`/questions/search?${params.toString()}`);

      if (response.data.success) {
        setQuestions(response.data.data || []);
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0,
        });
        setSearchMeta(response.data.search_meta || null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to search questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(1);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    performSearch(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      category: "",
      sort_by: "relevance",
      sort_order: "desc",
    });
    navigate("/search", { replace: true });
    setQuestions([]);
    setSearchMeta(null);
  };

  // Update only the specific question that was voted on
  const updateQuestionVote = (questionId, newVotesCount, newUserVote) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, votes_count: newVotesCount, user_vote: newUserVote }
          : q,
      ),
    );
  };

  // Initial search on component mount or URL change
  useEffect(() => {
    if (initialQuery || initialCategory || initialSortBy !== "relevance") {
      performSearch(1);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SEARCH HEADER */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="text-white/80 hover:text-white transition flex items-center gap-2 text-sm sm:text-base"
            >
              ← Back to Home
            </Link>
            <span className="text-sm opacity-75">
              {pagination.total > 0 ? `${pagination.total} results` : "Search"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            Search Questions
          </h1>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 max-w-3xl"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or content..."
                className="w-full px-4 py-3 rounded-lg text-white-800 ring-1 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              🔍 Search
            </button>
          </form>
        </div>
      </section>

      {/* FILTERS SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            {/* Category Filter */}
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange("sort_by", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order (only show if not relevance) */}
            {filters.sort_by !== "relevance" && (
              <div className="flex-1 w-full sm:w-auto">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={filters.sort_order}
                  onChange={(e) =>
                    handleFilterChange("sort_order", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={applyFilters}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm ||
            filters.category ||
            filters.sort_by !== "relevance") && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  Category:{" "}
                  {categories.find((c) => c.value === filters.category)?.label}
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className="ml-1 hover:text-green-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.sort_by !== "relevance" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  Sort:{" "}
                  {sortOptions.find((s) => s.value === filters.sort_by)?.label}{" "}
                  ({filters.sort_order})
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
        {/* Results Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {loading
                ? "Searching..."
                : questions.length > 0
                  ? `Results (${pagination.total})`
                  : searchTerm
                    ? "No results found"
                    : "Enter a search term to begin"}
            </h2>
            {searchMeta && searchMeta.query && (
              <p className="text-sm text-gray-500 mt-1">
                Showing results for "{searchMeta.query}"
                {searchMeta.filters &&
                  Object.keys(searchMeta.filters).length > 0 &&
                  " with filters applied"}
              </p>
            )}
          </div>
          {pagination.total > 0 && (
            <span className="text-sm text-gray-500">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
            <p className="text-sm sm:text-base text-gray-500">
              Searching questions...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center">
            <div className="text-red-500 mb-2 text-4xl sm:text-5xl">⚠️</div>
            <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => performSearch(pagination.current_page)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Display */}
        {!loading && !error && (
          <>
            {questions.length === 0 && searchTerm && !loading && (
              <div className="bg-white rounded-lg p-8 sm:p-12 text-center border border-gray-200">
                <div className="text-5xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  No questions found
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {questions.length === 0 && !searchTerm && !loading && (
              <div className="bg-white rounded-lg p-8 sm:p-12 text-center border border-gray-200">
                <div className="text-5xl sm:text-6xl mb-4">💡</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                  Looking for something?
                </h3>
                <p className="text-sm sm:text-base text-gray-500">
                  Type a keyword above to search questions
                </p>
              </div>
            )}

            {questions.length > 0 && (
              <>
                <div className="space-y-3 sm:space-y-4">
                  {questions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      onVoteChange={updateQuestionVote}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-6 sm:mt-8">
                    <button
                      onClick={() => performSearch(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Previous
                    </button>

                    {[...Array(pagination.last_page)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show limited page numbers with ellipsis
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.last_page ||
                        Math.abs(pageNum - pagination.current_page) <= 2
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => performSearch(pageNum)}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm ${
                              pagination.current_page === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === pagination.current_page - 3 ||
                        pageNum === pagination.current_page + 3
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="px-2 py-1 text-gray-400"
                          >
                            …
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => performSearch(pagination.current_page + 1)}
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {/* CTA SECTION - Only show if no results or small results */}
      {!loading && !error && questions.length < 3 && (
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white mt-8 sm:mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-base sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Ask your own question and get help from the community
            </p>
            <Link
              to="/ask-question"
              className="inline-block bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 text-sm sm:text-base"
            >
              ✏️ Ask a Question
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Search;
