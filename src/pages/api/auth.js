import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { useAuth } from '../../middleware/auth'
import { handleError } from '../../middleware/error-handler'
import { dbConnect } from '../../utils/server/db'
import User from '../../models/User'
import bcrypt from 'bcrypt'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST']))
    return;

  try {
    dbConnect();

    const { setAuthCookie } = useAuth(req, resp);

    const { body } = req
    const { email, password } = body

    let fieldErrors = [];

    ['email','password'].forEach(fieldName => {
      const capitalizedFn = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
      if (!body[fieldName])
        fieldErrors.push([fieldName, `${capitalizedFn} is required`]);
    });

    if (fieldErrors.length) {
      return resp.status(422).json({
        error: {
          message: "Error in form.",
          errors: fieldErrors
        }
      });
    }

    const userInDb = await User.findOne({ email: req.body.email })

    if (!userInDb || !bcrypt.compareSync(password, userInDb.password)) {
      return resp.status(422).json({
        error: {
          message: 'Invalid login.'
        },
      });
    }
    
    setAuthCookie(userInDb);

    return resp.json({
      data: {
        user: {
          _id: userInDb._id,
          name: userInDb.name,
          email: userInDb.email,
          role: userInDb.role,
        }
      }
    });
  }
  catch(e) {
    handleError(e, resp);
  }
};