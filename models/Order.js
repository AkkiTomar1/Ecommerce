const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: String, required: true }, // ✅ changed

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],

  totalAmount: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
