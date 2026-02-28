const Booking = require('../models/Booking')
const Service = require('../models/Service')
const asyncHandler = require('../utils/asyncHandler')

// POST /api/bookings (user)
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, date, time, notes, fullName, phone } = req.body

  if (!serviceId || !date || !time) {
    return res.status(400).json({ message: 'serviceId, date, time are required' })
  }

  const service = await Service.findById(serviceId)
  if (!service) {
    return res.status(404).json({ message: 'Service not found' })
  }

  const booking = await Booking.create({
    userId: req.user._id,
    serviceId,
    date,
    time,
    notes,
    customerName: fullName || req.user.name,
    customerPhone: phone || req.user.phone,
  })

  res.status(201).json(booking)
})

// GET /api/bookings (admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('userId', 'name email phone')
    .populate('serviceId', 'name price duration')
    .sort({ createdAt: -1 })

  res.json(bookings)
})

// GET /api/bookings/me (user)
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('serviceId', 'name price duration')
    .sort({ createdAt: -1 })

  res.json(bookings)
})

// PATCH /api/bookings/:id/status (admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!['pending', 'approved', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  const booking = await Booking.findById(req.params.id)
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' })
  }

  booking.status = status
  const updated = await booking.save()
  res.json(updated)
})

module.exports = {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
}

