const mongoose = require("mongoose");
const Joi = require("joi");

// Define the schema for the Product collection
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    info: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category_url: {
      type: String,
      required: true,
      trim: true,
    },
    img_url: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the model from the schema
const ProductModel = mongoose.model("products", productSchema);

// Validation for creating or editing a product
const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(400).required(),
    info: Joi.string().min(2).max(1000).required(),
    price: Joi.number().min(0).required(),
    category_url: Joi.string().min(2).max(400).required(),
    img_url: Joi.string().uri().required(),
    user_id: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  ProductModel,
  validateProduct,
};





// const mongoose = require("mongoose");
// const Joi = require("joi");

// let schema = new mongoose.Schema({
//   name: String,
//   info: String,
//   price: Number,
//   category_url: String,
//   img_url: String,
//   user_id: String,
// },{timestamps:true})

// exports.ProductModel = mongoose.model("products", schema)


// //? seetings validation request

// exports.validateProduct = (_reqBody) => {
//   let joiSchema = Joi.object({
//     name: Joi.string().min(2).max(100).required(),
//     info: Joi.string().min(2).max(600).required(),
//     price: Joi.number().min(1).max(99999).required(),
//     category_url: Joi.string().min(2).max(100).required(),
//     img_url: Joi.string().min(2).max(400).allow(null,""),
//   })
//   return joiSchema.validate(_reqBody)
// }