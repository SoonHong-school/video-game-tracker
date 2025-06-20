import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  rawgId: String,
  name: String,
  background_image: String,
  released: String,
  rating: Number,
  platforms: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 🔑 Link to user
});

export default mongoose.model('Game', GameSchema);
