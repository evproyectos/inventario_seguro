const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventario Seguro API',
      version: '1.0.0',
      description: 'API REST para el sistema de inventario seguro. Autenticación mediante JWT en cookie HttpOnly.',
    },
    servers: [{ url: '/api', description: 'Servidor principal' }],
    components: {
      schemas: {
        Producto: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            codigo:      { type: 'string',  example: 'PROD001' },
            nombre:      { type: 'string',  example: 'Laptop Dell' },
            descripcion: { type: 'string',  example: 'Laptop Dell Inspiron 15' },
            cantidad:    { type: 'integer', example: 10 },
            precio:      { type: 'number',  example: 999.99 },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id:       { type: 'integer', example: 1 },
            username: { type: 'string',  example: 'superadmin' },
            email:    { type: 'string',  example: 'admin@sistema.com' },
            role_id:  { type: 'integer', example: 1 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensaje de error' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);