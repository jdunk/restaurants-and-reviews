import mongoose from 'mongoose'

const modelName = 'Review';

export default mongoose.models[modelName] || mongoose.model(
  modelName,
  new mongoose.Schema({
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    visitDate: Date,
    comment: String,
    reply: {
      comment: String,
      owner_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: { type: Date, default: null },
    },
    createdAt: { type: Date, default: Date.now },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  })
);