import { allowedMethodsCheck } from '../../../middleware/allowed-methods';
import { requireAuthUser } from '../../../middleware/auth';
import { handleError } from '../../../middleware/error-handler';
import { findRestaurantBySlug, deleteRestaurant } from '../../../services/RestaurantService';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET','PUT','DELETE']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const res = await findRestaurantBySlug(id);
      return resp.status(200).json({ data: res });
    }

    if (req.method === 'DELETE') {
      if (authUser.role === 'regular')
        return resp.status(403).end();

      let res;

      if (authUser.role === 'owner')
        res = await deleteRestaurant(id, authUser._id);
      else
        res = await deleteRestaurant(id);

      if (res.n !== 1)
        return resp.status(404).end();

      return resp.status(204).end();
    }
  }
  catch(e) {
    handleError(e, resp);
  }
}