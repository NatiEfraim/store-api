const { UserModel } = require("../models/userModel");

/**
 * Fetch user details by user_id
 * @param {String} userId - The ID of the user to fetch
 * @returns {Promise<Object>} - The user details or an error message
 */
const getUserById = async (userId) => {
  try {
    // Fetch user by ID
    const user = await UserModel.findById(userId, { password: 0 }); // Exclude password for security

    if (!user) {
      return { error: "User not found" }; // Return error message if user doesn't exist
    }

    return user; // Return the user data
  } catch (err) {
    console.error("Error from getUserById function:", err.message);
    return { msg: "Internal Server Error" }; // Return a generic error message
  }
};

module.exports = {
  getUserById,
};
