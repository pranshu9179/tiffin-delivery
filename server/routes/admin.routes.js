// routes/admin.routes.js
const express = require("express");
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const validate = require("../middlewares/validate.middleware");
const Joi = require("joi");

const {
  userManagement,
  subscriptionManagement,
  deliveryManagement,
  paymentManagement,
  deliveryBoyManagement,
  reportsManagement,
  notificationManagement,
  masterSettings,
} = require("../controllers/admin.controller");

const router = express.Router();

// Validation Schemas - Define them FIRST
const userSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string(),
    address: Joi.string(),
    role: Joi.string().valid("customer", "delivery_boy").required(),
  }),
});

const userUpdateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.string(),
    is_active: Joi.boolean(),
  }),
});

const subscriptionSchema = Joi.object({
  body: Joi.object({
    customer_id: Joi.number().required(),
    subscription_plan_id: Joi.number().required(),
    start_date: Joi.date().required(),
  }),
});
const subscriptionPlanSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    duration_days: Joi.number().required(),
    skip_days: Joi.number().required(),
    price: Joi.number().required(),
    description: Joi.string(),
    is_active: Joi.boolean(),
  }),
});

const subscriptionPlanUpdateSchema = Joi.object({
  body: Joi.object({
    name: Joi.string(),
    duration_days: Joi.number(),
    skip_days: Joi.number(),
    price: Joi.number(),
    description: Joi.string(),
    is_active: Joi.boolean(),
  }),
});
const assignmentSchema = Joi.object({
  body: Joi.object({
    delivery_boy_id: Joi.number().required(),
    colony_id: Joi.number().required(),
  }),
});

const notificationSchema = Joi.object({
  body: Joi.object({
    user_id: Joi.number(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string()
      .valid(
        "subscription_expiry",
        "payment_reminder",
        "delivery_update",
        "skip_approval",
        "general"
      )
      .required(),
  }),
});

const settingsSchema = Joi.object({
  body: Joi.object({
    default_skip_limit: Joi.number(),
    subscription_pricing: Joi.object(),
    service_rules: Joi.object(),
  }),
});

// Apply auth and admin middleware to all routes
router.use(auth);
router.use(admin);

// User Management Routes
router.get("/users", userManagement.getUsers);
router.post("/users", validate(userSchema), userManagement.createUser);
router.put("/users/:id", validate(userUpdateSchema), userManagement.updateUser);
router.delete("/users/:id", userManagement.deleteUser);

router.get("/subscription-plans", subscriptionManagement.getSubscriptionPlans);
router.post(
  "/subscription-plans",
  validate(subscriptionPlanSchema),
  subscriptionManagement.createSubscriptionPlan
);
router.put(
  "/subscription-plans/:id",
  validate(subscriptionPlanUpdateSchema),
  subscriptionManagement.updateSubscriptionPlan
);
router.delete(
  "/subscription-plans/:id",
  subscriptionManagement.deleteSubscriptionPlan
);

// Subscription Management Routes
router.get("/subscriptions", subscriptionManagement.getSubscriptions);
router.post(
  "/subscriptions",
  validate(subscriptionSchema),
  subscriptionManagement.createSubscription
);
router.put(
  "/subscriptions/:id/status",
  subscriptionManagement.updateSubscriptionStatus
);

// Delivery Management Routes
router.get("/deliveries", deliveryManagement.getDeliveries);
router.get("/deliveries/today", deliveryManagement.getTodayDeliveries);
router.put("/deliveries/:id/status", deliveryManagement.updateDeliveryStatus);

// Payment Management Routes
router.get("/payments", paymentManagement.getPayments);
router.post("/payments/reminders", paymentManagement.sendPaymentReminders);

// Delivery Boy Management Routes
router.get("/delivery-boys", deliveryBoyManagement.getDeliveryBoys);
router.post(
  "/delivery-boys/assign",
  validate(assignmentSchema),
  deliveryBoyManagement.assignColony
);
router.get(
  "/delivery-boys/:id/performance",
  deliveryBoyManagement.getPerformance
);

// Reports Routes
router.get("/reports/daily-delivery", reportsManagement.dailyDeliveryReport);
router.get(
  "/reports/customer-subscriptions",
  reportsManagement.customerSubscriptionReport
);
router.get(
  "/reports/payment-collection",
  reportsManagement.paymentCollectionReport
);
router.get(
  "/reports/skipped-deliveries",
  reportsManagement.skippedDeliveriesReport
);
router.get(
  "/reports/delivery-boy-performance",
  reportsManagement.deliveryBoyPerformanceReport
);

// Notifications Routes
router.get("/notifications", notificationManagement.getNotifications);
router.post(
  "/notifications",
  validate(notificationSchema),
  notificationManagement.sendNotification
);

// Master Settings Routes
router.get("/settings", masterSettings.getSettings);
router.put(
  "/settings",
  validate(settingsSchema),
  masterSettings.updateSettings
);

module.exports = router;
