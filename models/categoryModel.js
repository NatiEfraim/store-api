const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  url_name: String,
  info: String,
  img_url: String,
},{timestamps:true})

const CategoryModel = mongoose.model("categories", schema)

/**
 * Validate category data for creating a new category on storage
 * @param {Object} data - The drink data to validate
 * @returns {Object} - The validation result
 */

const validateCategory = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(400).required(),
    url_name: Joi.string().min(2).max(400).required(),
    info: Joi.string().min(2).max(400).required(),
    img_url: Joi.string().min(2).max(400).allow(null, ""),
  })
  return joiSchema.validate(_reqBody)
}

/**
 * Validate category data for editing an existing category
 * @param {Object} data - The category data to validate
 * @returns {Object} - The validation result
 */
const validateEditCategory = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(400).optional(), 
    url_name: Joi.string().min(2).max(400).optional(), 
    info: Joi.string().min(2).max(400).optional(), 
    img_url: Joi.string().min(2).max(400).allow(null, "").optional(), 
  });
  
  return joiSchema.validate(_reqBody);
};

module.exports = {
  CategoryModel,
  validateCategory,
  validateEditCategory,
};

