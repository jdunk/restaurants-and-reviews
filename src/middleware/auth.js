import { setAuthCookie, getAuthToken } from '../utils/server/cookies';
import { generateAccessToken, verifyAccessToken } from '../utils/server/auth';
import { dbConnect } from '../utils/server/db'
import User from '../models/User'

export const useAuth = (req, resp) => ({
  setAuthCookie: userObj => setAuthCookie(resp, generateAccessToken(userObj)),
  unsetAuthCookie: () => setAuthCookie(resp, '', 0),
  getAuthToken: () => getAuthToken(req),
});

export const requireAuthUser = async (req, resp) => {
  return await getAuthUser(req, resp, true);
};

export const getAuthUser = async (req, resp, isRequired = false) => {
  const authToken = getAuthToken(req);
  
  if (!authToken) {
    if (isRequired)
      handleAuthFailed(resp);

    return false;
  }

  // User has a token

  dbConnect(); // Initiate db connection while token is being decoded

  let authUserFromToken;
  
  try {
    authUserFromToken = verifyAccessToken(authToken);
  }
  catch(e) {
    if (isRequired)
      handleAuthFailed(resp);
      
    return false;
  }
  
  // Token is valid
  // console.log({ authUserFromToken })

  try {
    return await User.findOne({ email: authUserFromToken.email })
  }
  catch(e) {
    // Not found in db (or db error)
    if (isRequired)
      handleAuthFailed(resp);

    return false;
  }
};

function handleAuthFailed(resp) {
  resp.status(401).json({ message: 'Not logged in' });
}