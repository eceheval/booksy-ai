import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import GenreSelection from './pages/GenreSelection';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleGenresComplete = (selectedGenres) => {
    const updatedUser = { ...user, genres: selectedGenres };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/" />} />
        
        <Route path="/genres" element={user && (!user.genres || user.genres.length === 0) ? <GenreSelection user={user} onComplete={handleGenresComplete} /> : <Navigate to="/" />} />
        
        <Route path="/" element={
          user ? (user.genres?.length > 0 ? <Home user={user} /> : <Navigate to="/genres" />) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}
export default App;