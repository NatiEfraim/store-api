const { DrinkModel, validateCreateDrink, validateEditDrink } = require("../models/drinkModel");

  /**
 * Retrecived all drinks records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const fetchDrinkList = async (req, res) => {


        try {
            const drinks = await DrinkModel.find();
            res.status(200).json(drinks);
          } catch (err) {
            console.error("Error from getDrinks:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
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
        return res.status(404).json({ error: "Drink not found" });
      }
  
      res.status(200).json(drink);
    } catch (err) {
      console.error("Error from fetchDrinkById:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
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
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const updatedDrink = await DrinkModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedDrink) {
        return res.status(404).json({ error: "Drink not found" });
      }
  
      res.status(200).json({msg:"category updated successful"});
      
    } catch (err) {
      console.error("Error from editDrink:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
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
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const newDrink = new DrinkModel(req.body);
      await newDrink.save();
  
      res.json({msg:"Drink saved successful in the system."});
    } catch (err) {
      console.error("Error from createDrink:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
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
        return res.status(404).json({ error: "Drink not found" });
      }
  
      res.status(200).json({ msg: "Drink deleted successfully" });
    } catch (err) {
      console.error("Error from deleteById:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(404).json({ msg: "No drinks found for this user." });
    }

    res.status(200).json(drinks); // Return the list of drinks
  } catch (err) {
    console.error("Error from getDrinksByUserId:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
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