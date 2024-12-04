const bcrypt = require("bcrypt");
const { UserModel, validateUser } = require("../models/userModel");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { UserRoles } = require("../utils/enums");




/**
 * Get all  users with admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


const getRoleAdmin = async (req, res) => {
  try {
    const admins = await UserModel.find({ role: UserRoles.ADMIN }, 
      { password: 0,updatedAt:0,createdAt:0,favs_ar:0 }); // Use the enum
    res.status(StatusCodes.OK).json({data:admins});
  } catch (err) {
    console.error("Error fetching getRoleAdmins:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
  }
};



/**
 * Get all  users with user role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


const getRoleUser = async (req, res) => {
  try {
    const users = await UserModel.find({ role: UserRoles.USER },
       { password: 0,updatedAt:0,createdAt:0,favs_ar:0 }); // Use the enum
    res.status(StatusCodes.OK).json({data:users});
  } catch (err) {
    console.error("Error fetching getRoleUsers:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    msg.json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {

  try {

    const {error} = validateUser(req.body);

    if (error) {

      return res.status(StatusCodes.BAD_REQUEST)
      .json({msg:error.details[0].message});
    }

    const { name, email, password, role } = req.body;

    const newUser = new UserModel({
      name,
      email,
      password: password,
      role: role || "user",
    });

    await newUser.save();

    res.status(StatusCodes.CREATED)
    .json({msg:"User has been added successfuly in the system"});

  } catch (err) {

    console.error("error from createUser function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" }); // Handle error with a proper response

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" }); // Handle error with a proper response

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
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "Role is required in the request body" });
    }

    // Check if the admin is trying to change their own role
    if (id === req.tokenData._id) {
      return res.status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You can't change your own role" });
    }

    // Validate the role parameter
    const validRoles = ["admin", "user", "superadmin"];
    if (!validRoles.includes(role)) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "Invalid role specified" });
    }

    // Find the user by ID and update their role
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, // Find user by ID
      { role }, // Update the `role` field
      { new: true, runValidators: true } // Return the updated document and apply validations
    );

    // If the user does not exist, return a 404 error
    if (!updatedUser) {
      return res.status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not exist in the system" });
    }

    // Send the updated user data as the response
    res.status(StatusCodes.OK)
    .json({ msg: "Role updated successfully"});
  } catch (err) {
    console.error("Error from changeUserRole function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); // Handle error with a proper response
  }


};




  /**
 * Retrecived all users records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const getUsersList = async (req, res) => {

  try {

    const data = await UserModel.find({}); // Exclude password field
    res.status(StatusCodes.OK)
    .json({data:data});
  } catch (err) {
    console.error("Error from getUsersList function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); // Handle error with a proper response
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
      res.json({data:user}).status(StatusCodes.OK);
  
    }
    catch (err) {
  
      console.error("error from fetchUserInfo function:", err.message);
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" }); // Handle error with a proper response
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
      return res.status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You can't delete your own account" });
    }

    // Find the user by ID and delete them
    const deletedUser = await UserModel.findByIdAndDelete(id);

    // If the user does not exist, return a 404 error
    if (!deletedUser) {
      return res.status(StatusCodes.BAD_REQUEST)
      .json({ msg: "User not found" });
    }

    // Send a success message as the response
    res.json({ msg: "User deleted successfully" }).status(StatusCodes.OK);
  } catch (err) {
    console.error("Error from deleteUser function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); // Handle error with a proper response
  }
};
  

module.exports = {
  createUser,
  getUsersList,
  fetchUserInfo,
  decodeToken,
  changeRole,
  deleteUser,
  getRoleAdmin,
  getRoleUser,
};

