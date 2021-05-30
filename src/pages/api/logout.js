import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { useAuth } from '../../middleware/auth'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST','GET']))
    return;

  useAuth(req, resp).unsetAuthCookie();

  return resp.status(204).end()
};
