const { ProductModel, validateProduct } = require("../models/productModel");
const { getUserById } = require("../utils/userUtils");
const { getAuthenticatedUser } = require("../middlewares/auth");




/**
 * Example function to fetch user data by user_id
 */
const fetchUserDetails = async (req, res) => {

    try {
        const { user_id } = req.params; // Extract user_id from request parameters
  
        const user = await getUserById(user_id);
      
        if (user.error) {
          return res.status(404).json(user); // Return error if user is not found
        }
      
        res.status(200).json(user); // Return user data
    } catch (error) {
        console.error("Error from fetchUserDetails function:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
  
  };

/**
 * Get all products with pagination and filtering
 */
const getProducts = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse === "yes" ? 1 : -1;

    const products = await ProductModel.find()
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse });

    res.status(200).json(products);
  } catch (err) {
    console.error("Error from getProducts function:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get a single product by ID
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error from getProductById function:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


/**
 * Get all products by user_id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProductByUserId = async (req, res) => {
  const { user_id } = req.params; // Extract user_id from the request parameters

  try {
    // Find all products that match the given user_id
    const products = await ProductModel.find({ user_id });

    if (!products.length) {
      return res.status(404).json({ msg: "No products found for this user." });
    }

    res.status(200).json(products); // Return the list of products
  } catch (err) {
    console.error("Error from getProductsByUserId function:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const createProduct = async (req, res) => {
  
  try {

    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ error: error.details });
    }


    // Get the authenticated user's ID
    const userData = getAuthenticatedUser(req);
    const {_id,role} =userData;//destruct what needed.
    if (!_id) {
      return res.status(401).json({ err: "User not authenticated" });
    }

    const product = new ProductModel({ ...req.body, user_id: _id });

    await product.save();

    res.status(201).json({ msg: "Product created successfully"});
  } catch (err) {
    console.error("Error from createProduct function:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update an existing product by ID
 */
const updateProduct = async (req, res) => {
  const { id } = req.params;

  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ msg: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Error from updateProduct function:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a product by ID
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error("Error from deleteProduct function:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchUserDetails,
  getProductByUserId,
};
