import { allowedMethodsCheck } from '../../middleware/allowed-methods'
import { useAuth } from '../../middleware/auth'
import { dbConnect } from '../../utils/server/db'
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
  const { email, name, password, accountType } = body;

  const user = new User({
    email,
    name,
    password,
  });

  let additionalErrors = [];

  // Only allow 'regular' or 'owner' types to be created via the web
  if (['regular','owner'].includes(accountType)) {
    user.role = accountType;
  }
  else if (!accountType) {
    additionalErrors.push(['accountType', 'Account type is required']);
  }
  else {
    additionalErrors.push(['accountType', 'Invalid account type']);
  }

  const modelValidationErr = user.validateSync();

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
      return resp.status(422).json({
        error: {
          errors: [
            ['email', 'Email unavailable'],
          ]
        }
      });
    }

    return resp.status(500).end(err.message)
  }

  try {
    const userFromDb = await User.findOne({ email: user.email });

    setAuthCookie(userFromDb);

    return resp.status(200).json({
      data: {
        user: userFromDb
      }
    });
  }
  catch (error) {
    resp.status(204).end();
  }
};
