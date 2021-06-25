import mongoose from 'mongoose'
import Review from './Review'

const modelName = 'Restaurant';

export default mongoose.models[modelName] || mongoose.model(
  modelName,
  new mongoose.Schema({
    ownerId: String,
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters']
    },
    reviews: [Review.schema],
    avgRating: Number,
    createdAt: { type: Date, default: Date.now },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  })
);