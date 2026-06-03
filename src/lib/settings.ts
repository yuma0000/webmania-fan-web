type Theme = 'system' | 'light' | 'dark';

export function getTheme(): Theme {
  return (localStorage.getItem('app_theme') as Theme) || 'system';
}

export function setTheme(theme: Theme) {
  localStorage.setItem('app_theme', theme);
  applyTheme();
}

export function applyTheme() {
  const theme = getTheme();
  const root = document.documentElement;
  
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function getYouTubeApiKey(): string {
  return localStorage.getItem('youtube_api_key') || 'AIzaSyDplH847sW3tgxD9ksMaRU_S4o1qKh_4GM';
}

export function setYouTubeApiKey(key: string) {
  localStorage.setItem('youtube_api_key', key);
}

export function getGeminiApiKey(): string {
  return localStorage.getItem('gemini_api_key') || 'AIzaSyDplH847sW3tgxD9ksMaRU_S4o1qKh_4GM';
}

export function setGeminiApiKey(key: string) {
  localStorage.setItem('gemini_api_key', key);
}

export function getAuthHeaders() {
  const ytKey = getYouTubeApiKey();
  const gemKey = getGeminiApiKey();
  const headers: Record<string, string> = {};
  if (ytKey) headers['X-YouTube-Key'] = ytKey;
  if (gemKey) headers['X-Gemini-Key'] = gemKey;
  return headers;
}
