const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { UserModel,validateLogin } = require("../models/userModel");

/**
 * log in exist user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const loginUser = async (req, res) => {
    
    try {



      const validBody = validateLogin(req.body);
  
      
       // If validation fails
       if (validBody.error) {

        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: validBody.error.message });
      }


      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {

        return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: ReasonPhrases.UNAUTHORIZED });
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
      .status(StatusCodes.OK)
      .json({ msg: ReasonPhrases.OK });
    } catch (err) {
      console.error("Error from login function:", err.message);
      res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR }); // Handle error with a proper response

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
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };



  module.exports = {
    loginUser,
    logoutUser,
  };