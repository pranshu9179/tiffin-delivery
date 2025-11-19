// models/colony.model.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class Colony extends Model {}

Colony.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    area: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "colony", tableName: "colonies" }
);

module.exports = Colony;
