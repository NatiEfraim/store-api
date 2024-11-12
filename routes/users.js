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



// Route for get details of user by token.
router.get("/checkToken", auth, decodeToken);

// Route for getting the info user
router.get("/userInfo", authAdmin, fetchUserInfo);

// Route for getting the list of users
router.get("/usersList", authAdmin, getUsersList);




/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password
 *       required:
 *         - name
 *         - email
 *         - password
 * 
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Validation error
 */


router.post("/",createUser);

// Login user
router.post("/login", loginUser);

// Route for getting the list of users
router.put("/changeRole/:id", authAdmin, changeRole);

// Route to delete a user by ID
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
