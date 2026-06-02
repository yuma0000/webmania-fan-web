import { useState } from 'react';

export function Netabako() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="pb-20 min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-4 py-3 border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">ネタ箱</h1>
      </header>
      
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <iframe 
          src="https://netabako.webmhub.com" 
          className="w-full h-full border-0 absolute inset-0"
          onLoad={() => setLoading(false)}
        />
      </main>
    </div>
  );
}
