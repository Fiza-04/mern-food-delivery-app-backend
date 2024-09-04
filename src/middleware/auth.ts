import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
// jsonwebtoken -- gives a bunch of tools to parse and decode an access token
import jwt from "jsonwebtoken";
import User from "../modals/user.modal";

// TypeScript is a superset of JavaScript that adds type safety to your code.
//allows you to add custom properties to the Request object so that TypeScript is aware of them and can provide type safety
declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

//  checks the access token that is displayes in the frontend for authentication
// from Auth0 from okta start
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});
// from Auth0 from okta end

// parses auth0Id from the access token
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get the authorization token we passed in the header in the frontend
  const { authorization } = req.headers;

  // check if it has the access token or not
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  // authorization ="Bearer wkjrwkehr23uh423uh"
  const token = authorization.split(" ")[1];

  try {
    {
      /* jwt.JwtPayload is a TypeScript type or interface provided by the jsonwebtoken library.
         It typically represents the payload part of the JWT, which is the body of the token containing claims (key-value pairs).*/
    }

    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    // if no user found --> send unauthorized error
    if (!user) {
      return res.sendStatus(401);
    }

    // error came on auth0Id and userId coz I'm trying to add custom properties to the request which typescript doesnt understand
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
