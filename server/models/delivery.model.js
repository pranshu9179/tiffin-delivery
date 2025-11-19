// models/delivery.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Delivery extends Model {}

Delivery.init(
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
    delivery_boy_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    delivery_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "delivered", "skipped", "cancelled"),
      defaultValue: "pending",
    },
    delivery_time: { type: DataTypes.TIME },
    old_tiffin_collected: { type: DataTypes.BOOLEAN, defaultValue: false },
    notes: { type: DataTypes.TEXT },
  },
  { sequelize, modelName: "delivery", tableName: "deliveries" }
);

module.exports = Delivery;
