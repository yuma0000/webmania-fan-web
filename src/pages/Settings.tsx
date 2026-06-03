import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getTheme, setTheme, getYouTubeApiKey, setYouTubeApiKey, getGeminiApiKey, setGeminiApiKey, applyTheme } from '../lib/settings';

export function Settings() {
  const navigate = useNavigate();
  const [theme, setThemeState] = useState(getTheme());
  const [ytKey, setYtKey] = useState(getYouTubeApiKey());
  const [gemKey, setGemKey] = useState(getGeminiApiKey());

  useEffect(() => {
    applyTheme(); // Just in case, to ensure listeners or initial state match
  }, []);

  const handleThemeChange = (newTheme: 'system' | 'light' | 'dark') => {
    setTheme(newTheme);
    setThemeState(newTheme);
  };

  const handleSaveApiKeys = () => {
    setYouTubeApiKey(ytKey);
    setGeminiApiKey(gemKey);
    alert('APIキーを保存しました');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">設定</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-8">
        <section>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">テーマ設定</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
            <label className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <input type="radio" checked={theme === 'system'} onChange={() => handleThemeChange('system')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-900 dark:text-gray-200">システム設定に従う</span>
            </label>
            <label className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <input type="radio" checked={theme === 'light'} onChange={() => handleThemeChange('light')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-900 dark:text-gray-200">ライトモード (White)</span>
            </label>
            <label className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <input type="radio" checked={theme === 'dark'} onChange={() => handleThemeChange('dark')} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-900 dark:text-gray-200">ダークモード (Black)</span>
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">API設定 (独自のキーを使用)</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube API Key</label>
              <input 
                type="password" 
                value={ytKey} 
                onChange={(e) => setYtKey(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                placeholder="YouTube Data API v3 Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gemini API Key</label>
              <input 
                type="password" 
                value={gemKey} 
                onChange={(e) => setGemKey(e.target.value)} 
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                placeholder="Google Gemini API Key"
              />
            </div>
            <button 
              onClick={handleSaveApiKeys}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              APIキーを保存
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ※空欄の場合は、環境変数（AI Studio Secrets）から読み込まれたデフォルトキーが使用されます。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">アプリについて</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">Web Mania Fan App</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0 (Web版)</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">開発者: yustudio_jp</p>
              <div className="pt-2 text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                App Credits:
                {'\n'}Developed using React and Tailwind.
                {'\n'}Powered by Google AI Studio Build and Gemini.
                {'\n'}Video content provided by YouTube API.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
