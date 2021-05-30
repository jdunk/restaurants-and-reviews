import { setAuthCookie, getAuthToken } from '../utils/server/cookies';
import { generateAccessToken } from '../utils/server/auth';

export const useAuth = (req, resp) => ({
  setAuthCookie: userObj => setAuthCookie(resp, generateAccessToken(userObj)),
  unsetAuthCookie: () => setAuthCookie(resp, '', 0),
  getAuthToken: () => getAuthToken(req),
});