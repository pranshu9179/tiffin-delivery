// models/deliveryAssignment.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class DeliveryAssignment extends Model {}

DeliveryAssignment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    delivery_boy_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    colony_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "colonies", key: "id" },
    },
    assigned_date: { type: DataTypes.DATE, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "delivery_assignment",
    tableName: "delivery_assignments",
  }
);

module.exports = DeliveryAssignment;
