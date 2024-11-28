const {CategoryModel,validateCategory,validateEditCategory} = require("../models/categoryModel");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");





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
        res.json({data:data}).status(StatusCodes.OK);
      }
      catch(err){
        console.log("Error from fetchCategoriesList function:",err.message);
        res.json({ msg: "Internal Server Error" })
        .status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
           

};



/**
 * Create a new category in the system
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCategory = async (req, res) => {
  
  try {


    const {error} = validateCategory(req.body);
  
    // Validate the incoming request body
    if (error) {
      console.log("msg from createCategory :", error.details[0].message);

      return res.json({msg:error.details[0].message})
      .status(StatusCodes.UNPROCESSABLE_ENTITY);
    }

    const category = new CategoryModel(req.body);
    await category.save();

    // Send a success response
    res.json({ msg: "Category saved successfully in the system." }).status(StatusCodes.OK);
  } catch (err) {
    console.error("Error from createCategory function:", err.message);

    // Send an error response in case of failure
    res.json({ msg: "Internal Server Error" })
    .status(StatusCodes.INTERNAL_SERVER_ERROR);
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
        return res.json({msg:"id of category must recived"})
        .status(StatusCodes.BAD_REQUEST);
      }

    const {error} = validateEditCategory(req.body);
    
   if(error){
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({msg:error.details[0].message})
   }


    const data = await CategoryModel.updateOne({_id:id},req.body)
    
    res.status(StatusCodes.OK)
    .json({msg:"Category updated successfuly in the system"});

   }
    catch(err){

      console.log("Error from editCategory function:",err.message);
      res.json({ msg: "Internal Server Error" }).status(StatusCodes.OK);
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
            res.json({msg:"Category not exsist in the system"})
            .status(StatusCodes.BAD_REQUEST);

        }
        res.json({msg:"Category deleted successfuly in the system"})
        .status(StatusCodes.OK);
    }
      catch(err){
        console.log("Error from editCategory function:",err.message);
        res.json({ msg: "Internal Server Error" })
        .status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    
  };


module.exports = {
    fetchCategoriesList,
    createCategory,
    editCategory,
    deleteById,
  };