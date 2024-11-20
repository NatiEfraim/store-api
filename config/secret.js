require("dotenv").config();

console.log(process.env.USER_DB);

exports.config = {
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  DB_NAME: process.env.DB_NAME,
  USER_DB: process.env.USER_DB || "", // Default to empty string if not provided
  PASS_DB: process.env.PASS_DB || ""  // Default to empty string if not provided
};

