const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");
const { fetchUserDetails } = require("../controllers/productController");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */


/**
 * @swagger
 * /products/user/{user_id}:
 *   get:
 *     summary: Fetch user details by user_id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully fetched user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 644f62551ca3e1d6d878dc12
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/user/:user_id", fetchUserDetails);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination and filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
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
 *           enum: [yes, no]
 *           default: no
 *         description: Reverse the sort order
 *     responses:
 *       200:
 *         description: Successfully fetched products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal Server Error
 */

router.get("/", getProducts);


/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Fetch a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully fetched the product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */


router.get("/:id", getProductById);


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: ASUS F15
 *               info:
 *                 type: string
 *                 example: ASUS F15, BEST LAPTOP EVER!
 *               price:
 *                 type: number
 *                 example: 5000
 *               category_url:
 *                 type: string
 *                 example: laptops
 *               img_url:
 *                 type: string
 *                 example: https://images.pexels.com/photos/5793953/pexels-photo-5793953.jpeg?auto=compress&cs=tinysrgb&w=600
 *               user_id:
 *                 type: string
 *                 example: 644f62551ca3e1d6d878dc12
 *     responses:
 *       201:
 *         description: Successfully created the product
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 */


router.post("/", auth, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated ASUS F15
 *               info:
 *                 type: string
 *                 example: Updated ASUS F15, BEST LAPTOP EVER!
 *               price:
 *                 type: number
 *                 example: 5500
 *               category_url:
 *                 type: string
 *                 example: laptops
 *               img_url:
 *                 type: string
 *                 example: https://images.pexels.com/photos/5793953/pexels-photo-5793953.jpeg?auto=compress&cs=tinysrgb&w=600
 *               user_id:
 *                 type: string
 *                 example: 644f62551ca3e1d6d878dc12
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */


router.put("/:id", auth, updateProduct);


/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Successfully deleted the product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */

router.delete("/:id", authAdmin, deleteProduct);

module.exports = router;





// const express = require("express");
// const {ProductModel,validateProduct} = require("../models/productModel");
// const { auth } = require("../middlewares/auth");
// const router = express.Router();

// router.get("/", async(req,res) => {
//   try{
//     const perPage = req.query.perPage || 5;
//     const page = req.query.page - 1 || 0;
//     const sort = req.query.sort || "_id";
//     const reverse = req.query.reverse == "yes" ? 1 : -1;
//     const category = req.query.category;
//     const search = req.query.s;
//     const user_id = req.query.user_id;

//     let filterFind = {}

//     if(category){
//       filterFind = {category_url:category}
//     }
//     if(search){

//       const searchExp = new RegExp(search,"i");

//       filterFind = {$or:[{name:searchExp},{info:searchExp}]}
//     }
//     if(user_id){
//       filterFind = {user_id}
//     }
    
//     const data = await ProductModel
//     .find(filterFind)
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

// router.get("/count", async(req,res) => {
//   try{
//     const perPage = req.query.perPage || 5;
//     const category = req.query.category;
//     const search = req.query.s;
//     const user_id = req.query.user_id;
//     let filterFind = {}
//     if(category){
//       filterFind = {category_url:category}
//     }
//     if(search){
//       const searchExp = new RegExp(search,"i");

//       filterFind = {$or:[{name:searchExp},{info:searchExp}]}
//     }
//     if(user_id){
//       filterFind = {user_id}
//     }
//     const count = await ProductModel.countDocuments(filterFind);
//     res.json({count,pages:Math.ceil(count/perPage)})
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// router.get("/single/:id" , async(req,res) => {
//   try{
//     const id = req.params.id;
//     const data = await ProductModel.findOne({_id:id});
//     res.json(data); 
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// router.post("/", auth, async(req,res) => {
//   const validBody = validateProduct(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details)
//   }
//   try{
//     const product = new ProductModel(req.body);
//     product.user_id = req.tokenData._id;
//     await product.save();
//     res.json(product);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })



// router.post("/groupIds", async(req,res) => {
//   try{
//     if(!Array.isArray(req.body.favs_ar)){
//       return res.status(400).json({msg:"You need to send favs_ar as array"});
//      }
//     // $in: -> מאפשר לשלוף מספר רשומות שאין בינם קשר כגון קטגוריה או משתמש
//     // const data = await ProductModel.find({_id:{$in:["6461f281ddc83b428bd83f2e","6461f3abddc83b428bd83f34"]}}).limit(20)
//     const data = await ProductModel.find({_id:{$in:req.body.favs_ar}}).limit(20)
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })



// router.put("/:id", auth, async(req,res) => {
//   const validBody = validateProduct(req.body);
//   if(validBody.error){
//     return res.status(400).json(validBody.error.details)
//   }
//   try{
//     const id = req.params.id;
//     let data;
//     if(req.tokenData.role != "user"){
//       data =  await ProductModel.updateOne({_id:id},req.body)
//     }
//     else{
//       data = await ProductModel.updateOne({_id:id,user_id:req.tokenData._id},req.body)

//     }
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })

// router.delete("/:id", auth, async(req,res) => {
//   try{
//     const id = req.params.id;
//     let data;

//     if(req.tokenData.role != "user"){
//       data = await ProductModel.deleteOne({_id:id})
//     }
//     else{
//       data = await ProductModel.deleteOne({_id:id,user_id:req.tokenData._id})
//     }
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(502).json({err})
//   }
// })



// module.exports = router;