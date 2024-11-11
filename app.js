const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { routesInit } = require("./routes/configRoutes");
require("dotenv").config(); // Ensure environment variables are loaded

const app = express();

try {
  // Connect to the MongoDB database
  require("./db/mongoConnect");
  console.log("Database connection successful");
} catch (err) {
  console.error("Database connection failed:", err.message);
  process.exit(1); // Exit the application if database connection fails
}

try {
  // Enable CORS for all incoming requests
  app.use(cors());
  console.log("CORS enabled");
} catch (err) {
  console.error("CORS initialization failed:", err.message);
}

try {
  // Enable file uploads with specified limits
  app.use(
    fileUpload({
      limits: { fileSize: "5mb" },
      useTempFiles: true,
    })
  );
  console.log("File upload middleware initialized");
} catch (err) {
  console.error("File upload middleware initialization failed:", err.message);
}

try {
  // Parse incoming JSON requests with a size limit
  app.use(express.json({ limit: "5mb" }));
  console.log("JSON body parsing middleware initialized");
} catch (err) {
  console.error(
    "JSON body parsing middleware initialization failed:",
    err.message
  );
}

try {
  // Serve static files from the "public" directory
  app.use(express.static(path.join(__dirname, "public")));
  console.log("Static files middleware initialized");
} catch (err) {
  console.error("Static files middleware initialization failed:", err.message);
}

try {
  // Initialize application routes
  routesInit(app);
  console.log("Routes initialized");
} catch (err) {
  console.error("Routes initialization failed:", err.message);
}

// Create HTTP server
const server = http.createServer(app);

try {
  const port = process.env.PORT || 3003; // Define port from environment or default
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
} catch (err) {
  console.error("Failed to start server:", err.message);
}

// const express = require("express");
// const http = require("http");
// const path = require("path");
// const cors = require("cors");
// const fileUpload = require("express-fileupload")
// const {routesInit} = require("./routes/configRoutes")
// require("./db/mongoConnect");

// const app = express();
// app.use(cors());

// app.use(fileUpload({
//   limits:{fileSize:"5mb"},
//   useTempFiles:true
// }))
// app.use(express.json({limit:"5mb"}));

// app.use(express.static(path.join(__dirname,"public")));

// routesInit(app);

// const server = http.createServer(app);

// const port = process.env.PORT || 3003;
// server.listen(port);
