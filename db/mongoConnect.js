
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


// const mongoose = require('mongoose');
// const config = require('../config/secret');
// require("dotenv").config();




// main().catch(err => console.log(err));

// async function main() {
//   const dbUri = `mongodb://${config.HOST}:${config.PORT}/${config.DB_NAME}`;
//   // For authentication, uncomment the next line
//   // const dbUri = `mongodb://${config.USER_DB}:${config.PASS_DB}@${config.HOST}:${config.PORT}/${config.DB_NAME}`;
  
//   try {
//     await mongoose.connect(dbUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected successfully");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err.message);
//   }
// }





// const mongoose = require('mongoose');
// require("dotenv").config();

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/idf8');
//   await mongoose.connect(`mongodb+srv://${config.USER_DB}:${config.PASS_DB}@cluster0.jqikq.mongodb.net/idf8`);
//   await mongoose.connect(process.env.MONGO_DB);
//   console.log("mongo connect idf8 atlas");
//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }