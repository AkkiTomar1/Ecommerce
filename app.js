require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { swaggerUi, swaggerSpec } = require('./swagger');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
  createDefaultAdmin(); // Hardcoded admin create
})
.catch(err => console.log('MongoDB connection error:', err.message));

// Hardcoded Admin
async function createDefaultAdmin() {
  try {
    const adminEmail = 'admin@eshop.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      const admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Default admin created!');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.log('Error creating default admin:', error.message);
  }
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
