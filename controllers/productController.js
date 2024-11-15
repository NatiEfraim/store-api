const { ProductModel, validateProduct } = require("../models/productModel");

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
    console.error("Error from getProducts:", err.message);
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
    console.error("Error from getProductById:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new product
 */
const createProduct = async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({ error: error.details });
  }

  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json({ msg: "Product created successfully", product });
  } catch (err) {
    console.error("Error from createProduct:", err.message);
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
    console.error("Error from updateProduct:", err.message);
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
    console.error("Error from deleteProduct:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
