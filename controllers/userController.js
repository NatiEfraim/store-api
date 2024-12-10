const bcrypt = require("bcrypt");
const { UserModel, validateCreateUser, validateEditUser} = require("../models/userModel");
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
      { password: 0,updatedAt:0,createdAt:0,favs_ar:0 });
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
       { password: 0,updatedAt:0,createdAt:0,favs_ar:0 });
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

    const {error} = validateCreateUser(req.body);

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
 * Update user details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {


  try {

    const { id } = req.params; 

    if (id==null) {
      
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Need to provide id" });
    }
    
    const authUser = req.tokenData; 
    
    const { error } = validateEditUser(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: error.details[0].message });
    }

    if (authUser.role !== "admin" && authUser.role !== "superadmin") {
      if (authUser._id !== id) {
        return res.status(StatusCodes.FORBIDDEN).json({ msg: "You can only update your own details" });
      }
    }

   const updatedUser= await UserModel.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }


    res.status(StatusCodes.OK).json({ msg: "User updated successfully" });
  } catch (err) {
    console.error("Error from updateUser function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR });
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

    const { id } = req.params;

    const { role } = req.body;

    if (!role) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "Role is required in the request body" });
    }

    if (id === req.tokenData._id) {
      return res.status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You can't change your own role" });
    }

    const validRoles = ["admin", "user", "superadmin"];
    if (!validRoles.includes(role)) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ msg: "Invalid role specified" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true, runValidators: true } 
    );

    // If the user does not exist, return a 404 error
    if (!updatedUser) {
      return res.status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not exist in the system" });
    }

    res.status(StatusCodes.OK)
    .json({ msg: "Role updated successfully"});
  } catch (err) {
    console.error("Error from changeUserRole function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); 
  }


};




  /**
 * Retrecived all users records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const getUsersList = async (req, res) => {

  try {

    const data = await UserModel.find({}); 
    res.status(StatusCodes.OK)
    .json({data:data});
  } catch (err) {
    console.error("Error from getUsersList function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); 
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
      if (!user) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: "User has been deleted" }); 
      }
      res.json({data:user}).status(StatusCodes.OK);
  
    }
    
    catch (err) {
      console.error("error from fetchUserInfo function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" }); 
    }
};

/**
 * Controller to delete a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {


  try {

    const { id } = req.params;

    
    if (id === req.tokenData._id) {
      return res.status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You can't delete your own account" });
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(StatusCodes.BAD_REQUEST)
      .json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" }).status(StatusCodes.OK);
  } catch (err) {
    console.error("Error from deleteUser function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" }); 
  }
};
  

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {

  try {

    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    res.status(StatusCodes.OK).json({ data: user });
  } catch (err) {
    console.error("Error from getUserById function:", err.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
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
  updateUser, 
  getUserById,
};

