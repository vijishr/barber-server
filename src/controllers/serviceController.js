const Service = require('../models/Service')
const asyncHandler = require('../utils/asyncHandler')

// GET /api/services (public)
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 })
  res.json(services)
})

// POST /api/services (admin)
const createService = asyncHandler(async (req, res) => {
  const { name, price, duration, description } = req.body

  if (!name || price === undefined || !duration) {
    return res.status(400).json({ message: 'name, price, duration are required' })
  }

  const service = await Service.create({
    name,
    price,
    duration,
    description,
  })

  res.status(201).json(service)
})

// PUT /api/services/:id (admin)
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    return res.status(404).json({ message: 'Service not found' })
  }

  const { name, price, duration, description } = req.body

  service.name = name ?? service.name
  service.price = price ?? service.price
  service.duration = duration ?? service.duration
  service.description = description ?? service.description

  const updated = await service.save()
  res.json(updated)
})

// DELETE /api/services/:id (admin)
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    return res.status(404).json({ message: 'Service not found' })
  }
  await service.deleteOne()
  res.json({ message: 'Service deleted' })
})

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
}

