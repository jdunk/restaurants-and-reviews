import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { useAuth } from '../../middleware/auth'
import { dbConnect } from '../../utils/server/db'
import User from '../../models/User'
import bcrypt from 'bcrypt'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST']))
    return;

  dbConnect();

  const { setAuthCookie } = useAuth(req, resp);

  const { body } = req
  const { email, password } = body

  if (!email || !password) {
    return resp.status(400).end('Email and password are required')
  }

  const userInDb = await User.findOne({ email: req.body.email })

  if (!userInDb || !bcrypt.compareSync(password, userInDb.password)) {
    return resp.status(403).json({ error: 'Invalid login' });
  }
  
  setAuthCookie(userInDb);

  return resp.json({
    data: {
      user: {
        _id: userInDb._id,
        name: userInDb.name,
        email: userInDb.email,
        role: userInDb.role,
      }
    }
  });
};