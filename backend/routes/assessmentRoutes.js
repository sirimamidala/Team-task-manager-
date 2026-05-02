const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const logActivity = require('../utils/activityLogger');
const router = express.Router();

// @route   POST /api/assessments/submit
// @desc    Submit project assessment
// @access  Private
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    // Log activity
    await logActivity(req.user.id, 'Assessment Submitted', 'Task', req.user.id, 'Final assessment submitted for review');
    
    console.log(`Assessment submitted by user: ${req.user.id}`);
    
    res.json({ 
      success: true, 
      message: 'Assessment submitted successfully! Well done.',
      timestamp: new Date()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
