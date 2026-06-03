import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings, MessageSquareMore } from 'lucide-react';
import { YouTubeChannel, YouTubeVideo } from '../types';

import { getAuthHeaders } from '../lib/settings';

export function Home() {
  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const channelId = 'UCvpDuJLRV07mTu6gh9CGq0w'; // Web Mania Target Channel

  const fetchData = async (query = '') => {
    // キャッシュの確認（初期表示のみ）
    if (!query) {
      const cachedStr = sessionStorage.getItem('home_channel_data');
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          if (Date.now() - cached.timestamp < 1000 * 60 * 60) { // 1時間有効
             setChannel(cached.channel);
             setVideos(cached.videos);
             setLoading(false);
             return;
          }
        } catch (e) {}
      }
    }

    setLoading(true);
    setError('');
    try {
      let chanResData = channel;
      if (!chanResData) {
        const chanRes = await fetch(`/api/youtube/channel/${channelId}`, { headers: getAuthHeaders() });
        if (!chanRes.ok) {
           const errText = await chanRes.text();
           throw new Error(errText);
        }
        chanResData = await chanRes.json();
        setChannel(chanResData);
      }

      let searchUrl = `/api/youtube/search?channelId=${channelId}`;
      if (query) searchUrl += `&q=${encodeURIComponent(query)}`;
      const vidRes = await fetch(searchUrl, { headers: getAuthHeaders() });
      
      if (!vidRes.ok) {
        let errorText = 'データ取得に失敗しました';
        try {
          const errData = await vidRes.json();
          errorText = errData.error || errData.message || errorText;
        } catch(e) {
          const rawText = await vidRes.text();
          if (rawText) errorText = rawText;
        }
        
        if (errorText.toLowerCase().includes('quota')) {
           errorText = 'YouTube APIの1日の利用制限（リクエスト上限）に達しました。明日また検索をお試しください。';
        }
        throw new Error(errorText);
      }
      
      const vids = await vidRes.json();
      const filteredVids = vids.filter((v: YouTubeVideo) => v.id?.videoId);
      setVideos(filteredVids); 

      // 初期表示ならキャッシュを保存
      if (!query && chanResData) {
        sessionStorage.setItem('home_channel_data', JSON.stringify({
          channel: chanResData,
          videos: filteredVids,
          timestamp: Date.now()
        }));
      }

    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Web Mania Fan</h1>
        <button onClick={() => navigate('/settings')} className="text-gray-500 hover:text-gray-900">
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="動画を検索"
            className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          {searchQuery && (
            <button type="submit" className="absolute right-3 top-2.5 text-blue-600 p-1 bg-blue-50 rounded-md hover:bg-blue-100">
              <Search className="w-4 h-4" />
            </button>
          )}
        </form>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg">
            <p className="mb-4">{error}</p>
            <button onClick={() => fetchData(searchQuery)} className="px-4 py-2 bg-red-100 rounded hover:bg-red-200 transition-colors">
              再試行
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {channel && !searchQuery && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                <img 
                  src={channel.snippet.thumbnails.medium.url} 
                  alt={channel.snippet.title}
                  className="w-20 h-20 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{channel.snippet.title}</h2>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>{parseInt(channel.statistics.subscriberCount).toLocaleString()} subscribers</span>
                    <span className="mx-2">•</span>
                    <span>{parseInt(channel.statistics.videoCount).toLocaleString()} videos</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{channel.snippet.description}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">動画一覧</h3>
              {videos.map((video) => (
                <div 
                  key={video.id.videoId}
                  onClick={() => navigate(`/video/${video.id.videoId}`)}
                  className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <img 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title}
                    className="w-32 h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2 leading-snug">{video.snippet.title}</h4>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(video.snippet.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for AI Chat */}
      <button 
        onClick={() => navigate('/chat')}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all z-20"
      >
        <MessageSquareMore className="w-6 h-6" />
      </button>
    </div>
  );
}
