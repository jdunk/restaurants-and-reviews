import { allowedMethodsCheck } from '../../../middleware/allowed-methods';
import { requireAuthUser } from '../../../middleware/auth';
import { handleError } from '../../../middleware/error-handler';
import { deleteRestaurant } from '../../../services/RestaurantService';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['PUT', 'DELETE']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  if (authUser.role === 'regular')
    return resp.status(403).end();

  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
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