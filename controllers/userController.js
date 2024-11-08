const bcrypt = require("bcrypt");
const { UserModel, validateUser } = require("../models/userModel");

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    // Hash the password before saving
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // Mask the password in the response
    user.password = "*****";
    res.status(201).json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res.status(401).json({ err: "Email already in system", code: 11000 });
    }
    console.log(err);
    res.status(502).json({ err });
  }
};

module.exports = {
  createUser,
};