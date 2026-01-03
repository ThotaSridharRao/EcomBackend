const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes (Protected + Admin check needed in future, just protect for now or add admin middleware)
// For now, we will just use protect and rely on logic or add simple role check if needed. 
// But current requirement was just backend for features.
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
