const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard metrics
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'Admin';

    const filter = isAdmin ? {} : { assignedTo: userId };

    const tasks = await Task.find(filter);
    
    const now = new Date();

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      pending: tasks.filter(t => t.status === 'In Progress').length,
      overdue: tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/dashboard/activities
// @desc    Get recent activities
// @access  Private
router.get('/activities', authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    console.log(`Fetched ${activities.length} activities for user: ${req.user.id}`);
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
