const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProperties)
  .post(protect, authorize('admin', 'agent'), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('admin', 'agent'), updateProperty)
  .delete(protect, authorize('admin', 'agent'), deleteProperty);

module.exports = router;
