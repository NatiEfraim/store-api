const express = require("express");
const router = express.Router();
const DrinkModel = require("../models/drinkModel");
const { auth, authAdmin } = require("../middlewares/auth");
const {fetchDrinkList,
  createDrink,
  fetchDrinkById,
  editDrink,
  deleteById,
  getDrinksByUserId
} = require("../controllers/drinkController");


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
      console.error("Error from Drink tag:", err.message);
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
 * /user-drink/{user_id}:
 *   get:
 *     summary: Get all drinks created by a specific user
 *     tags: [Drink]
 *     security:
 *       - bearerAuth: [] # Optional if JWT authentication is used
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose drinks are to be fetched
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's drinks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Drink ID
 *                     example: 673df55677b6476bcc5f6dab
 *                   name:
 *                     type: string
 *                     description: Name of the drink
 *                     example: My Favorite Drink
 *                   ml:
 *                     type: string
 *                     description: Volume of the drink in milliliters
 *                     example: "512"
 *                   price:
 *                     type: number
 *                     description: Price of the drink
 *                     example: 452
 *                   user_id:
 *                     type: string
 *                     description: User ID who created the drink
 *                     example: 672dfcc85efc990f8f968156
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the drink was created
 *                     example: 2024-11-20T14:42:30.568Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the drink was last updated
 *                     example: 2024-11-20T14:42:30.568Z
 *       404:
 *         description: No drinks found for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: No drinks found for this user.
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

router.get("/user-drink/:user_id",auth ,getDrinksByUserId);



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
router.put("/:id",auth, editDrink);


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

router.post("/",auth, createDrink);

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
router.delete("/:id", auth,deleteById);


module.exports = router;
