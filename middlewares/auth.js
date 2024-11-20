
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

// Middleware for authenticating users via token stored in cookies
const auth = (req, res, next) => {


  try {

    const token = req.cookies.access_token; // Retrieve token from cookies

    if (!token) {
      return res.status(401).json({ err: "You need to send a token in the cookies" });
    }

    const decodeToken = jwt.verify(token, config.TOKEN_SECRET); // Verify token
    req.tokenData = decodeToken; // Attach decoded token data to request
    
    next(); // Proceed to the next middleware/handler
  } catch (err) {
    res.status(401).json({ err: "Token invalid or expired" });
  }
};

// Middleware for admin-only access via token stored in cookies
const authAdmin = (req, res, next) => {
  
  try {

    const token = req.cookies.access_token; // Retrieve token from cookies
    
    if (!token) {
      return res.status(401).json({ err: "You need to send a token in the cookies" });
    }

    const decodeToken = jwt.verify(token, config.TOKEN_SECRET); // Verify token
    if (decodeToken.role !== "admin" && decodeToken.role !== "superadmin") {
      return res.status(403).json({ err: "You must be an admin to access this endpoint" });
    }
    req.tokenData = decodeToken; // Attach decoded token data to request
    next(); // Proceed to the next middleware/handler
  } catch (err) {
    console.error("msg error from authAdmin: ", err.message);

  }
};

module.exports = {
  authAdmin,
  auth,
};



