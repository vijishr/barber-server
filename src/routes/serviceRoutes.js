const express = require('express')
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

const router = express.Router()

// Public
router.get('/', getServices)

// Admin protected
router.post('/', protect, adminOnly, createService)
router.put('/:id', protect, adminOnly, updateService)
router.delete('/:id', protect, adminOnly, deleteService)

module.exports = router

