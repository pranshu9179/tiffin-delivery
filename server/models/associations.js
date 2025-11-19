// models/associations.js
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

// User Associations
User.hasMany(RefreshToken, {
  foreignKey: "user_id",
  as: "userRefreshTokens",
});

User.hasMany(CustomerSubscription, {
  foreignKey: "customer_id",
  as: "customerSubscriptions",
});

User.hasMany(DeliveryAssignment, {
  foreignKey: "delivery_boy_id",
  as: "deliveryBoyAssignments",
});

User.hasMany(Delivery, {
  foreignKey: "delivery_boy_id",
  as: "deliveryBoyDeliveries",
});

User.hasMany(Payment, {
  foreignKey: "customer_id",
  as: "customerPayments",
});

User.hasMany(SkipRequest, {
  foreignKey: "approved_by",
  as: "approvedSkipRequests",
});

User.hasMany(Notification, {
  foreignKey: "user_id",
  as: "userNotifications",
});

// RefreshToken Associations
RefreshToken.belongsTo(User, {
  foreignKey: "user_id",
  as: "refreshTokenUser", // Changed from tokenUser to refreshTokenUser
});

// CustomerSubscription Associations
CustomerSubscription.belongsTo(User, {
  foreignKey: "customer_id",
  as: "subscriptionCustomer",
});

CustomerSubscription.belongsTo(SubscriptionPlan, {
  foreignKey: "subscription_plan_id",
  as: "subscriptionPlan",
});

CustomerSubscription.hasMany(Delivery, {
  foreignKey: "customer_subscription_id",
  as: "subscriptionDeliveries",
});

CustomerSubscription.hasMany(Payment, {
  foreignKey: "subscription_id",
  as: "subscriptionPayments",
});

CustomerSubscription.hasMany(SkipRequest, {
  foreignKey: "customer_subscription_id",
  as: "subscriptionSkipRequests",
});

// DeliveryAssignment Associations
DeliveryAssignment.belongsTo(User, {
  foreignKey: "delivery_boy_id",
  as: "assignmentDeliveryBoy",
});

DeliveryAssignment.belongsTo(Colony, {
  foreignKey: "colony_id",
  as: "assignmentColony",
});

// Delivery Associations
Delivery.belongsTo(CustomerSubscription, {
  foreignKey: "customer_subscription_id",
  as: "deliverySubscription",
});

Delivery.belongsTo(User, {
  foreignKey: "delivery_boy_id",
  as: "deliveryBoy",
});

// Payment Associations
Payment.belongsTo(User, {
  foreignKey: "customer_id",
  as: "paymentCustomer",
});

Payment.belongsTo(CustomerSubscription, {
  foreignKey: "subscription_id",
  as: "paymentSubscription",
});

// SkipRequest Associations
SkipRequest.belongsTo(CustomerSubscription, {
  foreignKey: "customer_subscription_id",
  as: "skipRequestSubscription",
});

SkipRequest.belongsTo(User, {
  foreignKey: "approved_by",
  as: "skipRequestApprover",
});

// Notification Associations
Notification.belongsTo(User, {
  foreignKey: "user_id",
  as: "notificationUser",
});

// SubscriptionPlan Associations
SubscriptionPlan.hasMany(CustomerSubscription, {
  foreignKey: "subscription_plan_id",
  as: "planSubscriptions",
});

// Colony Associations
Colony.hasMany(DeliveryAssignment, {
  foreignKey: "colony_id",
  as: "colonyAssignments",
});

module.exports = {
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
