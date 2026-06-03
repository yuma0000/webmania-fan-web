import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { getGeminiApiKey } from '../lib/settings';

export function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoTitle } = location.state || {};
  
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    { text: 'こんにちは！アプリやYouTubeのことなど、何かお手伝いしましょうか？', isUser: false }
  ]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    setInput('');
    setIsSending(true);

    const updatedHistory = [...history, { text: userText, isUser: true }];
    setHistory(updatedHistory);

    try {
      const gemKey = getGeminiApiKey();
      if (!gemKey) {
        throw new Error('設定画面（右上の歯車アイコン）からGemini APIキーを登録してください。');
      }

      const contents = history.slice(-7).map((msg: any) => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({
        role: 'user',
        parts: [{ text: userText + (videoTitle ? `\n(Context - currently watching: ${videoTitle})` : '') }]
      });

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${gemKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: 'You are a helpful assistant for the Web Mania Fan app answering questions about YouTube or app usage.' }]
          }
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to generate response');

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '返信を生成できませんでした。';

      setHistory([...updatedHistory, { text: reply, isUser: false }]);
    } catch (err: any) {
      setHistory([...updatedHistory, { text: `エラーが発生しました: ${err.message}`, isUser: false }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center shrink-0">
        <button onClick={() => navigate(-1)} className="mr-3 text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">AIチャットサポート</h1>
          {videoTitle && <p className="text-xs text-gray-500 line-clamp-1">{videoTitle}</p>}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
              msg.isUser 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-200 text-gray-500 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <footer className="bg-white border-t border-gray-200 p-3 shrink-0 safe-area-pb">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder="YouTubeのことなど何でも聞いてください"
            className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-full px-4 py-2.5 outline-none transition-all disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isSending}
            className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shrink-0"
          >
            <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
