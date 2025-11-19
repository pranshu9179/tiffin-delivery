// controllers/admin.controller.js - Update all association references
const {
  User,
  Colony,
  SubscriptionPlan,
  CustomerSubscription,
  DeliveryAssignment,
  Delivery,
  Payment,
  SkipRequest,
  Notification,
} = require("../models");
const ApiError = require("../utils/apiError");
const { Op } = require("sequelize");

// User Management
exports.userManagement = {
  async getUsers(req, res, next) {
    try {
      const { role, page = 1, limit = 10 } = req.query;
      const where = {};
      if (role) where.role = role;

      const users = await User.findAndCountAll({
        where,
        attributes: { exclude: ["password"] },
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
      });

      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async createUser(req, res, next) {
    try {
      const userData = req.validated.body;
      const user = await User.create(userData);

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.validated.body;

      const user = await User.findByPk(id);
      if (!user) throw new ApiError(404, "User not found");

      await user.update(updateData);
      res.json({ message: "User updated successfully" });
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) throw new ApiError(404, "User not found");

      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};

// Subscription Management
exports.subscriptionManagement = {
  async getSubscriptions(req, res, next) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const where = {};
      if (status) where.status = status;

      const subscriptions = await CustomerSubscription.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: "subscriptionCustomer",
            attributes: ["id", "name", "email"],
          },
          {
            model: SubscriptionPlan,
            as: "subscriptionPlan",
          },
        ],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
      });

      res.json(subscriptions);
    } catch (err) {
      next(err);
    }
  },

  async createSubscription(req, res, next) {
    try {
      const { customer_id, subscription_plan_id, start_date } =
        req.validated.body;

      const plan = await SubscriptionPlan.findByPk(subscription_plan_id);
      if (!plan) throw new ApiError(404, "Subscription plan not found");

      const customer = await User.findByPk(customer_id);
      if (!customer) throw new ApiError(404, "Customer not found");

      const end_date = new Date(start_date);
      end_date.setDate(end_date.getDate() + plan.duration_days);

      const subscription = await CustomerSubscription.create({
        customer_id,
        subscription_plan_id,
        start_date,
        end_date,
        total_amount: plan.price,
        status: "active",
      });

      res.status(201).json({
        message: "Subscription created successfully",
        subscription,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateSubscriptionStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const subscription = await CustomerSubscription.findByPk(id);
      if (!subscription) throw new ApiError(404, "Subscription not found");

      await subscription.update({ status });
      res.json({ message: "Subscription status updated successfully" });
    } catch (err) {
      next(err);
    }
  },
  async getSubscriptionPlans(req, res, next) {
    try {
      const { is_active, page = 1, limit = 10 } = req.query;
      const where = {};
      if (is_active !== undefined) where.is_active = is_active === "true";

      const plans = await SubscriptionPlan.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
      });

      res.json(plans);
    } catch (err) {
      next(err);
    }
  },

  async createSubscriptionPlan(req, res, next) {
    try {
      const {
        name,
        duration_days,
        skip_days,
        price,
        description,
        is_active = true,
      } = req.validated.body;

      const plan = await SubscriptionPlan.create({
        name,
        duration_days,
        skip_days,
        price,
        description,
        is_active,
      });

      res.status(201).json({
        message: "Subscription plan created successfully",
        plan,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateSubscriptionPlan(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.validated.body;

      const plan = await SubscriptionPlan.findByPk(id);
      if (!plan) throw new ApiError(404, "Subscription plan not found");

      await plan.update(updateData);
      res.json({ message: "Subscription plan updated successfully" });
    } catch (err) {
      next(err);
    }
  },

  async deleteSubscriptionPlan(req, res, next) {
    try {
      const { id } = req.params;
      const plan = await SubscriptionPlan.findByPk(id);
      if (!plan) throw new ApiError(404, "Subscription plan not found");

      await plan.destroy();
      res.json({ message: "Subscription plan deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
};

// Delivery Management
exports.deliveryManagement = {
  async getDeliveries(req, res, next) {
    try {
      const { date, status, page = 1, limit = 10 } = req.query;
      const where = {};
      if (status) where.status = status;
      if (date) where.delivery_date = date;

      const deliveries = await Delivery.findAndCountAll({
        where,
        include: [
          {
            model: CustomerSubscription,
            as: "deliverySubscription",
            include: [
              {
                model: User,
                as: "subscriptionCustomer",
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: User,
            as: "deliveryBoy",
            attributes: ["id", "name"],
          },
        ],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["delivery_date", "DESC"]],
      });

      res.json(deliveries);
    } catch (err) {
      next(err);
    }
  },

  async getTodayDeliveries(req, res, next) {
    try {
      const today = new Date().toISOString().split("T")[0];

      const deliveries = await Delivery.findAll({
        where: { delivery_date: today },
        include: [
          {
            model: CustomerSubscription,
            as: "deliverySubscription",
            include: [
              {
                model: User,
                as: "subscriptionCustomer",
                attributes: ["id", "name", "email", "address"],
              },
            ],
          },
          {
            model: User,
            as: "deliveryBoy",
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      res.json(deliveries);
    } catch (err) {
      next(err);
    }
  },

  async updateDeliveryStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, old_tiffin_collected, notes } = req.body;

      const delivery = await Delivery.findByPk(id);
      if (!delivery) throw new ApiError(404, "Delivery not found");

      const updateData = { status };
      if (status === "delivered") {
        updateData.delivery_time = new Date();
        updateData.old_tiffin_collected = old_tiffin_collected || false;
      }
      if (notes) updateData.notes = notes;

      await delivery.update(updateData);
      res.json({ message: "Delivery status updated successfully" });
    } catch (err) {
      next(err);
    }
  },
};

// Payment Management
exports.paymentManagement = {
  async getPayments(req, res, next) {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const where = {};
      if (status) where.status = status;

      const payments = await Payment.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: "paymentCustomer",
            attributes: ["id", "name", "email"],
          },
          {
            model: CustomerSubscription,
            as: "paymentSubscription",
          },
        ],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
      });

      res.json(payments);
    } catch (err) {
      next(err);
    }
  },

  async sendPaymentReminders(req, res, next) {
    try {
      // Find customers with pending payments
      const pendingPayments = await Payment.findAll({
        where: { status: "pending" },
        include: [{ model: User, as: "paymentCustomer" }],
        group: ["customer_id"],
      });

      const notificationPromises = pendingPayments.map((payment) =>
        Notification.create({
          user_id: payment.customer_id,
          title: "Payment Reminder",
          message: "You have pending payments for your subscription.",
          type: "payment_reminder",
          metadata: { payment_id: payment.id },
        })
      );

      await Promise.all(notificationPromises);
      res.json({ message: "Payment reminders sent successfully" });
    } catch (err) {
      next(err);
    }
  },
};

// Delivery Boy Management
exports.deliveryBoyManagement = {
  async getDeliveryBoys(req, res, next) {
    try {
      const deliveryBoys = await User.findAll({
        where: { role: "delivery_boy" },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: DeliveryAssignment,
            as: "deliveryBoyAssignments",
            include: [{ model: Colony, as: "assignmentColony" }],
          },
        ],
      });

      res.json(deliveryBoys);
    } catch (err) {
      next(err);
    }
  },

  async assignColony(req, res, next) {
    try {
      const { delivery_boy_id, colony_id } = req.validated.body;

      // Check if delivery boy exists
      const deliveryBoy = await User.findByPk(delivery_boy_id);
      if (!deliveryBoy || deliveryBoy.role !== "delivery_boy") {
        throw new ApiError(404, "Delivery boy not found");
      }

      // Check if colony exists
      const colony = await Colony.findByPk(colony_id);
      if (!colony) {
        throw new ApiError(404, "Colony not found");
      }

      // Deactivate previous assignments for this colony
      await DeliveryAssignment.update(
        { is_active: false },
        { where: { colony_id, is_active: true } }
      );

      const assignment = await DeliveryAssignment.create({
        delivery_boy_id,
        colony_id,
        assigned_date: new Date(),
        is_active: true,
      });

      res.status(201).json({
        message: "Colony assigned successfully",
        assignment,
      });
    } catch (err) {
      next(err);
    }
  },

  async getPerformance(req, res, next) {
    try {
      const { id } = req.params;
      const { start_date, end_date } = req.query;

      const where = { delivery_boy_id: id };
      if (start_date && end_date) {
        where.delivery_date = { [Op.between]: [start_date, end_date] };
      }

      const deliveries = await Delivery.findAll({ where });

      const performance = {
        total_deliveries: deliveries.length,
        delivered: deliveries.filter((d) => d.status === "delivered").length,
        pending: deliveries.filter((d) => d.status === "pending").length,
        skipped: deliveries.filter((d) => d.status === "skipped").length,
        success_rate:
          deliveries.length > 0
            ? (
                (deliveries.filter((d) => d.status === "delivered").length /
                  deliveries.length) *
                100
              ).toFixed(2)
            : 0,
      };

      res.json(performance);
    } catch (err) {
      next(err);
    }
  },
};

// Reports Management
exports.reportsManagement = {
  async dailyDeliveryReport(req, res, next) {
    try {
      const { date = new Date().toISOString().split("T")[0] } = req.query;

      const deliveries = await Delivery.findAll({
        where: { delivery_date: date },
        include: [
          {
            model: CustomerSubscription,
            as: "deliverySubscription",
            include: [
              {
                model: User,
                as: "subscriptionCustomer",
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: User,
            as: "deliveryBoy",
            attributes: ["id", "name"],
          },
        ],
      });

      res.json({
        date,
        total_deliveries: deliveries.length,
        delivered: deliveries.filter((d) => d.status === "delivered").length,
        pending: deliveries.filter((d) => d.status === "pending").length,
        skipped: deliveries.filter((d) => d.status === "skipped").length,
        deliveries,
      });
    } catch (err) {
      next(err);
    }
  },

  async customerSubscriptionReport(req, res, next) {
    try {
      const subscriptions = await CustomerSubscription.findAll({
        include: [
          {
            model: User,
            as: "subscriptionCustomer",
            attributes: ["id", "name", "email"],
          },
          {
            model: SubscriptionPlan,
            as: "subscriptionPlan",
          },
        ],
        order: [["end_date", "ASC"]],
      });

      res.json(subscriptions);
    } catch (err) {
      next(err);
    }
  },

  async paymentCollectionReport(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const where = { status: "completed" };

      if (start_date && end_date) {
        where.payment_date = { [Op.between]: [start_date, end_date] };
      }

      const payments = await Payment.findAll({
        where,
        include: [
          {
            model: User,
            as: "paymentCustomer",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["payment_date", "DESC"]],
      });

      const totalCollection = payments.reduce(
        (sum, payment) => sum + parseFloat(payment.amount),
        0
      );

      res.json({
        total_collection: totalCollection,
        payment_count: payments.length,
        payments,
      });
    } catch (err) {
      next(err);
    }
  },

  async skippedDeliveriesReport(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const where = { status: "skipped" };

      if (start_date && end_date) {
        where.delivery_date = { [Op.between]: [start_date, end_date] };
      }

      const skippedDeliveries = await Delivery.findAll({
        where,
        include: [
          {
            model: CustomerSubscription,
            as: "deliverySubscription",
            include: [
              {
                model: User,
                as: "subscriptionCustomer",
                attributes: ["id", "name", "email"],
              },
            ],
          },
        ],
        order: [["delivery_date", "DESC"]],
      });

      res.json(skippedDeliveries);
    } catch (err) {
      next(err);
    }
  },

  async deliveryBoyPerformanceReport(req, res, next) {
    try {
      const { start_date, end_date } = req.query;
      const where = {};

      if (start_date && end_date) {
        where.delivery_date = { [Op.between]: [start_date, end_date] };
      }

      const deliveryBoys = await User.findAll({
        where: { role: "delivery_boy" },
        attributes: ["id", "name", "email"],
        include: [
          {
            model: Delivery,
            as: "deliveryBoyDeliveries",
            where,
            required: false,
          },
        ],
      });

      const performance = deliveryBoys.map((boy) => {
        const deliveries = boy.deliveryBoyDeliveries || [];
        return {
          id: boy.id,
          name: boy.name,
          email: boy.email,
          total_deliveries: deliveries.length,
          delivered: deliveries.filter((d) => d.status === "delivered").length,
          pending: deliveries.filter((d) => d.status === "pending").length,
          skipped: deliveries.filter((d) => d.status === "skipped").length,
          success_rate:
            deliveries.length > 0
              ? (
                  (deliveries.filter((d) => d.status === "delivered").length /
                    deliveries.length) *
                  100
                ).toFixed(2)
              : 0,
        };
      });

      res.json(performance);
    } catch (err) {
      next(err);
    }
  },
};

// Notification Management
exports.notificationManagement = {
  async getNotifications(req, res, next) {
    try {
      const { user_id, type, page = 1, limit = 10 } = req.query;
      const where = {};
      if (user_id) where.user_id = user_id;
      if (type) where.type = type;

      const notifications = await Notification.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: "notificationUser",
            attributes: ["id", "name", "email"],
          },
        ],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
        order: [["createdAt", "DESC"]],
      });

      res.json(notifications);
    } catch (err) {
      next(err);
    }
  },

  async sendNotification(req, res, next) {
    try {
      const { user_id, title, message, type } = req.validated.body;

      let users;
      if (user_id) {
        users = [await User.findByPk(user_id)];
      } else {
        // Send to all customers if no specific user
        users = await User.findAll({ where: { role: "customer" } });
      }

      const notificationPromises = users.map((user) =>
        Notification.create({
          user_id: user.id,
          title,
          message,
          type,
        })
      );

      await Promise.all(notificationPromises);
      res.json({ message: "Notification sent successfully" });
    } catch (err) {
      next(err);
    }
  },
};

// Master Settings
exports.masterSettings = {
  async getSettings(req, res, next) {
    try {
      const settings = {
        default_skip_limit: 2,
        subscription_pricing: {
          "15_day_plan": { price: 1500, skip_days: 2 },
          "30_day_plan": { price: 2800, skip_days: 5 },
        },
        service_rules: {
          delivery_time: "07:00-10:00",
          tiffin_collection: "Required after each delivery",
        },
      };

      res.json(settings);
    } catch (err) {
      next(err);
    }
  },

  async updateSettings(req, res, next) {
    try {
      const settings = req.validated.body;
      // In real app, save to database

      res.json({ message: "Settings updated successfully", settings });
    } catch (err) {
      next(err);
    }
  },
};
