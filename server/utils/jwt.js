// utils/jwt.js
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const privPath =
  process.env.JWT_PRIVATE_KEY_PATH ||
  path.join(__dirname, "../../keys/private.pem");
const pubPath =
  process.env.JWT_PUBLIC_KEY_PATH ||
  path.join(__dirname, "../../keys/public.pem");

const PRIVATE_KEY = fs.readFileSync(privPath, "utf8");
const PUBLIC_KEY = fs.readFileSync(pubPath, "utf8");

function signAccessToken(payload, options = {}) {
  const opts = {
    algorithm: "RS256",
    expiresIn: process.env.ACCESS_TOKEN_EXP || "15m",
    issuer: "cabnest",
    ...options,
  };

  // Add jti for access tokens too
  const tokenPayload = {
    ...payload,
    jti: crypto.randomUUID(),
  };

  return jwt.sign(tokenPayload, PRIVATE_KEY, opts);
}

function signRefreshToken(payload, options = {}) {
  const opts = {
    algorithm: "RS256",
    expiresIn: process.env.REFRESH_TOKEN_EXP || "7d",
    issuer: "cabnest",
    ...options,
  };

  // Generate jti for refresh token
  const jti = crypto.randomUUID();
  const tokenPayload = {
    ...payload,
    jti: jti,
    type: "refresh",
  };

  const token = jwt.sign(tokenPayload, PRIVATE_KEY, opts);

  return {
    token,
    jti,
  };
}

function verifyToken(token) {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ["RS256"],
    issuer: "cabnest",
  });
}

// Helper to extract jti from token without verification
function getJtiFromToken(token) {
  const decoded = jwt.decode(token);
  return decoded?.jti;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  getJtiFromToken,
};
