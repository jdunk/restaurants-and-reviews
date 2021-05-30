export function allowedMethodsCheck(req, resp, allowedMethods) {
  resp.setHeader('Allow', allowedMethods)

  if (!allowedMethods.includes(req.method)) {
    resp.status(405).end()
    return false;
  }

  return true;
}