

const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      default: "user",
    },
    favs_ar: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);
/**
 * Mongoose model for the users collection
 */

const UserModel = mongoose.model("users", userSchema);

/**
 * Create a JWT token for a user
 * @param {String} user_id - The unique ID of the user
 * @param {String} [role="user"] - The role of the user (default: "user")
 * @returns {String} - The generated JWT token
 */

const createToken = (user_id, role = "user") => {
  const token = jwt.sign({ _id: user_id, role }, config.TOKEN_SECRET, { expiresIn: "60000mins" });
  return token;
};

/**
 * Validate user data for creating a new user
 * @param {Object} _reqBody - The user data to validate
 * @returns {Object} - The validation result
 */

const validateUser = (_reqBody) => {
  const joiSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
};

/**
 * Validate login data for user authentication
 * @param {Object} _reqBody - The login data to validate
 * @returns {Object} - The validation result
 */

const validateLogin = (_reqBody) => {
  const joiSchema = Joi.object({
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
  });

  return joiSchema.validate(_reqBody);
};

module.exports = {
  UserModel,
  validateLogin,
  validateUser,
  createToken,
};
