const indexR = require("./index");
const usersR = require("./users");
const categoriesR = require("./categories");
const productsR = require("./products");
const dringksR = require("./drinks");

const uploadsR = require("./uploads");


exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",categoriesR);
  app.use("/products",productsR);
  app.use("/drinks", dringksR); // Corrected from "/drink" to "/drinks"
  app.use("/uploads",uploadsR);

}