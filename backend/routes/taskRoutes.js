const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Task = require('../models/Task');
const Project = require('../models/Project');
const logActivity = require('../utils/activityLogger');

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private (Admin)
router.post('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const { title, description, status, dueDate, project, assignedTo } = req.body;
    const newTask = new Task({ title, description, status, dueDate, project, assignedTo });
    const task = await newTask.save();
    await logActivity(req.user.id, 'Task Created', 'Task', task._id, `Created task: ${task.title}`);
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin') {
      tasks = await Task.find().populate('project', 'title').populate('assignedTo', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('project', 'title').populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task (Admin can update all, Member can update status if assigned)
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Member') {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      // Members can only update status
      task.status = req.body.status || task.status;
    } else {
      // Admins can update anything
      const { title, description, status, dueDate, project, assignedTo } = req.body;
      if (title) task.title = title;
      if (description) task.description = description;
      if (status) task.status = status;
      if (dueDate) task.dueDate = dueDate;
      if (project) task.project = project;
      if (assignedTo) task.assignedTo = assignedTo;
    }

    await task.save();
    await logActivity(req.user.id, `Task ${task.status === 'Completed' ? 'Completed' : 'Updated'}`, 'Task', task._id, `Updated task: ${task.title}`);
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Admin)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      await logActivity(req.user.id, 'Task Deleted', 'Task', task._id, `Deleted task: ${task.title}`);
    }
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
