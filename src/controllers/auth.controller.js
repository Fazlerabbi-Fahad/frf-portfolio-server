import { User } from "../models/User.js";
import {
  signAccess,
  signRefresh,
  verifyRefresh,
} from "../services/token.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

const REFRESH_COOKIE = "refresh_token";
const cookieOpts = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid credentials");
  }
  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  user.refreshTokens.push(refreshToken);
  await user.save();
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts);
  res.json({
    accessToken,
    user: { id: user._id, email: user.email, name: user.name },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized("No refresh token");

  let payload;
  try {
    payload = verifyRefresh(token);
  } catch {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const user = await User.findById(payload.sub).select("+refreshTokens");
  if (!user || !user.refreshTokens.includes(token)) {
    throw ApiError.unauthorized("Refresh token reuse detected");
  }

  // rotation: drop the used token, issue a fresh pair
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  const accessToken = signAccess(user);
  const newRefresh = signRefresh(user);
  user.refreshTokens.push(newRefresh);
  await user.save();

  res.cookie(REFRESH_COOKIE, newRefresh, cookieOpts);
  res.json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    try {
      const payload = verifyRefresh(token);
      const user = await User.findById(payload.sub).select("+refreshTokens");
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
        await user.save();
      }
    } catch {
      /* ignore */
    }
  }
  res.clearCookie(REFRESH_COOKIE, { ...cookieOpts, maxAge: undefined });
  res.json({ ok: true });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw ApiError.notFound("User not found");
  res.json({ id: user._id, email: user.email, name: user.name });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, bio } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, avatar, bio },
    { new: true, runValidators: true },
  );
  if (!user) throw ApiError.notFound("User not found");
  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
  });
});
