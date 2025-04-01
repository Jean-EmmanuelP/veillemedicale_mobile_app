export function Search() {
  return (
    <view className="w-full h-full bg-gray-50">
      <text className="text-2xl font-bold px-4 py-3">Recherche</text>
      <view className="p-4">
        <input 
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Rechercher..."
          type="search"
        />
      </view>
    </view>
  );
} 