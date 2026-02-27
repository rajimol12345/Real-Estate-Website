const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// @desc    Create new appointment
// @route   POST /api/appointments
const createAppointment = asyncHandler(async (req, res) => {
    const { propertyId, date, timeSlot, name, email, phone, notes } = req.body;

    if (!propertyId || !date || !timeSlot) {
        res.status(400);
        throw new Error('Please provide property, date, and time slot');
    }

    // Check availability (basic)
    const existing = await Appointment.findOne({
        property: propertyId,
        date: new Date(date),
        timeSlot,
        status: { $ne: 'Cancelled' }
    });

    if (existing) {
        res.status(400);
        throw new Error('This slot is already booked for this property.');
    }

    const appointment = await Appointment.create({
        property: propertyId,
        date: new Date(date),
        timeSlot,
        notes,
        user: req.user?._id // If logged in
    });

    if (appointment) {
        // Create notification for admin
        await Notification.create({
            title: 'New Showing Requested',
            message: `New appointment request for property ${propertyId} on ${date} at ${timeSlot}.`,
            type: 'system',
            link: '/appointments'
        });

        res.status(201).json(appointment);
    } else {
        res.status(400);
        throw new Error('Invalid appointment data');
    }
});

// @desc    Get all appointments
// @route   GET /api/appointments
const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({})
        .populate('property', 'title price location')
        .populate('user', 'name email')
        .sort({ date: 1 });
    res.json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        appointment.status = req.body.status || appointment.status;
        appointment.date = req.body.date ? new Date(req.body.date) : appointment.date;
        appointment.timeSlot = req.body.timeSlot || appointment.timeSlot;

        const updated = await appointment.save();
        res.json(updated);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
const deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        await appointment.deleteOne();
        res.json({ message: 'Appointment removed' });
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
});

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
};
