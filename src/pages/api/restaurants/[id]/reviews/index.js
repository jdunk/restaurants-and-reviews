import { allowedMethodsCheck } from '../../../../../middleware/allowed-methods';
import { requireAuthUser } from '../../../../../middleware/auth';

import Restaurant from '../../../../../models/Restaurant';
import { getRestaurantById, calculateMetadata } from '../../../../../services/RestaurantService';
import Review from '../../../../../models/Review';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  if (authUser.role !== 'regular')
    return resp.status(403).end();

  const { id } = req.query;
  const { rating, body } = req.body;

  const review = new Review({
    author: authUser._id,
    rating,
    body,
  });

  if (!id)
    return res.status(422).end('restaurant id missing from URL');

  try {
    const resto = await getRestaurantById(id);

    if (!resto)
      return resp.status(404).end();

    const modelValidationErr = review.validateSync();

    let additionalErrors = [];

    // Additional error checks here

    if (modelValidationErr || additionalErrors.length) {
      return resp.status(422).json({
        error: {
          message: "Error in form.",
          errors: [
            ...Object.keys(modelValidationErr?.errors || {}).map(k => ([k, modelValidationErr.errors[k].message])),
            ...additionalErrors
          ]
        }
      });
    }

    // Request is valid. Save review and update metadata.

    const { avgRating, numReviews } = calculateMetadata([...resto.reviews, review]);

    const dbRes = await Restaurant.updateOne(
      { _id: resto._id }, 
      {
        $push: { reviews: review },
        $set: {
          avgRating,
          numReviews,
        }
      }
    );

    if (dbRes.n !== 1)
      throw new Error('db error occurred when trying to to save review.');

    return resp.status(201).json({
      data: {
        ...review.toObject(),
        author: {
          _id: authUser.id,
          name: authUser.name,
        },
        restaurant: {
          avgRating,
          numReviews,
        },
      },
    });
  }
  catch(e) {
    return resp.status(500).end(e.message);
  }
};