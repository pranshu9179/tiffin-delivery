// models/subscriptionPlan.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class SubscriptionPlan extends Model {}

SubscriptionPlan.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    duration_days: { type: DataTypes.INTEGER, allowNull: false },
    skip_days: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "subscription_plan", tableName: "subscription_plans" }
);

module.exports = SubscriptionPlan;
