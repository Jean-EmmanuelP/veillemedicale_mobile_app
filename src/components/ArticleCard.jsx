export const ArticleCard = ({ article }) => {
  const gradeColors = {
    'A': 'bg-green-500',
    'B': 'bg-blue-500',
    'C': 'bg-yellow-500',
    'D': 'bg-red-500'
  };

  return (
    <view className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <view className="flex justify-between items-center">
        <text className="text-lg font-bold text-gray-900">
          {article.title}
        </text>
        <text className={`px-2 py-1 text-sm text-white rounded ${gradeColors[article.recommendationGrade]}`}>
          Grade {article.recommendationGrade}
        </text>
      </view>
      
      <text className="mt-3 text-gray-600">
        {article.abstract}
      </text>
      
      <view className="mt-4 flex items-center space-x-4">
        <text className="text-sm text-gray-500">
          Par {article.author}
        </text>
        <text className="text-sm text-gray-500">
          {new Date(article.date).toLocaleDateString()}
        </text>
        <text className="text-sm text-gray-500">
          {article.readTime} min de lecture
        </text>
      </view>
      
      <view className="mt-3 flex items-center space-x-4">
        <text className="text-sm text-gray-500 flex items-center">
          <span className="mr-1">👁</span> {article.views}
        </text>
        <text className="text-sm text-gray-500 flex items-center">
          <span className="mr-1">❤️</span> {article.likes}
        </text>
      </view>
    </view>
  );
}; 