const { DrinkModel, validateCreateDrink, validateEditDrink } = require("../models/drinkModel");
const { getAuthenticatedUser } = require("../middlewares/auth");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

  /**
 * Retrecived all drinks records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const fetchDrinkList = async (req, res) => {


        try {
            const drinks = await DrinkModel.find();
            res.status(StatusCodes.OK).json({data:drinks});
          } catch (err) {
            console.error("Error from fetchDrinkList function:", err.message);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal Server Error" });
          }
               

  };

  /**
 * Fetch drink record by id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchDrinkById = async (req, res) => {
    try {
      const { id } = req.params;
      const drink = await DrinkModel.findById(id);
  
      if (!drink) {
        return res.status(StatusCodes.NOT_FOUND)
        .json({ msg: "Drink not found" });
      }
  
      res.status(StatusCodes.OK)
      .json({data:drink});
    } catch (err) {
      console.error("Error from fetchDrinkById function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
    }
  };

  /**
 * Edit exsist drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


const editDrink = async (req, res) => {


    try {

      const { id } = req.params;
      const { error } = validateEditDrink(req.body);
      if (error) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ msg: error.details[0].message });
      }
  
      const updatedDrink = await DrinkModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedDrink) {
        return res.status(StatusCodes.NOT_FOUND)
        .json({ msg: "Drink not found" });
      }
  
      res.status(StatusCodes.OK)
      .json({msg:"category updated successful"});
      
    } catch (err) {
      console.error("Error from editDrink function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
    }
  };
  

  /**
 * create drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDrink = async (req, res) => {


    try {

      const { error } = validateCreateDrink(req.body);
      if (error) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ msg: error.details[0].message });
      }
    // Get the authenticated user's ID
    const userData = getAuthenticatedUser(req);
    const {_id,role} =userData;//destruct what needed.
    if (!_id) {
      return res.status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not authenticated" });
    }
            // Create a new drink with the authenticated user's id
    const newDrink = new DrinkModel({ ...req.body, user_id: _id });
      await newDrink.save();
  
      res.json({msg:"Drink saved successful in the system."});
    } catch (err) {
      console.error("Error from createDrink function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
    }


  };


  /**
 * create drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteById = async (req, res) => {



    try {


      const { id } = req.params;
      const deletedDrink = await DrinkModel.findByIdAndDelete(id);
  
      if (!deletedDrink) {
        return res.status(StatusCodes.NOT_FOUND)
        .json({ error: "Drink not found" });
      }
  
      res.status(StatusCodes.OK)
      .json({ msg: "Drink deleted successfully" });
    } catch (err) {
      console.error("Error from deleteById function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
    }
  };

  /**
 * Get all products by user_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDrinksByUserId = async (req, res) => {

  
  const { user_id } = req.params; // Extract user_id from the request parameters

  try {


    // Find all drinks that match the given user_id
    const drinks = await DrinkModel.find({ user_id });

    if (!drinks.length) {
      return res.status(StatusCodes.NOT_FOUND)
      .json({ msg: "No drinks found for this user." });
    }

    res.status(StatusCodes.OK).json({msg:drinks}); // Return the list of drinks
  } catch (err) {
    console.error("Error from getDrinksByUserId function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Internal Server Error" });
  }
};


  module.exports = {
    createDrink,
    fetchDrinkList,
    fetchDrinkById,
    editDrink,
    deleteById,
    getDrinksByUserId,
  };