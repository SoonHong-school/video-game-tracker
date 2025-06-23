import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'AIzaSyCxz1K1wp_JhPqnMwcxJagOkdhH3cSMrKg';

const CHANNELS = [
  { id: 'UCNvzD7Z-g64bPXxGzaQaa4g', name: 'Gameranx 🎮' },
  { id: 'UCKy1dAqELo0zrOtPkf0eTMw', name: 'IGN 📰' },
  { id: 'UCsgv2QHkT2ljEixyulzOnUQ', name: 'AngryJoeShow 😡' },
  { id: 'UCitsvZeConV2Im24BVFH8hg', name: 'VideoGameNews 🧾' },
  { id: 'UCw7FkXsC00lH2v2yB5LQoYA', name: 'Jackfrags 🎥' }
];

function Suggestion() {
  const [videos, setVideos] = useState({});
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const results = {};
        for (const channel of CHANNELS) {
          const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              key: API_KEY,
              channelId: channel.id,
              part: 'snippet',
              order: 'date',
              maxResults: 5,
              type: 'video',
            },
          });
          results[channel.name] = res.data.items.filter(item => item.id.videoId);
        }
        setVideos(results);
      } catch (err) {
        console.error('YouTube API Error:', err);
        setError('Failed to fetch videos. Check your API key or quota.');
      }
    };
    fetchVideos();
  }, []);

  const toggleExpand = (channelName) => {
    setExpanded(prev => ({ ...prev, [channelName]: !prev[channelName] }));
  };

  return (
    <div className="container mt-5 mb-5 text-dark">
      <h2 className="text-center mb-4 fw-bold">🎮 Latest Gaming Video Games News for you</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {Object.entries(videos).map(([channelName, vids]) => (
        <div key={channelName} className="mb-4">
          <button
            className="btn btn-light w-100 text-start fw-bold border shadow-sm"
            style={{
              borderRadius: '10px',
              padding: '15px 20px',
              fontSize: '1.2rem',
              color: '#212529',
            }}
            onClick={() => toggleExpand(channelName)}
          >
            {expanded[channelName] ? '▼' : '▶'} {channelName}
          </button>

          {expanded[channelName] && (
            <div className="mt-4 d-flex flex-column gap-4">
              {vids.map(video => (
                <div
                  key={video.id.videoId}
                  className="card mx-auto shadow-sm"
                  style={{ maxWidth: '900px', borderRadius: '10px' }}
                >
                  <iframe
                    width="100%"
                    height="480"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    title={video.snippet.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px'
                    }}
                  ></iframe>
                  <div className="card-body bg-white text-dark">
                    <h5 className="card-title">{video.snippet.title}</h5>
                    <p className="card-text">{video.snippet.description.slice(0, 150)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Suggestion;
