import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GameTracker() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [savedGames, setSavedGames] = useState([]);
  const token = localStorage.getItem('token');

  const searchGames = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/games/search/${query}`);
      setGames(res.data);
    } catch (err) {
      console.error('Search error:', err.response?.data?.message || err.message);
    }
  };

  const saveGame = async (game) => {
    if (!token) {
      alert('You must be logged in to save games.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/games/save', game, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSavedGames();
    } catch (err) {
      console.error('Error saving game:', err.response?.data?.message || err.message);
    }
  };

  const fetchSavedGames = async () => {
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/games/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedGames(res.data);
    } catch (err) {
      console.error('Error fetching saved games:', err.response?.data?.message || err.message);
    }
  };

  const deleteGame = async (id) => {
    if (!token) {
      alert('You must be logged in to delete games.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/games/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSavedGames();
    } catch (err) {
      console.error('Error deleting game:', err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchSavedGames();
  }, []);

  return (
    <div>
      <h2>🎮 Video Game Tracker</h2>
      {token ? (
        <>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search for a game"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={searchGames}>Search</button>
          </div>

          <h3>Results</h3>
          <div className="game-grid">
            {games.map(game => (
              <div className="card" key={game.rawgId}>
                <img src={game.background_image} alt={game.name} width="100%" />
                <h4>{game.name}</h4>
                <p>Released: {game.released}</p>
                <p>Rating: {game.rating}</p>
                <p>Platforms: {game.platforms.join(', ')}</p>
                <button onClick={() => saveGame(game)}>Save</button>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '40px' }}>Saved Games</h3>
          <div className="game-grid">
            {savedGames.map(game => (
              <div className="card" key={game._id}>
                <img src={game.background_image} alt={game.name} width="100%" />
                <h4>{game.name}</h4>
                <p>Rating: {game.rating}</p>
                <p>Platforms: {game.platforms.join(', ')}</p>
                <button onClick={() => deleteGame(game._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Please login to start tracking and saving games.</p>
      )}
    </div>
  );
}

export default GameTracker;
