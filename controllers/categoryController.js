const {CategoryModel,validateCategory,validateEditCategory} = require("../models/categoryModel");





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
        console.log("Error from fetchCategoriesList function:",err.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
           

};



/**
 * Create a new category in the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCategory = async (req, res) => {
  
  try {


    const validBody = validateCategory(req.body);
  
    // Validate the incoming request body
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }

    const category = new CategoryModel(req.body);
    await category.save();

    // Send a success response
    res.json({ msg: "Category saved successfully in the system." });
  } catch (err) {
    console.error("Error from createCategory function:", err.message);

    // Send an error response in case of failure
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


  /**
 * Edit exsist drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


  const editCategory = async (req, res) => {

    try{
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({msg:"id of category must recived"})
      }

    const validBody = validateEditCategory(req.body);
   if(validBody.error){
      return res.status(400).json(validBody.error.details)
   }


    const data = await CategoryModel.updateOne({_id:id},req.body)
    
    res.status(200).json({msg:"Category updated successfuly in the system"});

   }
    catch(err){

    console.log("Error from editCategory function:",err.message);
    res.status(500).json({ msg: "Internal Server Error" });
    }

  };
  
  /**
 * create drink record in storage.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
  const deleteById = async (req, res) => {
    try{
        const id = req.params.id;
        const data = await CategoryModel.deleteOne({_id:id})
     
        const {deletedCount} = data;
        if (!deletedCount) {
            res.status(400).json({msg:"Category not exsist in the system"});

        }
        res.status(200).json({msg:"Category deleted successfuly in the system"});
    }
      catch(err){
        console.log("Error from editCategory function:",err.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
    
  };


module.exports = {
    fetchCategoriesList,
    createCategory,
    editCategory,
    deleteById,
  };