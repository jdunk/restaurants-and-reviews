import mongoose from 'mongoose'
import Review from './Review'

const modelName = 'Restaurant';

export default mongoose.models[modelName] || mongoose.model(
  modelName,
  new mongoose.Schema({
    name: String,
    reviews: [Review.schema],
    avgRating: Number,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  })
);