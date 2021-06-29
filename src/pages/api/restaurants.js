import { allowedMethodsCheck } from '../../middleware/allowed-methods';
import { requireAuthUser } from '../../middleware/auth';
import { fetchAllRestaurants, fetchOwnersRestaurants } from '../../services/RestaurantService';

import Restaurant from '../../models/Restaurant';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['GET','POST','PUT']))
    return;

  const authUser = await requireAuthUser(req, resp);
  if (!authUser) return;

  if (req.method === 'GET') {
    let restos;

    if (authUser.role === 'owner') {
      restos = await fetchOwnersRestaurants(authUser);
    }
    else {
      restos = await fetchAllRestaurants(authUser);
    }

    return resp.json({
      user: authUser,
      data: restos,
    });
  }

  // else (method is 'POST' or 'PUT')

  const { body } = req;
  const { name, id } = body;

  if (authUser.role === 'regular') {
    return res.status(403).end();
  }

  let resto;

  if (req.method === 'PUT') {
    if (!id)
      return res.status(422).end('id is required');

    resto = await Restaurant.findOne({
      _id: id,
      ...( authUser.role === 'owner' ? { ownerId: authUser._id } : {} ),
    });

    if (!resto)
      return resp.status(404).end();

    resto.name = name;
  }

  if (req.method === 'POST') {
    if (authUser.role !== 'owner') {
      return res.status(403).end();
    }

    await Restaurant.init();

    resto = new Restaurant({
      ownerId: authUser._id,
      name,
    });
  }

  const modelValidationErr = resto.validateSync();

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

  try {
    await resto.save();
  }
  catch(e) {
    return resp.status(500).end(e.message);
  }

  return resp.status( req.method === 'PUT' ? 200 : 201 ).json({
    data: resto
  });
};