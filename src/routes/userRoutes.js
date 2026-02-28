const express = require('express')
const {
  getServices,
  bookAppointment,
  getMyBookings,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// Public: list services
router.get('/services', getServices)

// Protected: user bookings
router.post('/bookings', protect, bookAppointment)
router.get('/bookings/me', protect, getMyBookings)

module.exports = router

