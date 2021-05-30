import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { useAuth } from '../../hooks/auth'
import { dbConnect } from '../../utils/server/db'
import { verifyAccessToken } from '../../utils/server/auth'
import User from '../../models/User'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET']))
    return;

  // dbConnect();

  const { getAuthToken } = useAuth(req, resp);
  const authUser = verifyAccessToken(getAuthToken(req));
  console.log({ authUser })

  const userInDb = await User.findOne({ email: authUser.email })

  if (!userInDb) {
  }
  
  return resp.json(userInDb)
};