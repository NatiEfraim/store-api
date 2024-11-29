const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { UserModel,validateLogin,validateUser } = require("../models/userModel");

/**
 * log in exist user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const loginUser = async (req, res) => {
    
  
  
  try {

      const {error} = validateLogin(req.body);
      
       // If validation fails
       if (error) {

        return res
        .json({ msg:  error.message })
        .status(StatusCodes.UNPROCESSABLE_ENTITY);
      }


      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {

        return res
        .json({ msg: ReasonPhrases.UNAUTHORIZED })
        .status(StatusCodes.UNAUTHORIZED);
      }
  
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      if (!isValidPassword) {
        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: ReasonPhrases.UNAUTHORIZED });

      }
      
      const token = jwt.sign({ _id: user._id, role: user.role }, config.TOKEN_SECRET, { expiresIn: "1h" });
      res.cookie("access_token", token, {
        httpOnly: true, // Prevent access via JavaScript
        secure: false, // Set to true if using HTTPS
        maxAge: 60 * 60 * 1000, // 1 hour
      });
  
      res
      .json({ msg: ReasonPhrases.OK })
      .status(StatusCodes.OK);
    } catch (err) {
      console.error("Error from login function:", err.message);
      res
      .json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR }) 
      .status(StatusCodes.INTERNAL_SERVER_ERROR);

    }
  };


/**
 * Signup a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signUpUser = async (req, res) => {
  
  try {


    const { error } = validateUser(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.details[0].message });
    }
  
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();
    res.status(StatusCodes.CREATED).json({ message: "User created successfully" });
  } catch (err) {
    console.log("Error from authController signUpUser function: ", err.message);
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
};

  /**
 * Log out the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logoutUser = (req, res) => {
    try {
      // Clear the access token cookie
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
      });
  
      res.json({ msg: "Logout successful" });
    } catch (err) {
      console.error("Error from logout function:", err.message);
      res.json({ msg: "Internal Server Error" }).status(500);
    }
  };



  module.exports = {
    loginUser,
    logoutUser,
    signUpUser,
  };