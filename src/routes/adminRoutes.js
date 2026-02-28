const express = require('express')
const {
  getAllUsers,
  blockUser,
  deleteUser,
  addService,
  editService,
  deleteService,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect, adminOnly)

// User management
router.get('/users', getAllUsers)
router.patch('/users/:id/block', blockUser)
router.delete('/users/:id', deleteUser)

// Service management
router.post('/services', addService)
router.put('/services/:id', editService)
router.delete('/services/:id', deleteService)

// Booking management
router.get('/bookings', getAllBookings)
router.patch('/bookings/:id/status', updateBookingStatus)

module.exports = router

