
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");


  /**
 *  Middleware for authenticating users via token stored in cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const auth = (req, res, next) => {


  try {

    const token = req.cookies.access_token;

    if (!token) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "You need to send a token in the cookies" });
    }

    const decodeToken = jwt.verify(token, config.TOKEN_SECRET); // Verify token
    req.tokenData = decodeToken; 
    
    next(); 
  } catch (err) {
    console.error("Error from auth function :", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" });
  }
};


    /**
 *  Middleware for admin-only access via token stored in cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const authAdmin = (req, res, next) => {
  
  try {

    const token = req.cookies.access_token; 
    
    if (!token) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "You need to send a token in the cookies" });
    }

    const decodeToken = jwt.verify(token, config.TOKEN_SECRET); // Verify token
    if (decodeToken.role !== "admin" && decodeToken.role !== "superadmin") {
     return res.status(StatusCodes.FORBIDDEN)
      .json({ msg: "You must be an admin to access this endpoint" });
    }
    req.tokenData = decodeToken; 
    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("Error from authAdmin function :", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); 

  }
};

  /**
 * Function to get the authenticated user's ID
 * @param {Object} req - Express request object
 * @returns {Object|null}
 */


const getAuthenticatedUser = (req) => {


  try {


    if (!req.tokenData || !req.tokenData._id) {
      return res.status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not authenticated" });
    }
    return req.tokenData; 
    
  } catch (err) {
    console.error("Error from getAuthenticatedUser funcion:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" });
  }
};


module.exports = {
  authAdmin,
  auth,
  getAuthenticatedUser,
};



