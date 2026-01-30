const express = require("express");
const { protect, customer } = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const Order = require("../models/Order");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - products
 *               - totalAmount
 *             properties:
 *               user:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */

router.post("/", protect, customer, createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get order history of logged-in customer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */
router.get("/", protect, customer, getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
router.put(
  "/:id",
  protect,
  async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only admin or order owner can update
    if (req.user.role !== "admin" && order.user !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    next();
  },
  updateOrder,
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 */
router.delete("/:id", protect, deleteOrder);

module.exports = router;
