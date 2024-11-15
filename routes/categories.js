const express = require("express");
const {CategoryModel,validateCategory} = require("../models/categoryModel");
const {fetchCategoriesList,
  createCategory,
  editCategory,
  deleteById
} =require("../controllers/categoryController");
const { authAdmin,auth } = require("../middlewares/auth");
const router = express.Router();




router.get("/", async (req, res) => {
  try {
    res.json({ msg: "Hello from categories endpoint" });

  } catch (err) {
    console.error("Error from index user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


/**
 * @swagger
 * /categories/index:
 *   get:
 *     summary: Retrieve all categories with pagination and sorting
 *     tags: [Category]
 *     parameters:
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records to fetch per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to fetch
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: "_id"
 *         description: Field to sort the results by
 *       - in: query
 *         name: reverse
 *         schema:
 *           type: string
 *           enum: ["yes", "no"]
 *           default: "no"
 *         description: Reverse the sort order (yes for ascending, no for descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the category
 *                     example: 673643936e1472ca519ab981
 *                   name:
 *                     type: string
 *                     description: Name of the category
 *                     example: Electronics
 *                   url_name:
 *                     type: string
 *                     description: URL-friendly name for the category
 *                     example: electronics
 *                   info:
 *                     type: string
 *                     description: Description of the category
 *                     example: Category for all electronic devices and gadgets
 *                   img_url:
 *                     type: string
 *                     description: URL of the category's image
 *                     example: https://example.com/images/electronics.jpg
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the category was created
 *                     example: 2024-11-14T18:38:11.318Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the category was last updated
 *                     example: 2024-11-14T18:42:22.739Z
 *                   __v:
 *                     type: integer
 *                     description: Version key for the document
 *                     example: 0
 *       502:
 *         description: Server error while fetching categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */


router.get("/index",auth,fetchCategoriesList);


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *                 example: Electronics
 *               url_name:
 *                 type: string
 *                 description: URL-friendly name for the category
 *                 example: electronics
 *               info:
 *                 type: string
 *                 description: Description of the category
 *                 example: Category for all electronic devices and gadgets
 *               img_url:
 *                 type: string
 *                 description: URL of the category's image
 *                 example: https://example.com/images/electronics.jpg
 *     responses:
 *       200:
 *         description: Successfully created the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                   example: Category saved successful in the system.
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Validation error message
 *                     example: "name is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */

router.post("/",authAdmin, createCategory);



/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Edit an existing category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: [] # Optional if JWT is used for this endpoint
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the category
 *                 example: Updated Electronics
 *               url_name:
 *                 type: string
 *                 description: Updated URL-friendly name for the category
 *                 example: updated-electronics
 *               info:
 *                 type: string
 *                 description: Updated description of the category
 *                 example: Updated category description
 *               img_url:
 *                 type: string
 *                 description: Updated URL of the category's image
 *                 example: https://example.com/images/updated-electronics.jpg
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                   example: Category updated successfully in the system
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Validation error message
 *                     example: "name is required"
 *       502:
 *         description: Server error while updating the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */

router.put("/:id",authAdmin,editCategory);




/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: [] # Optional if JWT is used for this endpoint
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                   example: Category deleted successfully in the system
 *       400:
 *         description: Category does not exist in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *                   example: Category not exist in the system
 *       500:
 *         description: Internal server error while deleting the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Internal Server Error
 */

router.delete("/:id", authAdmin, deleteById);



module.exports = router;


/////////functions need to remove!!

// router.get("/", async(req,res) => {
//   try{
//     const perPage = req.query.perPage || 20;
//     const page = req.query.page - 1 || 0;
//     const sort = req.query.sort || "_id";
//     const reverse = req.query.reverse == "yes" ? 1 : -1;
//     const data = await CategoryModel
//     .find({})
//     .limit(perPage)
//     .skip(page * perPage)
//     .sort({[sort]:reverse})
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// router.post("/", authAdmin, async(req,res) => {
//   const validBody = validateCategory(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details)
//   }
//   try{
//     const category = new CategoryModel(req.body);
//     await category.save();
//     res.json(category);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// router.put("/:id", authAdmin, async(req,res) => {
//   const validBody = validateCategory(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details)
//   }
//   try{
//     const id = req.params.id;
//     const data = await CategoryModel.updateOne({_id:id},req.body)
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// router.delete("/:id", authAdmin, async(req,res) => {
//   try{
//     const id = req.params.id;
//     const data = await CategoryModel.deleteOne({_id:id})
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })