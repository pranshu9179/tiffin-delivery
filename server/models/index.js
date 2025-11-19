// models/index.js
const sequelize = require("../config/db");

// Import all models
const User = require("./user.model");
const RefreshToken = require("./refreshToken.model");
const Colony = require("./colony.model");
const SubscriptionPlan = require("./subscriptionPlan.model");
const CustomerSubscription = require("./customerSubscription.model");
const DeliveryAssignment = require("./deliveryAssignment.model");
const Delivery = require("./delivery.model");
const Payment = require("./payment.model");
const SkipRequest = require("./skipRequest.model");
const Notification = require("./notification.model");

// Import associations
const associations = require("./associations");

module.exports = {
  sequelize,
  User,
  RefreshToken,
  Colony,
  SubscriptionPlan,
  CustomerSubscription,
  DeliveryAssignment,
  Delivery,
  Payment,
  SkipRequest,
  Notification,
};
