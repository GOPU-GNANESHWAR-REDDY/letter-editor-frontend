import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LetterEditor from './components/LetterEditor';

const BACKEND_URL = 'https://your-render-backend-url.com'; // ✅ Update with your actual Render URL

const App = () => {
  const [user, setUser] = useState(null);
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, '/');
      fetchUserProfile(token);
    } else {
      const storedToken = localStorage.getItem('token');
      if (storedToken) fetchUserProfile(storedToken);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const handleSaveLetter = (content) => {
    setLetters([...letters, content]);
    alert('Letter saved (currently in memory).');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {user ? (
        <div>
          <h2>Welcome, {user.user.displayName}!</h2>
          <img src={user.user.photos[0].value} alt="Profile" width="100" />
          <p>Email: {user.user.emails[0].value}</p>
          <button onClick={handleLogout}>Logout</button>

          {/* Letter Editor */}
          <LetterEditor onSave={handleSaveLetter} />

          {/* Display saved letters */}
          <div>
            <h3>Saved Letters</h3>
            {letters.map((letter, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                <div dangerouslySetInnerHTML={{ __html: letter }} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <a href={`${BACKEND_URL}/auth/google`}>
          <button>Login with Google</button>
        </a>
      )}
    </div>
  );
};

export default App;

