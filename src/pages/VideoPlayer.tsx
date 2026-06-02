import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageSquareMore } from 'lucide-react';
import { SavedVideo } from '../types';

export function VideoPlayer() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [videoInfo, setVideoInfo] = useState<any>(null);

  useEffect(() => {
    if (!videoId) return;
    
    // Load local data
    const savedItems: SavedVideo[] = JSON.parse(localStorage.getItem('saved_videos') || '[]');
    const existing = savedItems.find(item => item.videoId === videoId);
    if (existing) {
      setComment(existing.localComment || '');
      setIsSaved(true);
    }

    // Try to fetch video details to save title/thumbnail
    const fetchDetails = async () => {
      try {
        const apiKey = process.env.VITE_YOUTUBE_API_KEY || ''; // Usually we'd fetch via server but since we have iframe, title is mostly for local DB.
        // We can just use search endpoint trick or standard youtube oembed
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await res.json();
        setVideoInfo(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDetails();
  }, [videoId]);

  const saveToLocal = (newComment: string) => {
    if (!videoId) return;
    const savedItems: SavedVideo[] = JSON.parse(localStorage.getItem('saved_videos') || '[]');
    let existingIndex = savedItems.findIndex(item => item.videoId === videoId);
    
    const newItem: SavedVideo = {
      videoId,
      title: videoInfo?.title || `Video ${videoId}`,
      thumbnail: videoInfo?.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      isFavorite: true,
      localComment: newComment,
    };

    if (existingIndex >= 0) {
      if (newComment.trim() === '') {
        // removing
        savedItems.splice(existingIndex, 1);
        setIsSaved(false);
      } else {
        savedItems[existingIndex] = newItem;
        setIsSaved(true);
      }
    } else if (newComment.trim() !== '') {
      savedItems.push(newItem);
      setIsSaved(true);
    }
    
    localStorage.setItem('saved_videos', JSON.stringify(savedItems));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComment(val);
    saveToLocal(val);
  };

  if (!videoId) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-10 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 line-clamp-1 flex-1">
          {videoInfo?.title || '動画再生'}
        </h1>
        <button 
          onClick={() => navigate(`/chat`, { state: { videoId, videoTitle: videoInfo?.title } })}
          className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-full ml-2"
        >
          <MessageSquareMore className="w-5 h-5" />
        </button>
      </header>

      <main>
        <div className="w-full aspect-video bg-black sticky top-14 z-10 shadow-md">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="p-4 max-w-2xl mx-auto space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-700 w-full">
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              <h2 className="font-bold text-lg">自分専用メモ</h2>
            </div>
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="この動画に関するメモや感想を書いて保存しよう..."
              className="w-full min-h-[120px] p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y transition-shadow"
            />
            {isSaved && <p className="text-xs text-green-600 self-end font-medium">保存されました</p>}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
               onClick={() => navigate(`/chat`, { state: { videoId, videoTitle: videoInfo?.title } })}>
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <MessageSquareMore className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">AIチャットサポート</h3>
              <p className="text-sm text-blue-700 mt-1">動画についてわからないことをGeminiに聞いてみましょう</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
