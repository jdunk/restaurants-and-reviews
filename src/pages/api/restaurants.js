import { allowedMethodsCheck } from '../../middleware/allowed-methods';
import { requireAuthUser } from '../../middleware/auth';
import { getRestaurantsForUser } from '../../services/RestaurantService';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  const restos = await getRestaurantsForUser(authUser);

  resp.json({
    user: authUser,
    data: restos,
  });
};