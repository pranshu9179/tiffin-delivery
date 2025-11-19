// models/customerSubscription.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class CustomerSubscription extends Model {}

CustomerSubscription.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    subscription_plan_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "subscription_plans", key: "id" },
    },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
    used_skip_days: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM("active", "expired", "cancelled"),
      defaultValue: "active",
    },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paid_amount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  },
  {
    sequelize,
    modelName: "customer_subscription",
    tableName: "customer_subscriptions",
  }
);

module.exports = CustomerSubscription;
