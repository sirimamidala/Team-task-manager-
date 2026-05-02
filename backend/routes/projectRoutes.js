const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Project = require('../models/Project');
const Task = require('../models/Task');
const logActivity = require('../utils/activityLogger');

const router = express.Router();

// @route   POST /api/projects
// @desc    Create a project
// @access  Private (Admin)
router.post('/', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const { title, description, deadline, members } = req.body;
    const newProject = new Project({ title, description, deadline, members });
    const project = await newProject.save();
    await logActivity(req.user.id, 'Project Created', 'Project', project._id, `Created project: ${project.title}`);
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/projects
// @desc    Get all projects (Admin sees all, Members see assigned)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find().populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user.id }).populate('members', 'name email');
    }
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (Admin)
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    await logActivity(req.user.id, 'Project Deleted', 'Project', project._id, `Deleted project: ${project.title}`);
    res.json({ message: 'Project and associated tasks removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
