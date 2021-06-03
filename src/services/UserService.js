import User from '../models/User';
import { dbConnect } from '../utils/server/db.js';

export async function getAllUsers() {
  dbConnect();
  return await User.find({});
};