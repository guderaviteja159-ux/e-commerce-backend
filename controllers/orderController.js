const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");


// ==========================================
// TASK 1: CREATE ORDER FROM CART
// POST /order/create
// ==========================================

const createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        // Check user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get user's cart
        const cartItems = await Cart.find({
            userId: userId
        });

        // Check cart
        if (cartItems.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        // Check every cart item
        for (const item of cartItems) {

            const product = await Product.findById(item.productId);

            // Check product
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            // Check product status
            if (product.status !== "active") {
                return res.status(400).json({
                    message: `${product.name} is not active`
                });
            }

            // Check stock
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            // Calculate item total
            const itemTotal = item.quantity * product.price;

            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });

            // Add to total
            totalAmount += itemTotal;
        }

        // Create order
        const order = new Order({
            userId: userId,
            items: orderItems,
            totalAmount: totalAmount,
            status: "pending",
            shippingAddress: shippingAddress
        });

        await order.save();

        // Reduce product stock
        for (const item of cartItems) {

            const product = await Product.findById(item.productId);

            product.stock -= item.quantity;

            await product.save();
        }

        // Clear cart
        await Cart.deleteMany({
            userId: userId
        });

        // Send response
        res.status(201).json({
            message: "Order created successfully",
            order: order
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// TASK 2: GET USER ORDERS
// GET /order/user/:userId
// ==========================================

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Find all orders of this user
        const orders = await Order.find({
            userId: userId
        });

        res.status(200).json({
            message: "User orders fetched successfully",
            orders: orders
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// TASK 3: GET ORDER BY ID
// GET /order/:id
// ==========================================

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find order by ID
        const order = await Order.findById(id);

        // Check order
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order fetched successfully",
            order: order
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// TASK 4: UPDATE ORDER STATUS
// PUT /order/:id/status
// ==========================================

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Allowed statuses
        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled"
        ];

        // Check status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Update status
        order.status = status;

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order: order
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// TASK 5: CANCEL ORDER
// PUT /order/:id/cancel
// ==========================================

const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Only pending or confirmed orders can be cancelled
        if (
            order.status !== "pending" &&
            order.status !== "confirmed"
        ) {
            return res.status(400).json({
                message: "Order cannot be cancelled"
            });
        }

        // Restore product stock
        for (const item of order.items) {

            const product = await Product.findById(item.productId);

            if (product) {
                product.stock += item.quantity;

                await product.save();
            }
        }

        // Change order status
        order.status = "cancelled";

        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order: order
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};
// ==========================================
// TASK 6: DELETE ORDER
// DELETE /order/:id
// ==========================================

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Only cancelled orders can be deleted
        if (order.status !== "cancelled") {
            return res.status(400).json({
                message: "Only cancelled orders can be deleted"
            });
        }

        // Delete order
        await Order.findByIdAndDelete(id);

        res.status(200).json({
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================
module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    deleteOrder
};