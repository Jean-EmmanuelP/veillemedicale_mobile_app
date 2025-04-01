import { useUser } from '$hooks/useUser.ts';
import { useCheckPremiumAccess } from '$hooks/useCheckPremiumAccess.ts';
import { useState } from 'react';

export function Feed() {
  const { data: user } = useUser();
  const { checkAccess } = useCheckPremiumAccess();

  const handlePremiumFeatureClick = () => {
    if (checkAccess()) {
      // Accéder à la fonctionnalité premium
      console.log('Accès à la fonctionnalité premium');
    }
  };
  const [selectedCategory, setSelectedCategory] = useState('Cardiologie');
  // Mock data pour les catégories
  const categories = [
    'Cardiologie',
    'Neurologie',
    'Pédiatrie',
    'Oncologie',
    'Psychiatrie',
    'Dermatologie',
  ];
  const articles = [
    {
      title: "Nouvelles approches dans le traitement de l'hypertension",
      content: 'Une étude récente montre que...',
      recommendationGrade: 'A',
      date: '2024-03-20',
      discipline: 'Cardiologie',
    },
    {
      title: 'Avancées en neurochirurgie',
      content: 'Les techniques innovantes...',
      recommendationGrade: 'B',
      date: '2024-03-19',
      discipline: 'Neurologie',
    },
  ];

  return (
    <view className="w-full h-full bg-gray-50">
      <text className="text-2xl font-bold px-4 py-3">Feed</text>
      <view className="w-full h-full flex flex-col">
        <scroll-view
          scroll-orientation="horizontal"
          className="w-full h-20 bg-white shadow-sm px-4 py-2 flex-shrink-0"
        >
          <view className="flex space-x-3">
            {categories.map((category) => (
              <view
                key={category}
                bindtap={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full cursor-pointer transition-colors
                  ${selectedCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <text className="text-sm font-medium whitespace-nowrap">
                  {category}
                </text>
              </view>
            ))}
          </view>
        </scroll-view>

        <scroll-view
          scroll-orientation="vertical"
          className="flex-1 p-4"
        >
          {articles
            .filter((article) => article.discipline === selectedCategory)
            .map((article, index) => (
              <view
                key={index}
                className="mb-4 p-4 bg-white rounded-lg shadow"
              >
                <text className="text-xl font-bold mb-2">
                  {article.title}
                </text>
                <text className="text-base text-gray-700">
                  {article.content}
                </text>
                <view className="mt-2 text-sm text-gray-500">
                  Grade de recommandation: {article.recommendationGrade} |
                  Date: {article.date} | Discipline: {article.discipline}
                </view>
              </view>
            ))}
        </scroll-view>
      </view>
    </view>
  );
}
