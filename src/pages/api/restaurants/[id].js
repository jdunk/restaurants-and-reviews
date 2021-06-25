import { allowedMethodsCheck } from '../../../middleware/allowed-methods';
import { requireAuthUser } from '../../../middleware/auth';
import { handleError } from '../../../middleware/error-handler';
import { deleteRestaurant } from '../../../services/RestaurantService';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['PUT', 'DELETE']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      const res = await deleteRestaurant(id);
    }

    return resp.status(204).end();
  }
  catch(e) {
    handleError(e, resp);
  }
}