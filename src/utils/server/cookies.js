import cookie from 'cookie';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'auth_token';
const AUTH_COOKIE_MAX_AGE_SECONDS = Number(process.env.AUTH_COOKIE_MAX_AGE_SECONDS || 60*60*2);

export function setAuthCookie(resp, value, maxAge = AUTH_COOKIE_MAX_AGE_SECONDS) {
  resp.setHeader('Set-Cookie', cookie.serialize(AUTH_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
    sameSite: 'strict',
    maxAge: maxAge,
    path: '/'
  }));
}

export function getAuthToken(req) {
  return req.cookies[AUTH_COOKIE_NAME];
}
