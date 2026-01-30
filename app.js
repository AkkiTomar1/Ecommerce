require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const { swaggerUi, swaggerSpec } = require('./swagger');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const connectMongo = require('./config/dbMongo');
const { connectPostgres } = require('./config/dbPg');

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

/* ================= DB CONNECTIONS ================= */

async function startServer() {
  await connectMongo();
  await connectPostgres();

  await createDefaultAdmin(); // business logic stays here

  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
  );
}

/* ================= DEFAULT ADMIN ================= */

async function createDefaultAdmin() {
  try {
    const adminEmail = 'admin@eshop.com';

    const existingAdmin = await User.findOne({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      console.log('Default admin created');
    } else {
      console.log('Admin already exists');
    }
  } catch (err) {
    console.error('Admin creation failed:', err.message);
  }
}

/* ================= ROUTES ================= */

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

/* ================= SWAGGER ================= */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ================= START ================= */

startServer();
