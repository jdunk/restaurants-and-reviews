import { allowedMethodsCheck } from '../../utils/middleware'
import { dbConnect } from '../../utils/db'
import User from '../../models/User'

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST','GET']))
    return;

  dbConnect();

  return resp.end(`Hi, I'm a test`);
};