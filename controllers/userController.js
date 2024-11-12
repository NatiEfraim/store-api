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
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const changeRole = async (req, res) => {


  try {

    // Extract `id` from the request parameters
    const { id } = req.params;

    // Extract `role` from the request body
    const { role } = req.body;

    // Check if the role is provided in the request body
    if (!role) {
      return res.status(400).json({ err: "Role is required in the request body" });
    }

    // Check if the admin is trying to change their own role
    if (id === req.tokenData._id) {
      return res.status(401).json({ err: "You can't change your own role" });
    }

    // Validate the role parameter
    const validRoles = ["admin", "user", "superadmin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ err: "Invalid role specified" });
    }

    // Find the user by ID and update their role
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, // Find user by ID
      { role }, // Update the `role` field
      { new: true, runValidators: true } // Return the updated document and apply validations
    );

    // If the user does not exist, return a 404 error
    if (!updatedUser) {
      return res.status(404).json({ err: "User not found" });
    }

    // Send the updated user data as the response
    res.json({ msg: "Role updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error from changeUserRole function:", err.message);
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

/**
 * Controller to delete a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
  try {
    // Extract `id` from the request parameters
    const { id } = req.params;

    // Check if the admin is trying to delete their own account
    if (id === req.tokenData._id) {
      return res.status(401).json({ err: "You can't delete your own account" });
    }

    // Find the user by ID and delete them
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // If the user does not exist, return a 404 error
    if (!deletedUser) {
      return res.status(404).json({ err: "User not found" });
    }

    // Send a success message as the response
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("Error from deleteUser function:", err.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response
  }
};
  

module.exports = {
  createUser,
  loginUser,
  getUsersList,
  fetchUserInfo,
  decodeToken,
  changeRole,
  deleteUser
};