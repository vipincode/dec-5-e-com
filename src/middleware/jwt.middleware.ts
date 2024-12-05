import { expressjwt, Request as JwtRequest } from 'express-jwt';
import { RequestHandler } from 'express';

function authJwt(): RequestHandler {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL as string;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const middleware = expressjwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: void isRevoked,
  }).unless({
    // This all are public api

    // /\/api\/v1\/product(.*)/ this find all after product/feature..etc
    path: [
      { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/login`,
      `${api}/register`,
    ],
    // path: [{ url: `${api}/product`, methods: ['GET', 'OPTIONS'] }, `${api}/login`, `${api}/register`],
  });

  return ((req, res, next) => {
    middleware(req, res, next).catch(next);
  }) as RequestHandler;
}

// async function isRevoked(req: JwtRequest, payload: any, done: any) {
//   if (!payload.isAdmin) {
//     done(null, true);
//   }
//   done();
// }

async function isRevoked(
  req: JwtRequest,
  payload: { isAdmin: boolean },
  done: (err: any, revoked?: boolean) => void,
): Promise<void> {
  try {
    if (!payload?.isAdmin) {
      return done(null, true); // Revoke if user is not an admin
    }
    done(null, false); // Allow access if user is an admin
  } catch (error) {
    done(error); // Handle unexpected errors
  }
}

export default authJwt;

// order
