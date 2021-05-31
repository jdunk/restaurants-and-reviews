import Restaurant from '../models/Restaurant';
import { dbConnect } from '../utils/server/db.js';

export async function getRestaurantsForUser(user) {
  dbConnect();
  return await Restaurant.find({});
};