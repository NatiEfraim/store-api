const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { config } = require("../config/secret");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["admin", "user", "superadmin"] },
    favs_ar: { type: Array, default: [] }, // Array to store user's favorites
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Modify the toJSON transformation to exclude specific fields and format timestamps
userSchema.set("toJSON", {
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

    // Remove sensitive or unnecessary fields
    delete ret.password;
    delete ret.favs_ar;

    return ret;
  },
});

/**
 * Virtual field for a user's full info summary
 */
userSchema.virtual("info").get(function () {
  return `${this.name} (${this.role}) - ${this.email}`;
});

/**
 * Pre-save middleware to hash the password before saving
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Method to compare passwords during login
 * @param {String} inputPassword - The password provided by the user
 * @returns {Boolean} - Returns true if passwords match
 */
userSchema.methods.isValidPassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

/**
 * Method to check if the user is an admin
 * @returns {Boolean} - True if the user's role is admin
 */
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

/**
 * Static method to find users by role
 * @param {String} role - Role to search for
 * @returns {Array} - List of users with the specified role
 */
userSchema.statics.findByRole = async function (role) {
  return this.find({ role });
};

/**
 * Static method to find a user by email
 * @param {String} email - Email to search for
 * @returns {Object} - User object if found
 */
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

/**
 * Static method to count total users
 * @returns {Number} - Total number of users
 */
userSchema.statics.getTotalUsersCount = async function () {
  return this.countDocuments();
};

/**
 * Static method to delete a user by ID
 * @param {String} userId - ID of the user to delete
 * @returns {Object} - Deleted user
 */
userSchema.statics.deleteUserById = async function (userId) {
  return this.findByIdAndDelete(userId);
};

/**
 * Method to create a JWT token for a user
 * @returns {String} - JWT token
 */
userSchema.methods.createToken = function () {
  return jwt.sign({ _id: this._id, role: this.role }, config.TOKEN_SECRET, { expiresIn: "1h" });
};

/**
 * Validate user data for creating a new user
 * @param {Object} data - The user data to validate
 * @returns {Object} - The validation result
 */


const validateCreateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
    role: Joi.string().valid("admin", "user", "superadmin"),
  });
  return schema.validate(data);
};

/**
 * Validate user data for editing an existing drink
 * @param {Object} data - The User data to validate
 * @returns {Object} - The validation result
 */
const validateEditUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(150),
    email: Joi.string().min(2).max(200).email(),
    password: Joi.string().min(3).max(150),
    role: Joi.string().valid("admin", "user", "superadmin"),
  });
  return schema.validate(data);
};

/**
 * Validation schema for logging in
 */
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(2).max(200).email().required(),
    password: Joi.string().min(3).max(150).required(),
  });
  return schema.validate(data);
};

// Create the Mongoose model
const UserModel = mongoose.model("users", userSchema);

module.exports = {
  UserModel,
  validateCreateUser,
  validateEditUser,
  validateLogin,
};
