
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");


  /**
 * // Middleware for authenticating users via token stored in cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const auth = (req, res, next) => {


  try {

    const token = req.cookies.access_token; // Retrieve token from cookies

    if (!token) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "You need to send a token in the cookies" });
    }

    const decodeToken = jwt.verify(token, config.TOKEN_SECRET); // Verify token
    req.tokenData = decodeToken; // Attach decoded token data to request
    
    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("Error from auth function :", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); // Handle error with a proper response
  }
};


    /**
 *  Middleware for admin-only access via token stored in cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const authAdmin = (req, res, next) => {
  
  try {

    const token = req.cookies.access_token; // Retrieve token from cookies
    
    if (!token) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "You need to send a token in the cookies" });
    }

    const decodeToken = jwt.verify(token, config.TOKEN_SECRET); // Verify token
    if (decodeToken.role !== "admin" && decodeToken.role !== "superadmin") {
      return res.status(StatusCodes.FORBIDDEN)
      .json({ err: "You must be an admin to access this endpoint" });
    }
    req.tokenData = decodeToken; // Attach decoded token data to request
    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("Error from authAdmin function :", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); // Handle error with a proper response

  }
};

  /**
 * // Function to get the authenticated user's ID
 * @param {Object} req - Express request object
 * @returns {Object|null}
 */


const getAuthenticatedUser = (req) => {


  try {


    if (!req.tokenData || !req.tokenData._id) {
      // throw new Error("User not authenticated");
      return res.status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not authenticated" });
      // return null;
    }
    return req.tokenData; // Return the authenticated user's ID
    
  } catch (err) {
    console.error("Error from getAuthenticatedUser funcion:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); // Handle error with a proper response
    // return null; // Return null if authentication fails
  }
};


module.exports = {
  authAdmin,
  auth,
  getAuthenticatedUser,
};



