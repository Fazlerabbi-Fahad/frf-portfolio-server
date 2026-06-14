import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccess(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl,
  });
}

export function signRefresh(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshTtl,
  });
}

export function verifyAccess(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefresh(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}
