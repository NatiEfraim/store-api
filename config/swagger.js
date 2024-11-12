// swaggerConfig.js
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0", // Specify OpenAPI version
  info: {
    title: "Node.js API Documentation", // Title of the documentation
    version: "1.0.0", // Version of your API
    description: "API documentation for the Node.js application", // Short description
  },
  servers: [
    {
      url: "http://localhost:3003", // Replace with your server's base URL
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API routes for Swagger to document
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
