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
        console.log("Error from fetchCategoriesList:",err);
        res.status(502).json({err})
      }
           

};

module.exports = {
    fetchCategoriesList
  };