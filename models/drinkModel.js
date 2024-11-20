const mongoose = require("mongoose");
const Joi = require("joi"); // For data validation

const drinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ml: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const DrinkModel = mongoose.model("Drink", drinkSchema);

/**
 * Validate drink data for creating a new drink
 * @param {Object} data - The drink data to validate
 * @returns {Object} - The validation result
 */
const validateCreateDrink = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().min(1).max(100).label("Name"),
    ml: Joi.string().required().label("Milliliters"),
    price: Joi.number().required().min(0).label("Price"),
  });
  return schema.validate(data);
};

/**
 * Validate drink data for editing an existing drink
 * @param {Object} data - The drink data to validate
 * @returns {Object} - The validation result
 */
const validateEditDrink = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).label("Name"),
    ml: Joi.string().label("Milliliters"),
    price: Joi.number().min(0).label("Price"),
  });
  return schema.validate(data);
};

module.exports = {
  DrinkModel,
  validateCreateDrink,
  validateEditDrink,
};



