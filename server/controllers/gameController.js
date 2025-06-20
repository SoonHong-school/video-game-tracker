const axios = require('axios');
const Game = require('../models/Game');

exports.searchGames = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${query}`);
    const games = response.data.results.map(game => ({
      rawgId: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      released: game.released,
      platforms: game.platforms.map(p => p.platform.name),
    }));
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch games' });
  }
};

exports.saveGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: 'Failed to save game' });
  }
};

exports.getSavedGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve games' });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ message: 'Game deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete game' });
  }
};
