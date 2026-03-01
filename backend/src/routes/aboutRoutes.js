const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getAboutContent)
  .post(protect, authorize('admin', 'agent'), updateAboutContent);

module.exports = router;
