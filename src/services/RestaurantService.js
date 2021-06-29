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

export async function findRestaurantBySlug(slug) {
  dbConnect();

  return await Restaurant.findOne({
    slug,
    isDeleted: false,
  }).populate('reviews.author', '_id name');
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