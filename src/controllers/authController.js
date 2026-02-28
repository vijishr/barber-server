const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')
const generateToken = require('../utils/generateToken')

// Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' })
  }

  // Demo-friendly: first registered account becomes admin.
  // This makes it easy to bootstrap an admin without a seed script.
  const userCount = await User.countDocuments()

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: userCount === 0 ? 'admin' : 'user',
  })

  const token = generateToken(user._id, user.role)

  return res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  })
})

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: 'User is blocked' })
  }

  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = generateToken(user._id, user.role)

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  })
})

module.exports = {
  registerUser,
  loginUser,
}

