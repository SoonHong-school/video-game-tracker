import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameTracker from './GameTracker';
import Login from './Login';
import Register from './Register';
import Suggestion from './Suggestion'; // ✅ If Suggestion.js is in /src

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <nav>
        <div className="links">
          <Link to="/" style={{ color: 'white', marginRight: '10px' }}>Home</Link>

          {/* ✅ Show Suggestion tab if logged in */}
          {isLoggedIn && (
            <Link to="/suggestion" style={{ color: 'white', marginRight: '10px' }}>News</Link>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" style={{ color: 'white', marginRight: '10px' }}>Login</Link>
              <Link to="/register" style={{ color: 'white', marginRight: '10px' }}>Register</Link>
            </>
          )}
        </div>
        {isLoggedIn && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<GameTracker />} />
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/suggestion" element={<Suggestion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
