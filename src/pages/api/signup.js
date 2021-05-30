import { allowedMethodsCheck } from '../../utils/middleware'
import { useAuth } from '../../hooks/auth'
import { dbConnect } from '../../utils/db'
import User from '../../models/User'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST']))
    return;

  dbConnect();

  const { setAuthCookie } = useAuth(req, resp);

  /*
  const users = [
    new User({
      email: 'reggie@tldmissing',
      name: 'Reggie Regular',
      role: 'regular',
    }),
    new User({
      name: 'Regina Regalo',
      role: 'regular',
    }),
    new User({
      name: 'Owen Owner',
      role: 'owner',
    }),
    new User({
      name: 'Omer O\'Malley',
      role: 'owner',
    }),
  ];
  */

  await User.init();

  const { body } = req;
  const { email, name, password } = body;

  const user = new User({
    email,
    name,
    password,
  });

  const err = user.validateSync();

  if (err) {
    return resp.status(400).json({
      error: {
        message: "Invalid input",
        errors: Object.keys(err.errors).map(k => ({[k]: err.errors[k].message}))
      }
    });
  }

  try {
    await user.save()
    // console.log({ saved: user });
  }
  catch(err) {
    // console.log({ didntSave: user });

    if (err.errors) {
      return resp.status(500).end(err.errors)
    }

    if (
      err.message.indexOf('duplicate key error') !== -1 
      && err.message.indexOf('email') !== -1
    ) {
      return resp.status(400).json({
        error: {
          errors: {
            'email': 'Email unavailable'
          }
        }
      });
    }

    return resp.status(500).end(err.message)
  }

  // Set auth cookie
  setAuthCookie(user.email);

  try {
    const userFromDb = await User.findOne({ email: user.email });

    return resp.status(200).json({
      data: userFromDb
    });
  }
  catch (error) {
    resp.status(204).end();
  }
};
