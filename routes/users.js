const express = require("express");
const { UserModel } = require("../models/userModel");
const { createUser
  ,getUsersList
  ,fetchUserInfo
  ,decodeToken,
  deleteUser,
changeRole,
getRoleAdmin,
getRoleUser,
updateUser,
getUserById,
getRoleAuthUser,
} = require("../controllers/userController");
const {loginUser,logoutUser,signUpUser} =require("../controllers/authController");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();



/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management API
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication management API
 */


router.get("/", async (req, res) => {
  try {
    res.json({ msg: "Hello from user endpoint" });

  } catch (err) {
    console.error("Error from User tag: ", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})


/**
 * @swagger
 * /users/index:
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

router.get("/index", auth, getUsersList);

/**
 * @swagger
 * /users/auth-user:
 *   get:
 *     summary: Retrieve the role of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # JWT authentication required
 *     responses:
 *       200:
 *         description: Successfully retrieved the role of the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Role of the authenticated user (e.g., admin, user, superadmin)
 *             example:
 *               data: "admin"
 *       401:
 *         description: Unauthorized, authentication token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *             example:
 *               msg: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message
 *             example:
 *               msg: "Internal Server Error"
 */


router.get("/auth-user",auth,getRoleAuthUser);





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

router.get("/user", auth, fetchUserInfo);



/**
 * @swagger
 * /users/role/admins:
 *   get:
 *     summary: Get all users with the admin role
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Optional if JWT authentication is used
 *     responses:
 *       200:
 *         description: Successfully retrieved all admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: 644f7a80fcc370fd6cba1df6
 *                       name:
 *                         type: string
 *                         description: Name of the admin
 *                         example: "Admin Name"
 *                       email:
 *                         type: string
 *                         description: Email of the admin
 *                         example: "admin@example.com"
 *                       role:
 *                         type: string
 *                         description: Role of the user
 *                         example: "admin"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get("/role/admins", authAdmin, getRoleAdmin);




/**
 * @swagger
 * /users/role/users:
 *   get:
 *     summary: Get all users with the user role
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # Optional if JWT authentication is used
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: 644f7a80fcc370fd6cba1df6
 *                       name:
 *                         type: string
 *                         description: Name of the user
 *                         example: "User Name"
 *                       email:
 *                         type: string
 *                         description: Email of the user
 *                         example: "user@example.com"
 *                       role:
 *                         type: string
 *                         description: Role of the user
 *                         example: "user"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get("/role/users", authAdmin, getRoleUser);



/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     description: Retrieve a user's details by their unique ID. Excludes the password field in the response.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6751cb0230aada588e693db7"
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-04T15:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-05T12:00:00.000Z"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error.
 */

router.get("/:id", auth, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - User
 *     description: Updates user information by ID. Only users with the role `admin` or `superadmin` can update any user. Regular users can only update their own data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update.
 *       - in: body
 *         name: body
 *         required: true
 *         description: Fields to update for the user. All fields are optional.
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: New name of the user.
 *               example: John Doe
 *             email:
 *               type: string
 *               description: New email of the user.
 *               example: johndoe@example.com
 *             password:
 *               type: string
 *               description: New password for the user. It will be hashed before saving.
 *               example: mySecurePassword123
 *             role:
 *               type: string
 *               description: Role of the user. Only `admin` or `superadmin` can update this field.
 *               enum: [user, admin, superadmin]
 *               example: admin
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User updated successfully.
 *       400:
 *         description: Validation error or unauthorized request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: You can't update another user's data.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User not found in the system.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Internal Server Error.
 */


router.put("/:id", auth, updateUser);

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
 *     summary: Login an existing user
 *     description: Authenticates a user with valid credentials and returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "OK"
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "644f62551ca3e1d6d878dc12"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *       401:
 *         description: Unauthorized. Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Unauthorized"
 *       422:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "\"email\" must be a valid email"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account with the specified credentials.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: securepassword123
 *               role:
 *                 type: string
 *                 description: Role of the user. Defaults to "user".
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "\"email\" must be a valid email"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */


router.post("/signup", signUpUser);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Logout successful
 *       500:
 *         description: Internal server error
 */

router.post("/logout",auth, logoutUser);




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

