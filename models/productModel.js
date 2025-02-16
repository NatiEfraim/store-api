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


// Modify the toJSON transformation to exclude specific fields and format timestamps
productSchema.set("toJSON", {
  transform: (doc, ret) => {
    // Format createdAt and updatedAt
    if (ret.createdAt) {
      const createdAt = new Date(ret.createdAt);
      ret.createdAt = createdAt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }

    if (ret.updatedAt) {
      const updatedAt = new Date(ret.updatedAt);
      ret.updatedAt = updatedAt.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
    return ret;
  },
});


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




