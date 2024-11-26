import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './Login.tsx';
import DeckBuilder from './DeckBuilder.tsx';
import Decks from './Decks.tsx';
import Register from './Register.tsx';
import { UserProvider } from './UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/decks" element={<Decks />} />
          <Route path="/deckbuilder/:deckId" element={<DeckBuilder />} />
        </Routes>
      </Router>
    </UserProvider>
  </StrictMode>,
);