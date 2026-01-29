const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) return res.status(400).json({ message: 'Products required' });

    // Validate stock and deduct
    for (const item of products) {
      const prod = await Product.findById(item.productId);
      if (!prod) return res.status(404).json({ message: `Product ${item.productId} not found` });
      if (prod.stock < item.quantity) return res.status(400).json({ message: `Not enough stock for ${prod.name}` });
      prod.stock -= item.quantity;
      await prod.save();
    }

    const totalAmount = products.reduce((sum, item) => sum + item.quantity * 1, 0); // optional: multiply by product.price
    const order = new Order({ user: req.user.id, products, totalAmount });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.productId', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
