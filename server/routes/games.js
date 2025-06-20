import express from 'express';
import axios from 'axios';
import Game from '../models/Game.js';
import dotenv from 'dotenv';
import auth from '../middleware/auth.js';
dotenv.config();

const router = express.Router();
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// 🔎 Route: Explore games (default listing)
router.get('/explore', async (req, res) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}`);
    const games = response.data.results.map(game => ({
      name: game.name,
      released: game.released,
      rating: game.rating,
      background_image: game.background_image,
    }));
    res.json(games);
  } catch (error) {
    console.error('Error fetching from RAWG:', error.message);
    res.status(500).json({ message: 'Error fetching games from RAWG API' });
  }
});

// ✅ ✅ NEW: Route for searching games
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;

  try {
    const response = await axios.get(`https://api.rawg.io/api/games`, {
      params: {
        key: RAWG_API_KEY,
        search: query,
      }
    });

    const games = response.data.results.map(game => ({
      rawgId: game.id,
      name: game.name,
      released: game.released,
      rating: game.rating,
      background_image: game.background_image,
      platforms: game.platforms.map(p => p.platform.name),
    }));

    res.json(games);
  } catch (error) {
    console.error('Error searching RAWG:', error.message);
    res.status(500).json({ message: 'Error searching games from RAWG API' });
  }
});

// POST /api/games/save
router.post('/save', auth, async (req, res) => {
  const game = new Game({ ...req.body, userId: req.user });
  await game.save();
  res.status(201).json(game);
});

// GET /api/games/saved
router.get('/saved', auth, async (req, res) => {
  const games = await Game.find({ userId: req.user });
  res.json(games);
});

// DELETE /api/games/:id
router.delete('/:id', auth, async (req, res) => {
  const game = await Game.findOneAndDelete({ _id: req.params.id, userId: req.user });
  if (!game) return res.status(404).json({ message: 'Game not found' });
  res.json({ message: 'Deleted' });
});

export default router;
