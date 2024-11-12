const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const { UserModel, validateUser,validateLogin } = require("../models/userModel");

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {

  try {

    const validBody = validateUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }

    const user = new UserModel(req.body);
    // Hash the password before saving
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // Mask the password in the response
    user.password = "*****";
    res.status(201).json(user);

  } catch (err) {

    console.error("error from createUser function:", err.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response

  }
};


/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const decodeToken = async (req, res) => {

  try {

    res.json(req.tokenData);

  } catch (err) {

    console.error("error from decodeToken function:", err.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response

  }
};

/**
 * log in exist user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const loginUser = async (req, res) => {
    
    try {


      const validBody = validateLogin(req.body);
  
      
      if (validBody.error) {
        return res.status(400).json(validBody.error.details);
      }


      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ err: "Invalid email or password" });
      }
  
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ err: "Invalid email or password" });
      }
      
      const token = jwt.sign({ _id: user._id, role: user.role }, config.TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("access_token", token, {
        httpOnly: true, // Prevent access via JavaScript
        secure: false, // Set to true if using HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      res.json({ msg: "Login successful", token });
    } catch (err) {
      console.error("error from login function:", err.message);
      res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response

    }
  };


  /**
 * Retrecived all users records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const getUsersList = async (req, res) => {

  try {

    const data = await UserModel.find({}, { password: 0 }); // Exclude password field
    res.json(data);
  } catch (err) {
    console.error("Error from getUsersList function:", err.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response
  }
};

  /**
 * Retrecived user data by id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const fetchUserInfo = async (req, res) => {

    try {

      const user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
      res.json(user).status(200);
  
    }
    catch (err) {
  
      console.error("error from fetchUserInfo function:", err.message);
      
      res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response
    }
};
  

module.exports = {
  createUser,
  loginUser,
  getUsersList,
  fetchUserInfo,
  decodeToken,
};