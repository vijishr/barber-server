const User = require('../models/User')
const Service = require('../models/Service')
const Booking = require('../models/Booking')
const asyncHandler = require('../utils/asyncHandler')

// Users management
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password')
  res.json(users)
})

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  user.isBlocked = true
  await user.save()

  return res.json({ message: 'User blocked successfully' })
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  await user.deleteOne()
  return res.json({ message: 'User deleted successfully' })
})

// Services management
const addService = asyncHandler(async (req, res) => {
  const { name, price, duration, description } = req.body

  if (!name || !price || !duration) {
    return res.status(400).json({ message: 'Name, price and duration required' })
  }

  const service = await Service.create({
    name,
    price,
    duration,
    description,
  })

  return res.status(201).json(service)
})

const editService = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, price, duration, description } = req.body

  const service = await Service.findById(id)

  if (!service) {
    return res.status(404).json({ message: 'Service not found' })
  }

  service.name = name || service.name
  service.price = price ?? service.price
  service.duration = duration || service.duration
  service.description = description || service.description

  const updated = await service.save()
  return res.json(updated)
})

const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params
  const service = await Service.findById(id)

  if (!service) {
    return res.status(404).json({ message: 'Service not found' })
  }

  await service.deleteOne()
  return res.json({ message: 'Service deleted successfully' })
})

// Bookings management
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('userId', 'name email phone')
    .populate('serviceId', 'name price duration')
    .sort({ createdAt: -1 })

  res.json(bookings)
})

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['pending', 'approved', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' })
  }

  const booking = await Booking.findById(id)

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' })
  }

  booking.status = status
  const updated = await booking.save()

  return res.json(updated)
})

module.exports = {
  getAllUsers,
  blockUser,
  deleteUser,
  addService,
  editService,
  deleteService,
  getAllBookings,
  updateBookingStatus,
}

