import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSocket } from './hooks/useSocket.js';
import HomePage from './pages/HomePage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import GamePage from './pages/GamePage.jsx';
import DeckBuilderPage from './pages/DeckBuilderPage.jsx';

function AppRoutes() {
  useSocket();

  return (
    <Routes>
      <Route path="/"              element={<HomePage />} />
      <Route path="/lobby/:code"   element={<LobbyPage />} />
      <Route path="/game/:code"    element={<GamePage />} />
      <Route path="/deckbuilder"   element={<DeckBuilderPage />} />
      <Route path="*"              element={<Navigate to="/" replace />} />
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
