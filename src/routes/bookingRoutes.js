const express = require('express')
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBookingStatus,
} = require('../controllers/bookingController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

// Admin: view all bookings
router.get('/', protect, adminOnly, getAllBookings)
router.patch('/:id/status', protect, adminOnly, updateBookingStatus)

// User: create booking
router.post('/', protect, createBooking)

// User: view own bookings
router.get('/me', protect, getMyBookings)

module.exports = router

