import * as dotenv from "dotenv";
import {auth} from "express-oauth2-jwt-bearer";
import { Request } from "express";

dotenv.config();

export const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
});

export function getUserId(req: Request) {
  return req.auth?.payload.sub;
}
