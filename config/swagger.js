const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation for My Project",
    },
    servers: [
      {
        url: "http://localhost:3003", // Replace with your server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
