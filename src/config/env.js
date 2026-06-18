import dotenv from "dotenv";
dotenv.config();

function required(key) {
  const v = process.env[key];
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: required("MONGO_URI"),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET"),
    refreshSecret: required("JWT_REFRESH_SECRET"),
    accessTtl: process.env.JWT_ACCESS_TTL || "15m",
    refreshTtl: process.env.JWT_REFRESH_TTL || "7d",
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  resendApiKey: process.env.RESEND_API_KEY,
  contactToEmail: process.env.CONTACT_TO_EMAIL,
};
