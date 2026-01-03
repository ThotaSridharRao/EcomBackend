const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    // Associate with logged in user if available
    if (req.user) {
      orderData.user = req.user._id;
    }

    // Auto-generate Order ID if not provided
    if (!orderData.id) {
      orderData.id = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    const order = await Order.create(orderData);

    // Update Stock for each item
    // Note: Frontend sends items with 'id', which might match our backend _id or a custom id
    // We will try to find product by id and update stock
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        // Try to find product by _id (if valid mongo id) or some other identifier if we stored it
        // Assuming item.id corresponds to valid mongo _id for now as per our product creation
        if (item.id && item.id.match(/^[0-9a-fA-F]{24}$/)) {
          const product = await Product.findById(item.id);
          if (product) {
            product.stock = Math.max(0, product.stock - item.qty);
            await product.save();
          }
        }
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id }); // Using custom ID string from schema
    if (order) {
      res.json(order);
    } else {
      // Fallback to mongo _id
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        const orderByMongoId = await Order.findById(req.params.id);
        if (orderByMongoId) return res.json(orderByMongoId);
      }
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, statusColor, currentStep, timelineItem } = req.body;

    let order = await Order.findOne({ id: req.params.id });
    if (!order && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    }

    if (order) {
      order.status = status || order.status;
      order.statusColor = statusColor || order.statusColor;

      if (currentStep !== undefined) {
        order.currentStep = currentStep;
      }

      if (timelineItem) {
        // Update specific timeline item completion
        order.timeline = order.timeline.map(item =>
          item.title === timelineItem.title
            ? { ...item, completed: true, date: timelineItem.date || new Date().toLocaleString() }
            : item
        );
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
