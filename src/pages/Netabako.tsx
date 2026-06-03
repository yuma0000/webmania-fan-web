import { ExternalLink, Lightbulb } from 'lucide-react';

export function Netabako() {
  return (
    <div className="pb-20 min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-4 py-3 border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">ネタ箱</h1>
      </header>
      
      <main className="flex-1 p-4 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">外部サイトで開きます</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            ネタ箱のサイトはセキュリティ上の制限（X-Frame-Options等）により、アプリ内に直接表示することができません。<br/><br/>
            以下のボタンから、新しいタブでネタ箱を開いてご覧ください。
          </p>
          <a
            href="https://netabako.webmhub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors w-full justify-center shadow-md"
          >
            <span>ネタ箱を開く</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </main>
    </div>
  );
}

