import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP || '2h';

if (!JWT_SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY must be set.');
}

export function generateAccessToken(userObj) {
  const payload = {
    userId: userObj._id,
    name: userObj.name,
    email: userObj.email,
  };

  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: ACCESS_TOKEN_EXP });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET_KEY);
}