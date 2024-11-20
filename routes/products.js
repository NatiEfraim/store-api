const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middlewares/auth");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByUserId,
  fetchUserDetails
} = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management API
 */


/**
 * @swagger
 * /products/user/{user_id}:
 *   get:
 *     summary: Fetch user details by user_id
 *     tags: [Product]
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
 * /products/by-user/{user_id}:
 *   get:
 *     summary: Get all products created by a specific user
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *                     example: 6461f281ddc83b428bd83f2e
 *                   name:
 *                     type: string
 *                     description: Product name
 *                     example: ASUS F15
 *                   info:
 *                     type: string
 *                     description: Product details
 *                     example: ASUS F15, BEST LAPTOP EVER!
 *                   price:
 *                     type: number
 *                     description: Product price
 *                     example: 5000
 *                   category_url:
 *                     type: string
 *                     description: Product category URL
 *                     example: laptops
 *                   img_url:
 *                     type: string
 *                     description: Product image URL
 *                     example: https://images.example.com/1.jpg
 *                   user_id:
 *                     type: string
 *                     description: User ID
 *                     example: 644f62551ca3e1d6d878dc12
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No products found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: No products found for this user.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/by-user/:user_id", auth, getProductByUserId);





/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination and filtering
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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
 *     tags: [Product]
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



