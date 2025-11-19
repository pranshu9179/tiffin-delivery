// models/notification.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM(
        "subscription_expiry",
        "payment_reminder",
        "delivery_update",
        "skip_approval",
        "general"
      ),
      allowNull: false,
    },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    metadata: { type: DataTypes.JSON }, // Additional data like subscription_id, payment_id etc.
  },
  { sequelize, modelName: "notification", tableName: "notifications" }
);

module.exports = Notification;
