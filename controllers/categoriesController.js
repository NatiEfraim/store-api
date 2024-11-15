const express = require("express");
const {CategoryModel,validateCategory} = require("../models/categoryModel");
const { authAdmin,auth } = require("../middlewares/auth");
const router = express.Router();




  /**
 * Retrecived all categories records
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

  const fetchCategoriesList = async (req, res) => {


    try{
        
        const perPage = req.query.perPage || 20;
        const page = req.query.page - 1 || 0;
        const sort = req.query.sort || "_id";
        const reverse = req.query.reverse == "yes" ? 1 : -1;
        const data = await CategoryModel
        .find({})
        .limit(perPage)
        .skip(page * perPage)
        .sort({[sort]:reverse})
        res.json(data);
      }
      catch(err){
        console.log("Error from fetchCategoriesList:",err.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
           

};


  /**
 * create drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
  const createCategory = async (req, res) => {
    
    const validBody = validateCategory(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const category = new CategoryModel(req.body);
      await category.save();
      res.json({msg:"Category saved successful in the system."});
    }
    catch(err){
        console.log("Error from createCategory:",err.message);
    }
    res.status(500).json({ error: "Internal Server Error" });
};


  /**
 * Edit exsist drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


  const editCategory = async (req, res) => {
   const validBody = validateCategory(req.body);
  if(validBody.error){
     return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.id;
    const data = await CategoryModel.updateOne({_id:id},req.body)
    res.status(200).json({msg:"Category updated successfuly in the system"});
   }
    catch(err){
    console.log("Error from editCategory:",err.message);
    }
    res.status(500).json({ error: "Internal Server Error" });

  };
  



module.exports = {
    fetchCategoriesList,
    createCategory,
    editCategory,
  };