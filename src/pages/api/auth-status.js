import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { getAuthUser } from '../../middleware/auth'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET']))
    return;

  const authUser = await getAuthUser(req, resp);

  if (!authUser)
    return resp.json({ message: 'Not logged in' });

  return resp.json({ data: { user: authUser } });
};