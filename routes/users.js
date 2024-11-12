const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");
const { createUser
  ,loginUser
  ,getUsersList
  ,fetchUserInfo
  ,decodeToken,
  deleteUser,
changeRole,
} = require("../controllers/userController");

const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users endpoint 14:28" });
})

/**
 * @swagger
 * /users/checkToken:
 *   get:
 *     summary: Verify and decode the user's JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []  # Add this if your API uses JWT authentication
 *     responses:
 *       200:
 *         description: Successfully decoded token data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 role:
 *                   type: string
 *                   description: User's role (e.g., admin, user, superadmin)
 *                 iat:
 *                   type: integer
 *                   description: Token issued at timestamp
 *                 exp:
 *                   type: integer
 *                   description: Token expiration timestamp
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */

router.get("/checkToken", auth, decodeToken);

/**
 * @swagger
 * /users/userInfo:
 *   get:
 *     summary: Retrieve user information by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Add this if your API uses JWT authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 role:
 *                   type: string
 *                   description: User's role (e.g., admin, user, superadmin)
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: User creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Last update timestamp
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

router.get("/userInfo", authAdmin, fetchUserInfo);

/**
 * @swagger
 * /users/usersList:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Add this if your API uses JWT authentication
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User ID
 *                   name:
 *                     type: string
 *                     description: User's name
 *                   email:
 *                     type: string
 *                     description: User's email
 *                   role:
 *                     type: string
 *                     description: User's role (e.g., admin, user, superadmin)
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: User creation timestamp
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Last update timestamp
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

router.get("/usersList", authAdmin, getUsersList);

/**
 * @swagger
 * /users/:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Add this if your API uses JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email of the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user
 *                 example: MySecureP@ssword123
 *               role:
 *                 type: string
 *                 description: Role of the user (e.g., admin, user, superadmin)
 *                 example: user
 *     responses:
 *       201:
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID
 *                 name:
 *                   type: string
 *                   description: The name of the user
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 password:
 *                   type: string
 *                   description: Masked password
 *                 role:
 *                   type: string
 *                   description: Role of the user
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The last update timestamp
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized, admin access required
 *       500:
 *         description: Internal server error
 */

router.post("/",authAdmin,createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: MySecureP@ssword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Login status message
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized, invalid email or password
 *       500:
 *         description: Internal server error
 */

router.post("/login", loginUser);

/**
 * @swagger
 * /users/changeRole/{id}:
 *   put:
 *     summary: Change the role of a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Add this if your API uses JWT authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The new role for the user
 *                 example: admin
 *     responses:
 *       200:
 *         description: Successfully updated the user's role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Status message
 *                   example: Role updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The user ID
 *                     name:
 *                       type: string
 *                       description: The name of the user
 *                     email:
 *                       type: string
 *                       description: The email of the user
 *                     role:
 *                       type: string
 *                       description: The updated role of the user
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The creation timestamp
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The last update timestamp
 *       400:
 *         description: Bad request, invalid input
 *       401:
 *         description: Unauthorized, cannot change your own role
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


router.put("/changeRole/:id", authAdmin, changeRole);


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Add this if your API uses JWT authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized, cannot delete your own account
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete("/:id", authAdmin, deleteUser);


router.patch("/updateFavs/", auth, async(req,res) => {
  try{
    if(!Array.isArray(req.body.favs_ar)){
      return res.status(400).json({msg:"You need to send favs_ar as array"});
    }
    const data = await UserModel.updateOne({_id:req.tokenData._id},{favs_ar:req.body.favs_ar})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})




module.exports = router;


////////////////////////////////monkeis code - need to remove
// router.post("/login", async (req, res) => {
//   const validBody = validateLogin(req.body);
//   if (validBody.error) {
//     return res.status(400).json(validBody.error.details);
//   }
//   try {

//     const user = await UserModel.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(401).json({ msg: "Email not found!" });
//     }

//     const passwordValid = await bcrypt.compare(req.body.password, user.password);
//     if (!passwordValid) {
//       return res.status(401).json({ msg: "Password worng!" });
//     }
//     const token = createToken(user._id, user.role);
//     res.json({ token , role:user.role });
//   }
//   catch (err) {
//     console.log(err);
//     res.status(502).json({ err })
//   }
// })


// router.get("/usersList", authAdmin, async (req, res) => {

//   try {

//     const data = await UserModel.find({}, { password: 0 });
//     res.json(data);
//   }

//   catch (err) {

//     console.error("error from userList function:", err.message);
//   }
// })


// router.get("/userInfo", auth, async (req, res) => {


//   try {

//     const user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
//     res.json(user)

//   }
//   catch (err) {

//     console.error("error from userInfo function:", err.message);
    
//     res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response

//   }
// })

// router.get("/checkToken", auth, async (req,res) => {
//   res.json(req.tokenData);
// })

// router.put("/changeRole/:id", authAdmin, async (req, res) => {

//   try {

    

//     // Extract `id` from the request parameters
//     const { id } = req.params;

//     // Extract `role` from the request body
//     const { role } = req.body;

//     // Check if the role is provided in the request body
//     if (!role) {
//       return res.status(400).json({ err: "Role is required in the request body" });
//     }

//     // Check if the admin is trying to change their own role
//     if (id === req.tokenData._id) {
//       return res.status(401).json({ err: "You can't change your own role" });
//     }

//     // Validate the role parameter
//     const validRoles = ["admin", "user", "superadmin"];
//     if (!validRoles.includes(role)) {
//       return res.status(400).json({ err: "Invalid role specified" });
//     }

//     // Find the user by ID and update their role
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       id, // Find user by ID
//       { role }, // Update the `role` field
//       { new: true, runValidators: true } // Return the updated document and apply validations
//     );

//     // If the user does not exist, return a 404 error
//     if (!updatedUser) {
//       return res.status(404).json({ err: "User not found" });
//     }

//     // Send the updated user data as the response
//     res.json({ msg: "Role updated successfully", user: updatedUser });
//   } catch (err) {
//     console.error("Error from changeUserRole function:", err.message);
//     res.status(500).json({ error: "Internal Server Error" }); // Handle error with a proper response
//   }

// })

// router.delete("/:id", authAdmin, async (req, res) => {
//   try {
//     const {id} = req.params;
//     if(id == req.tokenData._id){
//       return res.status(401).json({err:"you cant delete your self"})
//     }

//     const data = await UserModel.deleteOne({_id:id,role:{$not:new RegExp("superadmin")}});
//     res.json(data);
//   }
//   catch (err) {
//     console.log(err);
//     res.status(502).json({ err })
//   }
// })
