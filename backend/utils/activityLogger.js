const Activity = require('../models/Activity');

const logActivity = async (userId, action, targetType, targetId, details = '') => {
  try {
    const activity = new Activity({
      user: userId,
      action,
      targetType,
      targetId,
      details
    });
    await activity.save();
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = logActivity;
