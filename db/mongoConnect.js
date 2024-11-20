
const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
  const dbUri = `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.DB_NAME}`;
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // // Add authentication options if credentials are provided
  // if (config.USER_DB && config.PASS_DB) {
  //   options.user = config.USER_DB;
  //   options.pass = config.PASS_DB;
  // }

  try {
    await mongoose.connect(dbUri, options);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}


