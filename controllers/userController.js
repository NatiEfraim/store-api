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

/**
 * log in exist user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const loginUser = async (req, res) => {
    const validBody = validateLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ err: "Invalid email or password" });
      }
  
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ err: "Invalid email or password" });
      }
  
      const token = jwt.sign({ _id: user._id, role: user.role }, config.TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("x-api-key", token, {
        httpOnly: true, // Prevent access via JavaScript
        secure: false, // Set to true if using HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      res.json({ msg: "Login successful", token });
    } catch (err) {
      res.status(500).json({ err: "Internal server error" });
    }
  };


module.exports = {
  createUser,
  loginUser,
};