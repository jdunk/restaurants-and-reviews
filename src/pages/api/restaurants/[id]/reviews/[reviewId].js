import { allowedMethodsCheck } from '../../../../../middleware/allowed-methods';
import { requireAuthUser } from '../../../../../middleware/auth';

import { getRestaurantById, deleteReview } from '../../../../../services/RestaurantService';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['DELETE']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  if (authUser.role === 'owner')
    return resp.status(403).end();

  const { id: restoId, reviewId } = req.query;

  if (!restoId)
    return res.status(422).end('restaurant id missing from URL');

  if (!reviewId)
    return res.status(422).end('review id missing from URL');

  try {
    const resto = await getRestaurantById(restoId);

    if (!resto)
      return resp.status(404).end();

    const review = resto.reviews.id(reviewId)

    if (
      !review || review.isDeleted ||
      (authUser.role !== 'admin' && authUser.id !== review.author.id)
    )
      return resp.status(404).end();

    const res = await deleteReview(restoId, reviewId);

    if (res.n !== 1)
      return resp.status(404).end();

    return resp.status(204).end();
  }
  catch(e) {
    return resp.status(500).end(e.message);
  }
};