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
 * Fetch a drink by ID
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
 * Edit a drink by ID
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
  
      res.status(200).json(updatedDrink);
    } catch (err) {
      console.error("Error from editDrink:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  /**
 * Create a new drink
 */
const createDrink = async (req, res) => {
    try {
      const { error } = validateCreateDrink(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const newDrink = new DrinkModel(req.body);
      await newDrink.save();
  
      res.status(201).json(newDrink);
    } catch (err) {
      console.error("Error from createDrink:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  /**
 * Delete a drink by ID
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

  module.exports = {
    createDrink,
    fetchDrinkList,
    fetchDrinkById,
    editDrink,
    deleteById,

  };