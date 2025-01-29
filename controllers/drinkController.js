const { DrinkModel, validateCreateDrink, validateEditDrink } = require("../models/drinkModel");
const { getAuthenticatedUser } = require("../middlewares/auth");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {getUserById} =require("../utils/userUtils");
const {formatDate} =require("../utils/dateUtils");

  /**
 * Retrecived all drinks records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const fetchDrinkList = async (req, res) => {


        try {
   // Fetch all drinks
   const drinks = await DrinkModel.find();


    // Enhance each drink with user details and formatted dates
    const enhancedDrinks = await Promise.all(
      drinks.map(async (drink) => {
        const user = await getUserById(drink.user_id);
        return {
          ...drink._doc, // Include drink data
          createdAt: formatDate(drink.createdAt), // Format createdAt
          updatedAt: formatDate(drink.updatedAt), // Format updatedAt
          user: user.error ? null : {
            ...user._doc,
            createdAt: formatDate(user.createdAt), // Format user's createdAt
            updatedAt: formatDate(user.updatedAt), // Format user's updatedAt
          }, // Attach user data or null if not found
        };
      })
    );

   res.status(StatusCodes.OK).json({ data: enhancedDrinks });
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

      // Fetch the drink by ID
      const drink = await DrinkModel.findById(id);
  
      if (!drink) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "Drink not found" });
      }
  
      // Fetch the associated user details
      const user = await getUserById(drink.user_id);
  
      // Enhance the drink data with formatted dates and user details
      const enhancedDrink = {
        ...drink._doc, // Include drink data
        createdAt: formatDate(drink.createdAt), // Format createdAt
        updatedAt: formatDate(drink.updatedAt), // Format updatedAt
        user: user.error ? null : {
          ...user._doc,
          createdAt: formatDate(user.createdAt), // Format user's createdAt
          updatedAt: formatDate(user.updatedAt), // Format user's updatedAt
        }, // Attach user data or null if not found
      };
  
      res.status(StatusCodes.OK).json({ data: enhancedDrink });
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
      .json({msg:"Drink updated successful"});
      
    } catch (err) {
      console.error("Error from editDrink function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR });
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

    const userData = getAuthenticatedUser(req);
    const {_id,role} =userData;
    if (!_id) {
      return res.status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "User not authenticated" });
    }
         
    const newDrink = new DrinkModel({ ...req.body, user_id: _id });
      await newDrink.save();
  
      res.json({msg:"Drink saved successful in the system."});
    } catch (err) {
      console.error("Error from createDrink function:", err.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR });
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
      .json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
  };

  /**
 * Get all products by user_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDrinksByUserId = async (req, res) => {


  
  try {
    
     const { user_id } = req.params; // Extract user_id from the route parameters

    // Fetch drinks associated with the given user_id
    const drinks = await DrinkModel.find({ user_id:user_id });

    if (!drinks.length) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No drinks found for this user" });
    }

    // Format the response
    const formattedDrinks = drinks.map((drink) => ({
      ...drink._doc, // Include the drink data
      createdAt: formatDate(drink.createdAt), // Format createdAt
      updatedAt: formatDate(drink.updatedAt), // Format updatedAt
    }));

    res.status(StatusCodes.OK).json({ data: formattedDrinks });
  } catch (err) {
    console.error("Error from getDrinksByUserId function:", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: ReasonPhrases.INTERNAL_SERVER_ERROR });
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