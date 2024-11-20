const express = require("express");
const router = express.Router();
const DrinkModel = require("../models/drinkModel");
const { auth, authAdmin } = require("../middlewares/auth");
const {fetchDrinkList,createDrink,fetchDrinkById,editDrink,deleteById} = require("../controllers/drinkController");


/**
 * @swagger
 * tags:
 *   name: Drink
 *   description: Drink management API
 */

router.get("/", async (req, res) => {
    try {
      res.json({ msg: "Hello from drinks endpoint" });
  
    } catch (err) {
      console.error("Error from index user:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

/**
 * @swagger
 * /drinks/index:
 *   get:
 *     summary: Retrieve a list of all drinks
 *     tags: [Drink]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of drinks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the drink
 *                     example: 643cf4a05cf276f8b63f5235
 *                   name:
 *                     type: string
 *                     description: Name of the drink
 *                     example: Cola Pepsi
 *                   ml:
 *                     type: string
 *                     description: Volume of the drink in milliliters
 *                     example: 330
 *                   price:
 *                     type: number
 *                     description: Price of the drink
 *                     example: 8
 *       500:
 *         description: Internal server error
 */


router.get("/index",auth ,fetchDrinkList);



/**
 * @swagger
 * /drinks/{id}:
 *   get:
 *     summary: Fetch a drink by ID
 *     tags: [Drink]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the drink to fetch
 *     responses:
 *       200:
 *         description: Successfully fetched the drink
 *       404:
 *         description: Drink not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id",auth, fetchDrinkById);


/**
 * @swagger
 * /drinks/{id}:
 *   put:
 *     summary: Edit a drink by ID
 *     tags: [Drink]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the drink to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ml:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Successfully edited the drink
 *       400:
 *         description: Validation error
 *       404:
 *         description: Drink not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id",authAdmin, editDrink);


/**
 * @swagger
 * /drinks:
 *   post:
 *     summary: Create a new drink
 *     tags: [Drink]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the drink
 *                 example: Cola Pepsi
 *               ml:
 *                 type: string
 *                 description: The volume of the drink
 *                 example: 330
 *               price:
 *                 type: number
 *                 description: The price of the drink
 *                 example: 8
 *     responses:
 *       201:
 *         description: Successfully created the drink
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.post("/",authAdmin, createDrink);

/**
 * @swagger
 * /drinks/{id}:
 *   delete:
 *     summary: Delete a drink by ID
 *     tags: [Drink]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the drink to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the drink
 *       404:
 *         description: Drink not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteById);


module.exports = router;
