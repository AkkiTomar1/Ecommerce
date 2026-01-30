require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const { swaggerUi, swaggerSpec } = require('./swagger');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const User = require('./models/User'); // Mongo User

// ✅ PostgreSQL (Sequelize)
const sequelize = require('./config/dbPg');

const app = express();
app.use(cors());
app.use(express.json());


// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB Connected');
  await createDefaultAdmin(); // Hardcoded admin create
})
.catch(err => console.log('MongoDB connection error:', err.message));


// ================= POSTGRESQL =================

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected');
  })
  .catch(err => console.log('PostgreSQL Error:', err.message));


  sequelize.sync()
  .then(() => console.log('PostgreSQL Tables Synced'))
  .catch(err => console.log('PG Sync Error:', err));

// ================= HARD CODED ADMIN =================
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


// ================= ROUTES =================
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// ================= SWAGGER =================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
