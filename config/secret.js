require("dotenv").config();

console.log(process.env.USER_DB);

exports.config = {
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT,
  DB_NAME: process.env.DB_NAME,
  USER_DB: process.env.USER_DB || "", // Default to empty string if not provided
  PASS_DB: process.env.PASS_DB || ""  // Default to empty string if not provided
};


// require("dotenv").config();

// console.log(process.env.USER_DB);
// exports.config = {
//   PASS_DB:process.env.PASS_DB,
//   USER_DB:process.env.USER_DB,
//   TOKEN_SECRET:process.env.TOKEN_SECRET,
//   MONGO_DB:process.env.MONGO_DB,
//   CLOUD_NAME:"dccoiwwxy",
//   CLOUD_KEY:"664974667326928",
//   CLOUD_SECRET:"dZhz2yfM5I8k9OB60HO9zVprjpI"
  
// }