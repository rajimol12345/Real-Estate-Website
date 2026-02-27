const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.json(agent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Agent not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Add POST, PUT, DELETE routes similarly

module.exports = router;