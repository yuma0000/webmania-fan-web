import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">設定</h1>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">アプリ設定</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">ダークテーマ</p>
                <p className="text-sm text-gray-500 mt-1">システムのテーマに追従します</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 disabled" disabled />
                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">APIキー (Gemini/YouTube)</p>
                <p className="text-sm text-gray-500 mt-1">環境変数から読み込まれています</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">連携済み</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">情報</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            <div className="p-4">
              <p className="font-medium text-gray-900">アプリバージョン</p>
              <p className="text-sm text-gray-500 mt-1">1.0.0 (Web版)</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
