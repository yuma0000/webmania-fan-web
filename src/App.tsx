/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { VideoPlayer } from './pages/VideoPlayer';
import { Chat } from './pages/Chat';
import { Library } from './pages/Library';
import { Netabako } from './pages/Netabako';
import { Settings } from './pages/Settings';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const location = useLocation();
  const showBottomNav = ['/', '/library', '/netabako'].includes(location.pathname);

  return (
    <div className="font-sans antialiased text-gray-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/library" element={<Library />} />
        <Route path="/netabako" element={<Netabako />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}
