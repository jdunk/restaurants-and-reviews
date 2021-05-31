import { allowedMethodsCheck } from '../../middleware/allowed-methods';

export default async function handler(req, resp) {
  if (!allowedMethodsCheck(req, resp, ['POST','GET']))
    return;

  return resp.end(`Hi, I'm a test`);
};