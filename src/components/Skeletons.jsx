// src/components/Skeletons.jsx

export const CardSkeleton = ({ count = 1 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse"
      >
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="flex space-x-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </>
);

export const QuestionCardSkeleton = () => (
  <div className="bg-white rounded-lg p-6 border border-gray-200 animate-pulse">
    <div className="flex items-start space-x-4">
      <div className="flex-1 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="flex items-center space-x-4">
          <div className="h-3 bg-gray-200 rounded w-24"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-1">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-8"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export const QuestionCardSkeletonList = ({ count = 5 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <QuestionCardSkeleton key={i} />
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 animate-pulse"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded mb-2"></div>
        <div className="h-6 sm:h-8 bg-white/20 rounded w-16 mb-1"></div>
        <div className="h-3 sm:h-4 bg-white/20 rounded w-20"></div>
      </div>
    ))}
  </div>
);

export const AnswerSkeleton = ({ count = 3 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-50 p-4 rounded-lg mb-4 border animate-pulse"
      >
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
  </>
);

export const QuestionDetailSkeleton = () => (
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
        <AnswerSkeleton count={3} />
      </div>
    </div>
  </div>
);

export const SearchSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    {/* Search header skeleton */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-white/20 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-24 animate-pulse"></div>
        </div>
        <div className="h-8 bg-white/20 rounded w-64 mb-4 animate-pulse"></div>
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
          <div className="flex-1 h-12 bg-white/20 rounded-lg animate-pulse"></div>
          <div className="h-12 bg-white/20 rounded-lg w-32 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Filters skeleton */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Results skeleton */}
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
      <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <QuestionCardSkeletonList count={5} />
    </div>
  </div>
);

export const AllQuestionsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <QuestionCardSkeletonList count={5} />
    </div>
  </div>
);
