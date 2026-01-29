const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini E-Commerce API',
      version: '1.0.0',
    },
    servers: [
      { url: 'https://localhost:3000/api' }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'customer'] }
          }
        },

        Product: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            category: { type: 'string' }
          }
        },

        Order: {
          type: 'object',
          properties: {
            user: { type: 'string' },
            product: { type: 'string' },
            total: { type: 'number' },
            status: {
              type: 'string',
              enum: ['pending', 'shipped', 'delivered', 'cancelled']
            }
          }
        }
      }
    },

    security: [{ bearerAuth: [] }]
  },

  apis: ['./routes/*.js']
};


const swaggerSpec = swaggerJsdoc(options);
module.exports = { swaggerUi, swaggerSpec };
