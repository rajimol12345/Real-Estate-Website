const asyncHandler = require('express-async-handler');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private/Admin
const getLeads = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Lead.countDocuments({});
    const leads = await Lead.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.json({
        leads,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
    });
});

// @desc    Create a new lead (public - from chatbot)
// @route   POST /api/leads
// @access  Public
const createLead = asyncHandler(async (req, res) => {
    const { name, email, phone, budget, interest } = req.body;

    const lead = await Lead.create({
        name,
        email,
        phone,
        budget,
        interest
    });

    if (lead) {
        // Create Notification for Admin
        await Notification.create({
            title: 'New Lead Generated',
            message: `${name} is interested in ${interest} with a budget of ${budget}.`,
            type: 'lead',
            link: '/leads'
        });

        res.status(201).json(lead);
    } else {
        res.status(400);
        throw new Error('Invalid lead data');
    }
});

// @desc    Update lead status
// @route   PUT /api/leads/:id
// @access  Private/Admin
const updateLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        lead.status = req.body.status || lead.status;
        lead.notes = req.body.notes || lead.notes;
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } else {
        res.status(404);
        throw new Error('Lead not found');
    }
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private/Admin
const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        await lead.deleteOne();
        res.json({ message: 'Lead removed' });
    } else {
        res.status(404);
        throw new Error('Lead not found');
    }
});

module.exports = {
    getLeads,
    createLead,
    updateLead,
    deleteLead
};
