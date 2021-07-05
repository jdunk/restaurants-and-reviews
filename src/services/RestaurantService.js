import mongoose from 'mongoose';

import Restaurant from '../models/Restaurant';
import { dbConnect } from '../utils/server/db.js';

export async function fetchAllRestaurants(user) {
  dbConnect();

  return await Restaurant.aggregate()
    .match({ isDeleted: false })
    .project({
      ...Object.keys(Restaurant.schema.paths).reduce((carry, k) => ({ ...carry, [k]: true }), {}),
      reviews: {
        $filter: {
          input: '$reviews',
          cond: {
            $eq: ['$$this.isDeleted', false],
          },
        },
      },
    });
};

export async function fetchOwnersRestaurants(user) {
  dbConnect();

  return await Restaurant.find({
    ownerId: user._id,
    isDeleted: false,
  });
};

export async function getRestaurantById(_id) {
  dbConnect();

  const results = await Restaurant.aggregate()
    .match({ _id: mongoose.Types.ObjectId(_id), isDeleted: false })
    .project({
      ...Object.keys(Restaurant.schema.paths).reduce((carry, k) => ({ ...carry, [k]: true }), {}),
      reviews: {
        $filter: {
          input: '$reviews',
          cond: {
            $eq: ['$$this.isDeleted', false],
          },
        },
      },
    });
  
  const resto = Restaurant.hydrate(results[0]);

  return await Restaurant
    .populate(resto, {
      path: 'reviews.author',
      select: '_id name',
      match: {
        isDeleted: false,
      }
    });
}

export async function findRestaurantBySlug(slug) {
  dbConnect();

  const results = await Restaurant.aggregate()
    .match({ slug, isDeleted: false })
    .project({
      ...Object.keys(Restaurant.schema.paths).reduce((carry, k) => ({ ...carry, [k]: true }), {}),
      reviews: {
        $filter: {
          input: '$reviews',
          cond: {
            $eq: ['$$this.isDeleted', false],
          },
        },
      },
    });
  
  const resto = Restaurant.hydrate(results[0]);

  return await Restaurant
    .populate(resto, {
      path: 'reviews.author',
      select: '_id name',
      match: {
        isDeleted: false,
      }
    });
}

export async function deleteRestaurant(_id, ownerId = undefined) {
  dbConnect();

  const criteria = {
    _id,
    ...( ownerId ? { ownerId } : {}),
  };
  return await Restaurant.updateOne(criteria, {
    isDeleted: true,
    deletedAt: Date.now(),
  });
};

export async function deleteReview(restoId, reviewId) {
  dbConnect();

  const criteria = {
    _id: restoId,
    'reviews._id': reviewId,
  };
  return await Restaurant.updateOne(criteria, {
    $set: { 'reviews.$.isDeleted': true, }
  });
};

export function calculateMetadata(reviews) {
  return reviews.reduce(
    (obj, review) => ({
      avgRating: obj.numReviews ?
        (obj.avgRating * obj.numReviews + review.rating) / (obj.numReviews + 1)
        :
        obj.avgRating = review.rating,

      numReviews: obj.numReviews + 1,
    }),
    {
      avgRating: null,
      numReviews: 0,
    }
  );
};