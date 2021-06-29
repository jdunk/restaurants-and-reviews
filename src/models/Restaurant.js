import mongoose from 'mongoose';
import slugify from 'slugify';

import Review from './Review';

const modelName = 'Restaurant';

const schema = new mongoose.Schema({
  ownerId: String,
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  slug: {
    type: String,
    unique: true,
  },
  reviews: [Review.schema],
  numReviews: Number,
  avgRating: Number,
  createdAt: { type: Date, default: Date.now },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
});

schema.pre('save', async function (next) {
  this.numReviews = this.reviews.length;
  this.avgRating = this.reviews.reduce(
    (carry, review) => ({
      avg: carry.avg ?
             (carry.avg + review.rating) / (carry.num + 1)
             :
             review.rating,
      num: carry.num + 1,
    }),
    { avg: null, num: 0 }
  )
  .avg;

  if (!this.isModified('name')) return next();

  this.slug = await this.getUniqueSlug();

  return next();
});

schema.methods.getUniqueSlug = async function getUniqueSlug() {
  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
  });

  const slugRegex = new RegExp(`^${baseSlug}(-[0-9]+)?$`);

  // If name edit did not result in base slug change, keep existing slug
  if (!this.isNew && this.slug.match(slugRegex))
    return this.slug;

  const existingSlugs = (await mongoose.model(modelName).find({
      slug: slugRegex,
      _id: { $ne: this._id },
    },
    'slug -_id'
  )).map(x => x.slug);

  if (!existingSlugs?.length)
    return baseSlug;

  const highestNum = existingSlugs.reduce((currHighest, slug) => {
    const matches = slug.match(new RegExp(`^${baseSlug}-([0-9]+)$`));
    const num = (matches && matches[1] && Number(matches[1]));

    return num > currHighest ? num : currHighest;
  }, 1);

  return `${baseSlug}-${(highestNum + 1)}`;
};

export default mongoose.models[modelName] || mongoose.model(
  modelName,
  schema
);