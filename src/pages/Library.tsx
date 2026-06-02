import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedVideo } from '../types';
import { Search } from 'lucide-react';

export function Library() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'memo' | 'favorite'>('memo');
  const [savedItems, setSavedItems] = useState<SavedVideo[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('saved_videos') || '[]');
    setSavedItems(items);
  }, []);

  const filteredItems = savedItems.filter(item => {
    if (activeTab === 'memo') return !!item.localComment;
    return item.isFavorite; // in our logic, saved == favorite
  });

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <header className="bg-white pt-4 border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 px-4 mb-4">ライブラリ</h1>
        <div className="flex px-4 gap-4">
          <button 
            onClick={() => setActiveTab('memo')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'memo' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            メモ
          </button>
          <button 
            onClick={() => setActiveTab('favorite')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'favorite' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            お気に入り
          </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4 mt-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {activeTab === 'memo' ? '保存されたメモはありません。' : 'お気に入りに登録された動画はありません。'}
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.videoId}
              onClick={() => navigate(`/video/${item.videoId}`)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-3">
                <img 
                  src={item.thumbnail} 
                  className="w-28 h-16 object-cover rounded-md flex-shrink-0 bg-gray-100" 
                  alt="" 
                />
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-relaxed">
                  {item.title}
                </h3>
              </div>
              {item.localComment && (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 break-words whitespace-pre-wrap">
                  {item.localComment}
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
