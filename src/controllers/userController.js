const Booking = require('../models/Booking')
const Service = require('../models/Service')
const asyncHandler = require('../utils/asyncHandler')

// User API: view services
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 })
  res.json(services)
})

// User API: book appointment
const bookAppointment = asyncHandler(async (req, res) => {
  const { serviceId, date, time, notes } = req.body

  if (!serviceId || !date || !time) {
    return res
      .status(400)
      .json({ message: 'Service, date, and time are required' })
  }

  const booking = await Booking.create({
    userId: req.user._id,
    serviceId,
    date,
    time,
    notes,
  })

  return res.status(201).json(booking)
})

// User API: view own bookings
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('serviceId', 'name price duration')
    .sort({ createdAt: -1 })

  res.json(bookings)
})

module.exports = {
  getServices,
  bookAppointment,
  getMyBookings,
}

