import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { useAuth } from '../../middleware/auth'
import { dbConnect } from '../../utils/server/db'
import { verifyAccessToken } from '../../utils/server/auth'
import User from '../../models/User'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET']))
    return;

  const { getAuthToken } = useAuth(req, resp);
  const authToken = getAuthToken(req);
  if (!authToken)
    return resp.json({ message: 'Not logged in' });

  // User has a token

  let authUserFromToken;
  
  try {
    authUserFromToken = verifyAccessToken(authToken);
  }
  catch(e) {
    return resp.json({ message: 'Not logged in' });
  }
  
  // Token is valid
  console.log({ authUserFromToken })

  dbConnect();

  try {
    const authUserFromDb = await User.findOne({ email: authUserFromToken.email })

    return resp.json({ data: { user: authUserFromDb } });
  }
  catch(e) {
    return resp.json({ error: e.toString() })
  }
};