import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSocket } from './hooks/useSocket.js';
import HomePage from './pages/HomePage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import GamePage from './pages/GamePage.jsx';

function AppRoutes() {
  // Register global socket listeners once at the top of the tree
  useSocket();

  return (
    <Routes>
      <Route path="/"             element={<HomePage />} />
      <Route path="/lobby/:code"  element={<LobbyPage />} />
      <Route path="/game/:code"   element={<GamePage />} />
      {/* Catch-all */}
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
