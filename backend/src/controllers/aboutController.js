const AboutContent = require('../models/AboutContent');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get about page content
// @route   GET /api/about
// @access  Public
exports.getAboutContent = asyncHandler(async (req, res) => {
  const content = await AboutContent.findOne();
  res.json({ success: true, data: content || {} });
});

// @desc    Update about page content
// @route   POST /api/about
// @access  Private/Admin
exports.updateAboutContent = asyncHandler(async (req, res) => {
  let content = await AboutContent.findOne();

  if (content) {
    content = await AboutContent.findByIdAndUpdate(content._id, req.body, { new: true, runValidators: true });
  } else {
    content = await AboutContent.create(req.body);
  }

  res.json({ success: true, data: content });
});
