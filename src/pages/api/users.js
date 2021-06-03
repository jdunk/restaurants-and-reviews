import { allowedMethodsCheck } from '../../middleware/allowed-methods';
import { requireAuthUser } from '../../middleware/auth';
import { getAllUsers } from '../../services/UserService';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  if (authUser.role !== 'admin')
    return resp.status(403).end();

  const users = await getAllUsers();

  resp.json({
    data: users,
  });
};