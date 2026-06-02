import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/youtube/channel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'YOUTUBE_API_KEY is missing' });
      }

      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${apiKey}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      res.json(data.items?.[0] || null);
    } catch (e: any) {
      res.status(500).json({ error: e.message || 'Failed to fetch channel' });
    }
  });

  app.get('/api/youtube/search', async (req, res) => {
    try {
      const { channelId, q } = req.query;
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'YOUTUBE_API_KEY is missing' });
      }

      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&order=date&key=${apiKey}`;
      if (channelId) url += `&channelId=${channelId}`;
      if (q) url += `&q=${encodeURIComponent(q as string)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      res.json(data.items || []);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Failed to search videos' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is missing' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = 'You are a helpful assistant for the Web Mania Fan app answering questions about YouTube or app usage.';
      
      const contents = history.map((msg: any) => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
        }
      });

      res.json({ reply: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Failed to generate response' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
