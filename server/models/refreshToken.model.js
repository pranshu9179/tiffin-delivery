// models/refreshToken.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

class RefreshToken extends Model {}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    token_hash: {
      type: DataTypes.STRING(64), // SHA256 hash will be 64 chars
      allowNull: false,
      unique: true,
    },
    jti: {
      type: DataTypes.STRING(36), // UUID v4
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    ip_address: {
      type: DataTypes.STRING(45), // IPv6 compatible
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "refresh_token",
    tableName: "refresh_tokens",
    indexes: [
      {
        unique: true,
        fields: ["token_hash"],
      },
      {
        unique: true,
        fields: ["jti"],
      },
      {
        fields: ["user_id"],
      },
      {
        fields: ["expires_at"],
      },
    ],
  }
);

// Instance method to check if token is expired
RefreshToken.prototype.isExpired = function () {
  return this.expires_at < new Date();
};

// Static method to hash token
RefreshToken.hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

module.exports = RefreshToken;
