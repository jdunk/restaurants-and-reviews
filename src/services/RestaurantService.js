import Restaurant from '../models/Restaurant';
import { dbConnect } from '../utils/server/db.js';

export async function fetchAllRestaurants(user) {
  dbConnect();

  return await Restaurant.find({
    isDeleted: false,
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

  return await Restaurant.findOne({
    _id,
    isDeleted: false,
  }).populate({
    path: 'reviews.author',
    select: '_id name',
    match: {
      isDeleted: false,
    },
  });
}

export async function getReviewById(restoId, reviewId) {
  dbConnect();

  return await Restaurant.findOne({
    _id,
    isDeleted: false,
  }).populate({
    path: 'reviews.author',
    select: '_id name',
    match: {
      isDeleted: false,
    },
  });
}

export async function findRestaurantBySlug(slug) {
  dbConnect();

  return await Restaurant.findOne({
    slug,
    isDeleted: false,
  }).populate({
    path: 'reviews.author',
    select: '_id name',
    match: {
      isDeleted: false,
    },
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