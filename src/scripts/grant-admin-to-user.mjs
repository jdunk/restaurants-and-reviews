if (process.argv.length < 3) {
  exitWithMessage(`You must provide the user's email address as a command-line argument`);
}

const email = process.argv[2];

import User from '../models/User.js';

import dotenv from "dotenv-flow";
dotenv.config();

const { dbConnect } = await import('../utils/server/db.js');

dbConnect();

console.log(`Looking up user with email address '${email}'...`);

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

let userFromDb;

try {
  userFromDb = await findUserByEmail(email);

  if (!userFromDb)
    exitWithMessage('User not found.');
}
catch (e) {
  exitWithMessage(`Error looking up user: {$e.toString()}`);
}

console.log('Found user.');
console.log({
  name: userFromDb.name,
  email: userFromDb.email,
  role: userFromDb.role,
})
if (userFromDb.role == 'admin') {
  exitWithMessage('User is already an admin.');
}

console.log('Attempting to update role...');

userFromDb.role = 'admin';

try {
  await userFromDb.save();
}
catch (e) {
  exitWithMessage(`Error looking up user: {$e.toString()}`);
}

exitWithMessage('Success. User is now an admin.');

function exitWithMessage(message) {
  console.log(message);
  process.exit(0);
}