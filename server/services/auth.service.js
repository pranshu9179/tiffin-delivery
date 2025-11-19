// services/auth.service.js
const bcrypt = require("bcrypt");
const { User, RefreshToken } = require("../models");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  getJtiFromToken,
} = require("../utils/jwt");
const ApiError = require("../utils/apiError");

class AuthService {
  async register({ name, email, password, role = "customer" }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        is_email_verified: role === "admin" ? true : false,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password, ip }) {
    try {
      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new ApiError(401, "Invalid credentials");
      }

      // Check if user is active
      if (!user.is_active) {
        throw new ApiError(401, "Account is deactivated");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
      }

      // Generate tokens
      const accessToken = signAccessToken({
        sub: user.id,
        role: user.role,
      });

      const { token: refreshToken, jti } = signRefreshToken({
        sub: user.id,
        role: user.role,
      });

      // Hash the refresh token for storage
      const tokenHash = RefreshToken.hashToken(refreshToken);

      // Store refresh token
      await RefreshToken.create({
        token_hash: tokenHash,
        jti: jti,
        user_id: user.id,
        ip_address: ip,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new ApiError(401, "Login failed");
    }
  }

  async rotateRefresh({ providedRefreshToken, ip }) {
    try {
      // Verify refresh token
      const payload = verifyToken(providedRefreshToken);

      // Hash the provided token to find in database
      const tokenHash = RefreshToken.hashToken(providedRefreshToken);

      // Find token in database
      const storedToken = await RefreshToken.findOne({
        where: {
          token_hash: tokenHash,
          user_id: payload.sub,
          is_revoked: false,
        },
        include: [
          { model: User, as: "refreshTokenUser", attributes: ["id", "role"] },
        ], // Updated alias
      });

      if (!storedToken) {
        throw new ApiError(401, "Refresh token not found");
      }

      if (storedToken.expires_at < new Date()) {
        throw new ApiError(401, "Refresh token expired");
      }

      // Revoke the old token
      await storedToken.update({ is_revoked: true });

      // Generate new tokens
      const accessToken = signAccessToken({
        sub: payload.sub,
        role: payload.role,
      });

      const { token: newRefreshToken, jti: newJti } = signRefreshToken({
        sub: payload.sub,
        role: payload.role,
      });

      // Hash the new refresh token
      const newTokenHash = RefreshToken.hashToken(newRefreshToken);

      // Store new refresh token
      await RefreshToken.create({
        token_hash: newTokenHash,
        jti: newJti,
        user_id: payload.sub,
        ip_address: ip,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new ApiError(401, "Invalid refresh token");
    }
  }

  async logout({ providedRefreshToken }) {
    try {
      if (!providedRefreshToken) {
        return; // Nothing to logout
      }

      // Hash the token to find in database
      const tokenHash = RefreshToken.hashToken(providedRefreshToken);

      // Revoke the token
      await RefreshToken.update(
        { is_revoked: true },
        { where: { token_hash: tokenHash } }
      );
    } catch (error) {
      // Ignore errors during logout (token might already be invalid)
      console.error("Logout error:", error.message);
    }
  }

  // Optional: Clean up expired tokens
  async cleanupExpiredTokens() {
    try {
      const result = await RefreshToken.destroy({
        where: {
          expires_at: {
            [Op.lt]: new Date(),
          },
        },
      });
      console.log(`Cleaned up ${result} expired refresh tokens`);
      return result;
    } catch (error) {
      console.error("Token cleanup error:", error);
    }
  }
}

module.exports = new AuthService();
