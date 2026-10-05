const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.post("/create", orderController.createOrder);

router.get("/user/:userId", orderController.getUserOrders);

router.get("/:id", orderController.getOrderById);

router.put("/:id/status", orderController.updateOrderStatus);

router.put("/:id/cancel", orderController.cancelOrder);

router.delete("/:id", orderController.deleteOrder);

module.exports = router;