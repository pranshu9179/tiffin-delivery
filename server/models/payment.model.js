// models/payment.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Payment extends Model {}

Payment.init(
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
    subscription_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: { model: "customer_subscriptions", key: "id" },
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: {
      type: DataTypes.ENUM("qr", "cash", "online"),
      allowNull: false,
    },
    transaction_id: { type: DataTypes.STRING },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed"),
      defaultValue: "pending",
    },
    payment_date: { type: DataTypes.DATE },
    qr_reference: { type: DataTypes.STRING }, // For QR code payments
  },
  { sequelize, modelName: "payment", tableName: "payments" }
);

module.exports = Payment;
