const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name, price, sellingPrice, category,
      img, image,
      description, specs, stock,
      code, hsnCode, unit, subCategory, brand,
      mrp, purchasePrice,
      sellingPriceTaxType, sellingPriceTaxRate,
      purchasePriceTaxType, purchasePriceTaxRate,
      batchNo, mfgDate, expDate
    } = req.body;

    const product = new Product({
      name,
      price: price || sellingPrice,
      category,
      img: img || image,
      description,
      specs,
      stock,
      code, hsnCode, unit, subCategory, brand,
      mrp, purchasePrice,
      sellingPriceTaxType, sellingPriceTaxRate,
      purchasePriceTaxType, purchasePriceTaxRate,
      batchNo, mfgDate, expDate
    });

    const createdProduct = await Product.create(product);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Updatable fields
      const fields = [
        'name', 'price', 'category', 'description', 'specs', 'stock',
        'code', 'hsnCode', 'unit', 'subCategory', 'brand',
        'mrp', 'purchasePrice',
        'sellingPriceTaxType', 'sellingPriceTaxRate',
        'purchasePriceTaxType', 'purchasePriceTaxRate',
        'batchNo', 'mfgDate', 'expDate'
      ];

      fields.forEach(field => {
        if (req.body[field] !== undefined) product[field] = req.body[field];
      });

      // Special handling for aliases
      if (req.body.sellingPrice) product.price = req.body.sellingPrice;
      if (req.body.image) product.img = req.body.image;
      if (req.body.img) product.img = req.body.img;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
