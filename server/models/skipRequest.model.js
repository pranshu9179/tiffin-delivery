// models/skipRequest.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class SkipRequest extends Model {}

SkipRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_subscription_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "customer_subscriptions", key: "id" },
    },
    skip_date: { type: DataTypes.DATEONLY, allowNull: false },
    reason: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    approved_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: { model: "users", key: "id" },
    },
  },
  { sequelize, modelName: "skip_request", tableName: "skip_requests" }
);

module.exports = SkipRequest;
