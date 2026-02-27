const asyncHandler = require('express-async-handler');
const Agent = require('../models/Agent');
const { translateText } = require('../utils/translator');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
const getAgents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const total = await Agent.countDocuments({});
    const agents = await Agent.find({})
        .skip(skip)
        .limit(limit);

    res.json({
        agents,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Public
const getAgentById = asyncHandler(async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (agent) {
            res.json(agent);
        } else {
            res.status(404);
            throw new Error('Agent not found');
        }
    } catch (error) {
        if (error.name === 'CastError') {
            res.status(400);
            throw new Error(`Invalid Agent ID format: ${req.params.id}`);
        }
        throw error;
    }
});

// @desc    Create agent
// @route   POST /api/agents
// @access  Private/Admin
const createAgent = asyncHandler(async (req, res) => {
    const { description, ...otherData } = req.body;
    
    // Auto-translate description (Write-Time Translation)
    const translatedDesc = typeof description === 'string' ? await translateText(description) : description;

    const agent = new Agent({
        description: translatedDesc,
        ...otherData
    });

    const createdAgent = await agent.save();
    res.status(201).json(createdAgent);
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
const updateAgent = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        const { description, ...otherData } = req.body;

        // Handle localized description update
        if (description) {
            agent.description = typeof description === 'string' ? await translateText(description) : description;
        }

        Object.assign(agent, otherData);
        const updatedAgent = await agent.save();
        res.json(updatedAgent);
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
const deleteAgent = asyncHandler(async (req, res) => {
    const agent = await Agent.findById(req.params.id);

    if (agent) {
        await agent.deleteOne();
        res.json({ message: 'Agent removed' });
    } else {
        res.status(404);
        throw new Error('Agent not found');
    }
});

module.exports = {
    getAgents,
    getAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
};
