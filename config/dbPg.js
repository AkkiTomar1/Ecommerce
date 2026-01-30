const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASS,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false
  }
);

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');

    await sequelize.sync();
    console.log('PostgreSQL Tables Synced');
  } catch (err) {
    console.error('PostgreSQL Error:', err.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  connectPostgres
};
